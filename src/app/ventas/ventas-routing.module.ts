import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoClienteGuard } from '../guards/info-cliente.guard';
import { LoginGuard } from '../guards/login.guard';
import { BuscarClienteComponent } from './pages/buscar-cliente/buscar-cliente.component';
import { VentaboletosComponent } from './pages/ventaboletos/ventaboletos.component';

const routes: Routes = [
  {
    path: '',
    children: [
        { path: 'buscarClientes', canActivate:[LoginGuard] , component: BuscarClienteComponent},
        { path: 'ventaBoletos/:componente/:ote',canActivate:[InfoClienteGuard] , component: VentaboletosComponent},
        { path: '', redirectTo: 'buscarClientes', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
