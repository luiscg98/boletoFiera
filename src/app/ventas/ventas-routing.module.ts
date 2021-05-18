import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';
import { BuscarClienteComponent } from './pages/buscar-cliente/buscar-cliente.component';

const routes: Routes = [
  {
    path: '',
    children: [
        { path: 'buscarClientes', canActivate:[LoginGuard] , component: BuscarClienteComponent},
        { path: '', redirectTo: 'buscarClientes', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
