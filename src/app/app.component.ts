import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SocketsioService } from './services/socketsio.service';
import {environment} from '../environments/environment';
import {} from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'boletoFiera';
  token:any;

  constructor(private socket:SocketsioService){
    this.checkToken();
  }

  ngOnInit(){
    if(this.token!=null){
      this.socket.emit('actualizarSocket',{token:this.token, apiKey:environment.apiKey});
    }
  }

  checkToken(){
    this.token = localStorage.getItem('jwt');
  }
}
