import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { BuscarClienteComponent } from './pages/buscar-cliente/buscar-cliente.component';
import { VentaboletosComponent } from './pages/ventaboletos/ventaboletos.component';
import { EstadioComponent } from './components/estadio/estadio.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SectorC2Component } from './components/butacas/plateasponiente/sector-c2/sector-c2.component';
import { SectorB2Component } from './components/butacas/plateasponiente/sector-b2/sector-b2.component';
import { SectorTradicional2Component } from './components/butacas/plateasponiente/sector-tradicional2/sector-tradicional2.component';
import { SectorTradicionalComponent } from './components/butacas/plateasponiente/sector-tradicional/sector-tradicional.component';
import { PlantillaCentralComponent } from './components/butacas/plateasoriente/plantilla-central/plantilla-central.component';
import { PlantillaLateralComponent } from './components/butacas/plateasoriente/plantilla-lateral/plantilla-lateral.component';
import { RecuadroComponent } from './components/butacas/plateasoriente/recuadro/recuadro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from './pages/modal/modal.component';
import { InfoComponent } from './pages/info/info.component';


@NgModule({
  declarations: [
    BuscarClienteComponent,
    VentaboletosComponent,
    EstadioComponent,
    NavbarComponent,
    SectorC2Component,
    SectorB2Component,
    SectorTradicional2Component,
    SectorTradicionalComponent,
    PlantillaCentralComponent,
    PlantillaLateralComponent,
    RecuadroComponent,
    ModalComponent,
    InfoComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
