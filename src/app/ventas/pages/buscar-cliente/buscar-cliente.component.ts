import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { BackendService } from 'src/app/services/backend.service';
import { SocketsioService } from 'src/app/services/socketsio.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.css']
})
export class BuscarClienteComponent implements OnInit {

  token:any;

  constructor(private router: Router, private api:BackendService, private socket:SocketsioService) {
    this.checkToken()
  }

  ngOnInit(): void {
  }

  async logOut(){
    let token:any = jwtDecode(this.token);
    localStorage.removeItem('jwt');
    await this.api.metodo('logout','POST',this.token,{usuario:token.usuario})?.subscribe(data=>console.log(data));
    this.socket.emit('logOut',{token:this.token,apikey:environment.apiKey});
    this.router.navigateByUrl('/auth/login');
  }

  checkToken(){
    this.token = localStorage.getItem('jwt');
  }

}
