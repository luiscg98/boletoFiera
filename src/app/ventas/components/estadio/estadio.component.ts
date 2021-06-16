import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-estadio',
  templateUrl: './estadio.component.html',
  styleUrls: ['./estadio.component.css']
})
export class EstadioComponent implements OnInit {

  constructor(private data:DataService) { }

  ngOnInit(): void {
  }

  alertas(zona:string){
    if(zona=='C2'){
      this.data.sendCriterio({estadoComponente:2,estadoOte:0});
      window.history.pushState(null,'',`#/ventas/ventaBoletos/${2}/${0}`);
    }
    if(zona=='B2'){
      this.data.sendCriterio({estadoComponente:1,estadoOte:0});
      window.history.pushState(null,'',`#/ventas/ventaBoletos/${1}/${0}`);
    }
    if(zona=='T2'){
      this.data.sendCriterio({estadoComponente:4,estadoOte:0});
      window.history.pushState(null,'',`#/ventas/ventaBoletos/${4}/${0}`);
    }
    if(zona=='T1'){
      this.data.sendCriterio({estadoComponente:3,estadoOte:0});
      window.history.pushState(null,'',`#/ventas/ventaBoletos/${3}/${0}`);
    }
    if(zona=="OTE"){
      this.data.sendCriterio({estadoComponente:5,estadoOte:0});
      window.history.pushState(null,'',`#/ventas/ventaBoletos/${5}/${0}`);
    }
  }

}
