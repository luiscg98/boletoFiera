import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { DataService } from 'src/app/services/data.service';
import { SocketsioService } from 'src/app/services/socketsio.service';
import { ModalComponent } from 'src/app/ventas/pages/modal/modal.component';

@Component({
  selector: 'app-sector-b2',
  templateUrl: './sector-b2.component.html',
  styleUrls: ['./sector-b2.component.css'],
})
export class SectorB2Component implements OnInit {

  butacas:any[]=[];
  suscription$:Subscription = new Subscription;
  actualizarSocket$:Subscription = new Subscription;

  constructor(private data:DataService, private api:BackendService, private socket:SocketsioService, public modalService: NgbModal) {
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
    await this.api.metodo('butacasByZona/B2','GET','',{})?.subscribe((data:any)=>{
      this.butacas=data['butacas'];
    });
  }

  async alerta(Butaca:any){
    let resultado = this.butacas.find( butaca => (butaca.numeroButaca === Butaca.numero && butaca.fila === Butaca.fila));
    if(resultado != -1){
      if(resultado.estado==0){
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.sector = 'B2';
        modalRef.result.then((data:any) => {
          if(data.ok==true){
            resultado.estado=1;
            let arreglo = this.butacas.findIndex(butaca => butaca._id === resultado._id);
            this.butacas[arreglo] = resultado;
            this.data.sendButaca({butaca:this.butacas[arreglo],tarjeta:{folio:data.folio,sector:"Platea Poniente B2"}});
            this.socket.emit('c2Seleccionada',{modo:1,resultado:[this.butacas[arreglo]]});
          }
        })
        .catch((data:any) => {

        });
      }
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.suscription$.unsubscribe();
    this.actualizarSocket$.unsubscribe();
  }

}
