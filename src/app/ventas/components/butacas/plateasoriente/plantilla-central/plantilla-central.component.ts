import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { DataService } from 'src/app/services/data.service';
import { SocketsioService } from 'src/app/services/socketsio.service';
import { ModalComponent } from 'src/app/ventas/pages/modal/modal.component';

@Component({
  selector: 'app-plantilla-central',
  templateUrl: './plantilla-central.component.html',
  styleUrls: ['./plantilla-central.component.css']
})
export class PlantillaCentralComponent implements OnInit, OnDestroy {

  estadoComponente:number=0;
  estadoOte:number=0;
  butacas:any[]=[];
  sectorx:any='1';
  sectory:any='2';
  suscription$:Subscription=new Subscription;
  actualizarSocket$:Subscription=new Subscription;

  constructor(private data:DataService, private _route:ActivatedRoute, private api:BackendService, private socket:SocketsioService, private modalService:NgbModal) {
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
    this.asignacionXY();
    if(this.estadoOte<=10){
      await this.api.metodo(`butacasByZonas/${this.sectorx}/${this.sectory}`,'GET','',{})?.subscribe((data:any)=>{
        this.butacas=data['butacas'];
      });
    }
    else{
      await this.api.metodo(`butacasByZonasInverso/${this.sectorx}/${this.sectory}`,'GET','',{})?.subscribe((data:any)=>{
        this.butacas=data['butacas'];
      });
    }
  }

  alerta(Butaca:any){
    let resultado = this.butacas.find( butaca => (butaca.numeroButaca === Butaca.numeroButaca && butaca.fila === Butaca.fila && butaca.zona == Butaca.sector));
    if(resultado != -1 && resultado != undefined){
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

  asignacionXY(){
    if(this.estadoOte==2){
      this.sectorx=32;
      this.sectory=34;
      return;
    }
    else if(this.estadoOte==3){
      this.sectorx=28;
      this.sectory=30;
      return;
    }
    else if(this.estadoOte==4){
      this.sectorx=24;
      this.sectory=26;
      return;
    }
    else if(this.estadoOte==5){
      this.sectorx=20;
      this.sectory=22;
      return;
    }
    else if(this.estadoOte==6){
      this.sectorx=16;
      this.sectory=18;
      return;
    }
    else if(this.estadoOte==7){
      this.sectorx=12;
      this.sectory=14;
      return;
    }
    else if(this.estadoOte==8){
      this.sectorx=8;
      this.sectory=10;
      return;
    }
    else if(this.estadoOte==9){
      this.sectorx=4;
      this.sectory=6;
      return;
    }
    else if(this.estadoOte==10){
      this.sectorx=1;
      this.sectory=2;
      return;
    }
    else if(this.estadoOte==11){
      this.sectorx=5;
      this.sectory=3;
      return;
    }
    else if(this.estadoOte==12){
      this.sectorx=9;
      this.sectory=7;
      return;
    }
    else if(this.estadoOte==13){
      this.sectorx=13;
      this.sectory=11;
      return;
    }
    else if(this.estadoOte==14){
      this.sectorx=17;
      this.sectory=15;
      return;
    }
    else if(this.estadoOte==15){
      this.sectorx=21;
      this.sectory=19;
      return;
    }
    else if(this.estadoOte==16){
      this.sectorx=25;
      this.sectory=23;
      return;
    }
    else if(this.estadoOte==17){
      this.sectorx=29;
      this.sectory=27;
      return;
    }
    else{
      this.sectorx=33;
      this.sectory=31;
      return;
    }
  }

  ngOnDestroy(): void {
    this.suscription$.unsubscribe();
    this.actualizarSocket$.unsubscribe();
  }

}
