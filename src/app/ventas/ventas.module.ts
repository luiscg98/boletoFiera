import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { BuscarClienteComponent } from './pages/buscar-cliente/buscar-cliente.component';


@NgModule({
  declarations: [
    BuscarClienteComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
