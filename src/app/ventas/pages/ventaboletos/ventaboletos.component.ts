import { Component, OnInit, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import jwt_Decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { DataService } from 'src/app/services/data.service';
import { SocketsioService } from 'src/app/services/socketsio.service';
import {environment} from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-ventaboletos',
  templateUrl: './ventaboletos.component.html',
  styleUrls: ['./ventaboletos.component.css']
})
export class VentaboletosComponent implements OnInit {

  comprar:boolean=true;
  estado:number=0;
  token:any;
  tokenDecode:any;
  cliente:any;
  comprados:any[]=[];
  suscription$:Subscription = new Subscription;
  suscription2$:Subscription = new Subscription;
  estadoComponente:number=0;
  total:number=0;
  forma:FormGroup = new FormGroup({});
  estadoPasado:number=0;
  estadoOte:number=0;
  formasDePago:number=0;
  infoCliente:any={};

  constructor(private _route: ActivatedRoute,private router:Router, private socket:SocketsioService, private api:BackendService, private data:DataService, private formBuilder:FormBuilder) {
    $('body').css("background-image","none");
    this.checkToken();
    this.crearFormulario();

    this.suscription$ = this.data.onListenCriterio().subscribe((data:any)=>{
      this.estadoComponente=data.estadoComponente;
      this.estadoOte=data.estadoOte;
    });

    this.suscription2$ = this.data.onListenButaca().subscribe((data:any)=>{
      this.comprar=false;
      this.comprados.unshift(data);
      if(this.formasDePago==0){
        this.total=this.total+data.butaca.precio;
      }
      else if(this.formasDePago==1){
        this.total=this.total+(data.butaca.precio*0);
      }
      else{
        this.total=this.total+(data.butaca.precio*.70);
      }
    });
  }

  ngOnInit(): void {
    this.estadoComponente = Number(this._route.snapshot.paramMap.get('componente'));
    this.estadoOte = Number(this._route.snapshot.paramMap.get('ote'));
    this.tokenDecode=jwt_Decode(this.token);
    $(".padre-boletera .metodosPago .pagos .iconosPagos .efectivo").css("color","#009975");
    $(".padre-boletera .metodosPago .pagos .iconosPagos .credito").css("color","grey");
    $(".padre-boletera .metodosPago .pagos .iconosPagos .ambos").css("color","grey");
    this.api.metodo(`clienteById/${sessionStorage.getItem('clienteId')}`,'GET','',{})?.subscribe((data:any)=>{
      this.infoCliente=data['cliente'];
    });
  }


  checkToken(){
    this.token=localStorage.getItem('jwt');
    this.cliente=sessionStorage.getItem('cliente');
  }

  async logOut(){
    let token:any = jwt_Decode(this.token);
    localStorage.removeItem('jwt');
    await this.api.metodo('logout','POST',this.token,{usuario:token.usuario})?.subscribe(data=>console.log(data));
    this.socket.emit('logOut',{token:this.token,apikey:environment.apiKey});
    this.router.navigateByUrl('/auth/login');
  }

  changeColor(numero:number){
    if(numero==1){
      $(".padre-boletera .metodosPago .pagos .iconosPagos .efectivo").css("color","#009975");
      $(".padre-boletera .metodosPago .pagos .iconosPagos .credito").css("color","grey");
      $(".padre-boletera .metodosPago .pagos .iconosPagos .ambos").css("color","grey");
    }
    else if(numero==2){
      $(".padre-boletera .metodosPago .pagos .iconosPagos .efectivo").css("color","grey");
      $(".padre-boletera .metodosPago .pagos .iconosPagos .credito").css("color","#009975");
      $(".padre-boletera .metodosPago .pagos .iconosPagos .ambos").css("color","grey");
    }
    else{
      $(".padre-boletera .metodosPago .pagos .iconosPagos .efectivo").css("color","grey");
      $(".padre-boletera .metodosPago .pagos .iconosPagos .credito").css("color","grey");
      $(".padre-boletera .metodosPago .pagos .iconosPagos .ambos").css("color","#009975");
    }
  }

  borrar(i:number){
    if(this.comprados.length==1){
      this.comprar=true;
    }
    this.comprados[i].butaca.estado=0;
    this.socket.emit('c2Seleccionada',{modo:1,resultado:[this.comprados[i].butaca]});
    this.data.sendDelete(this.comprados[i].butaca);
    if(this.formasDePago==0){
      this.total=this.total-this.comprados[i].butaca.precio;
    }
    else if(this.formasDePago==1){
      this.total=0;
    }
    else{
      this.total=this.total-(this.comprados[i].butaca.precio*.70);
    }
    this.comprados.splice(i,1);
  }

  pagar(){
    // if(this.comprados.length!=0){
      const pdf = new PdfMakeWrapper();
      Swal.fire({
        title: 'Proceso de compra',
        text: '¿Seguro que quieres procesar la compra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor:'#009975',
        cancelButtonText: 'No',
        cancelButtonColor:'red'
      }).then(async (result) => {
        if (result.isConfirmed) {
          if(this.forma.controls['cortesia'].value == true){
            alert("COLOCA LA CLAVE DE SEGURIDAD, SI NO LA CONOCES LLAMA A LA ENCARGADA");
          }
          else if(this.forma.controls['venta'].value == true){
            let body = {
              transaccion:this.comprados,
              cliente:sessionStorage.getItem('clienteId')
            }
            // await this.api.metodo('pagar','POST','',body)?.subscribe( async (data:any)=>{
            //   this.socket.emit('c2Seleccionada',{butacas:this.comprados,modo:2});
            //   this.comprados = [];
            //   this.crearFormulario();
            //   this.total = 0;
              pdf.header([new Txt("FUERZA DEPORTIVA DEL CLUB LEÓN").alignment('center').bold().end, new Txt("FOLIO: 1").alignment('right').end]);
              pdf.add(new Txt([new Txt(`NOMBRE: `).bold().end, `${this.infoCliente.nombreCompleto}`]).end);
              pdf.add(new Txt([new Txt(`EMAIL: `).bold().end, `${this.infoCliente.email}`]).end);
              pdf.add(new Txt([new Txt(`TELÉFONO: `).bold().end, `${this.infoCliente.telefono}`]).end);
              pdf.add(new Txt([new Txt(`NO. DE TÍTULO: `).bold().end, `100`]).end);
              // [pdf.add(new Txt('ATN. GERARDO HIPOLITO CABRERA ACOSTA').bold().fontSize(10).alignment('left').end);
              // pdf.add(new Txt('REPRESENTANTE LEGAL').bold().fontSize(10).alignment('left').end);
              // pdf.add(new Txt('FUERZA DEPORTIVA DEL CLUB LEON S.A DE C.V').bold().fontSize(10).alignment('left').end);
              // pdf.add(new Txt('P   R   E   S   E   N   T   E.').bold().fontSize(10).alignment('left').margin([0,0,0,20]).end);
              // pdf.add(new Txt([", así mismo en este acto me constituyo en ", new Txt("DEPOSITARIO ").bold().end, "del equipo que con esta fecha se me entrega, asumiendo las obligaciones contenidas en los artículos 2506, 2512, y demás relativos y aplicables del Código Civil para el Estado de Hidalgo, renunciado desde este momento a percibir de la Institución contraprestación alguna por virtud del DEPOSITO que con esta fecha se me confía, ya que el equipo que se me entrega, lo he de utilizar en el desempeño de mis funciones, sin que lo anterior quede eximido de indemnizar a la Institución si por descuido o negligencia el equipo materia del depósito, se pierde o deteriora, además en este acto acepto que el incumplimiento de los términos contenidos en el presente documento, puede acarrear responsabilidades civiles y penales, como las contenidas en el artículo 211 del Código Penal vigente."]).margin([0,0,0,15]).fontSize(9).alignment('justify').end);
              // pdf.add(new Txt("Así mismo me obligo de manera expresa a cumplir con las siguientes obligaciones, contenidas en el Reglamento para Asignación de Equipos de Fuerza Deportiva del Club León:").margin([0,0,0,15]).fontSize(9).alignment('justify').end);
              // pdf.add(new Txt(["Los ", new Txt("DEPOSITARIOS ").bold().end, "de los Activos de Cómputo asignados y distribuidos son responsables principales por la legalidad del software que ellos instalen en los mismos o que ya venga pre instalado, queda expresamente prohibido que los usuarios-depositarios de los equipos de cómputo propiedad de la empresa, instalen en los mismos cualquier software no licenciado o que sea ajeno a las funciones para las cuales se entregó el equipo."]).margin([0,0,0,15]).alignment('justify').fontSize(9).end);
              // pdf.add(new Txt(["Los ", new Txt("DEPOSITARIOS ").bold().end, "utilizarán los programas de software sólo en virtud de los acuerdos de licencia y no instalarán copias no autorizadas de software comercial."]).fontSize(9).margin([0,0,0,15]).alignment('justify').end);
              // pdf.add(new Txt(["Los ", new Txt("DEPOSITARIOS ").bold().end, "no descargarán, ni cargarán programas de software no autorizados a través de Internet."]).alignment('justify').fontSize(9).margin([0,0,0,15]).end);
              // pdf.add(new Txt(["Los ", new Txt("DEPOSITARIOS ").bold().end, "que se enteren de cualquier uso inadecuado que se haga de los programas de software o la documentación vinculada a estos, deberán notificar al jefe inmediato o director del área en el que trabajan o al área legal."]).fontSize(9).alignment('justify').margin([0,0,0,15]).end);
              // pdf.add(new Txt(["Según las leyes vigentes de derechos de autor, las personas involucradas en la reproducción ilegal de software pueden estar sujetas a sanciones civiles y penales, incluidas multas y prisión. ", new Txt("FUERZA DEPORTIVA DEL CLUB LEON,").bold().end, " no permite, favorece, o tolera, la duplicación ilegal de software. Los", new Txt(" DEPOSITARIOS").bold().end, " que realicen, adquieran o utilicen copias no autorizadas de software estarán sujetos a sanciones disciplinarias internas de acuerdo a las circunstancias. Dichas sanciones pueden incluir suspensiones o inclusive la rescisión del contrato de trabajo, sin responsabilidad para la Institución. Además estarán sujetos al cumplimiento de", new Txt(" LA POLITICA DE INTEGRIDAD DE LA EMPRESA.").bold().end]).alignment('justify').fontSize(9).margin([0,0,0,15]).end);
              // pdf.add(new Txt(["Cualquier duda respecto a si cualquier empleado puede copiar o utilizar un determinado programa informático, debe consultarse con el jefe inmediato o director de área y en su defecto, con el área correspondiente."]).alignment('justify').fontSize(9).margin([0,0,0,130]).end)
              // pdf.add(new Txt("_____________________________________________").alignment("center").bold().end);]
              await pdf.create().download();
              // this.router.navigateByUrl('/ventas/buscarClientes');
              Swal.fire(
                '¡Compra realizada!',
                'Tu compra fue realizada con exito',
                'success'
              )
            // },(err:any)=>{
            //   alert(err);
            // });
          }
          else if(this.forma.controls['amparado'].value == true){
            alert("VENTA REALIZADA CON EXITO");
            this.router.navigateByUrl('/ventas/buscarClientes');
          }
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Proceso cancelado',
            'Tu compra ha sido cancelada',
            'error'
          )
        }
      })
    // }
  }

  crearFormulario(){
    this.forma=this.formBuilder.group({
      venta:[true],
      cortesia:[false],
      amparado:[false],
    });
  }

  checkBox(numero:number){
    if(numero == 0){
      this.formasDePago=0;
      this.total = 0;
      this.forma.controls['venta'].setValue(true);
      this.forma.controls['cortesia'].setValue(false);
      this.forma.controls['amparado'].setValue(false);
      for (let i = 0; i < this.comprados.length; i++) {
        this.total = this.total + this.comprados[i].butaca.precio;
      }
    }
    else if(numero == 1){
      this.formasDePago=1;
      this.forma.controls['venta'].setValue(false);
      this.forma.controls['cortesia'].setValue(true);
      this.forma.controls['amparado'].setValue(false);
      this.total = 0;
    }
    else if(numero == 2){
      this.formasDePago=2;
      this.total = 0;
      this.forma.controls['venta'].setValue(false);
      this.forma.controls['cortesia'].setValue(false);
      this.forma.controls['amparado'].setValue(true);
      for (let i= 0; i < this.comprados.length; i++) {
        this.total = this.total + this.comprados[i].butaca.precio;
      }
      this.total=this.total*.70;
    }
  }

  regresar(){
    if(this.estadoComponente == 1  || this.estadoComponente == 2 || this.estadoComponente == 4 || this.estadoComponente == 3 || (this.estadoComponente == 5 && this.estadoOte == 0)){
      this.estadoComponente = 0;
      this.estadoOte = 0;
    }
    else if(this.estadoComponente == 5 && this.estadoOte != 0){
      this.estadoComponente = 5;
      this.estadoOte = 0;
    }
  }

  cancelar(){
    this.comprados=[];
    sessionStorage.removeItem('cliente');
    sessionStorage.removeItem('clienteId');
    this.router.navigateByUrl('ventas/buscarClientes');
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.suscription$.unsubscribe();
    this.suscription2$.unsubscribe();
  }

}
