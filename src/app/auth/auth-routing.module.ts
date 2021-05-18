import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenGuard } from '../guards/token.guard';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    children: [
        { path: 'login', canActivate:[TokenGuard] ,component: LoginComponent},
        { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
