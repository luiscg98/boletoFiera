import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { DataService } from 'src/app/services/data.service';
import { SocketsioService } from 'src/app/services/socketsio.service';
import { ModalComponent } from 'src/app/ventas/pages/modal/modal.component';

@Component({
  selector: 'app-plantilla-lateral',
  templateUrl: './plantilla-lateral.component.html',
  styleUrls: ['./plantilla-lateral.component.css']
})
export class PlantillaLateralComponent implements OnInit {

  estadoComponente:number=0;
  estadoOte:number=0;
  texto:string='';
  suscription$:Subscription = new Subscription;
  butacas:any[]=[];
  actualizarSocket$:Subscription = new Subscription;

  constructor(private _route:ActivatedRoute, private socket:SocketsioService, private data:DataService, private api:BackendService, public modalService:NgbModal) {
    this.suscription$ = this.data.onListenDelete().subscribe((data:any)=>{
      let r = this.butacas.findIndex(butaca => butaca._id == data._id);
      this.butacas[r].estado=0;
    });

    this.actualizarSocket$ = this.socket.on('c2Actualizar').subscribe((butacaSocket:any)=>{
      let index = this.butacas.findIndex(butaca => butaca._id === butacaSocket.resultado._id)
      this.butacas[index] = butacaSocket.resultado;
    });
  }

  async ngOnInit(): Promise<void> {
    this.estadoComponente = Number(this._route.snapshot.paramMap.get('componente'));
    this.estadoOte = Number(this._route.snapshot.paramMap.get('ote'));
    if(this.estadoOte==1){
      this.texto='SUR'
      await this.api.metodo('butacasByZona/SUR','GET','',{})?.subscribe((data:any)=>{
        this.butacas=data['butacas'];
      });
    }
    else{
      this.texto='NORTE'
      await this.api.metodo('butacasByZona/NORTE','GET','',{})?.subscribe((data:any)=>{
        this.butacas=data['butacas'];
      });
    }
  }

  alerta(Butaca:any){
    let resultado = this.butacas.find( butaca => (butaca.numeroButaca === Butaca.numeroButaca && butaca.fila === Butaca.fila));
    if(resultado != -1){
      if(resultado.estado==0){
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.sector = 'ORI';
        modalRef.result.then((data:any) => {
          if(data.ok==true){
            resultado.estado=1;
            let arreglo = this.butacas.findIndex(butaca => butaca._id === resultado._id);
            this.butacas[arreglo] = resultado;
            this.data.sendButaca({butaca:this.butacas[arreglo],tarjeta:{folio:data.folio,sector:"Platea Oriente"}});
            this.socket.emit('c2Seleccionada',{modo:1,resultado:[this.butacas[arreglo]]});
          }
        })
        .catch((data:any) => {

        });
      }
    }
  }

  ngOnDestroy(): void {
    this.suscription$.unsubscribe();
    this.actualizarSocket$.unsubscribe();
  }

}
