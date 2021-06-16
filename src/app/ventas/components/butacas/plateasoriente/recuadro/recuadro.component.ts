import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-recuadro',
  templateUrl: './recuadro.component.html',
  styleUrls: ['./recuadro.component.css']
})
export class RecuadroComponent implements OnInit {

  constructor(private data:DataService, private route:Router) { }



  ngOnInit(): void {
  }

  async alerta(numero:Number){
    this.route.navigateByUrl(`ventas/ventaBoletos/5/${numero}`)
    this.data.sendCriterio({estadoComponente:5,estadoOte:numero});
  }

}
