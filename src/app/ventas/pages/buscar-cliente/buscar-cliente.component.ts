import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { BackendService } from 'src/app/services/backend.service';
import { SocketsioService } from 'src/app/services/socketsio.service';
import {environment} from '../../../../environments/environment';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.css']
})
export class BuscarClienteComponent implements OnInit {

  token:any;
  clientes:any=null;
  forma:FormGroup = new FormGroup({});

  constructor(private router: Router, private api:BackendService, private socket:SocketsioService, private formBuilder:FormBuilder, public modalService: NgbModal) {
    $('body').css("background-image","url('./assets/78-04.png')");
    $('body').css("background-repeat","no-repeat");
    $('body').css("background-attachment","fixed");
    $('body').css("background-position","center center");
    $('body').css("background-size","cover");
    this.checkToken();
    this.crearFormulario();
  }

  ngOnInit(): void {
    sessionStorage.removeItem('cliente');
    this.api.metodo('cliente','GET',this.token,{})?.subscribe((data:any)=>{
      this.clientes=data['clientes'];
    });
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

  guardarCliente(){
    console.log("entro");
    if(this.forma.valid){
      sessionStorage.setItem('clienteId',this.forma.controls['cliente'].value);
      this.guardarClienteEnSesion();
      // const modalRef = this.modalService.open();
      // modalRef.result.then((data:any) => {
      //   if(data.ok==true){
      //     alert("vamos a otra pagina");
      //   }
      // })
      // .catch((data:any) => {

      // });
    }
  }

  crearFormulario(){
    this.forma=this.formBuilder.group({
      cliente:['', [Validators.required, Validators.minLength(1)]],
    });
  }

  guardarClienteEnSesion(){
    for (let i = 0; i < this.clientes.length; i++) {
      if(this.clientes[i]._id == this.forma.controls['cliente'].value){
        sessionStorage.setItem('cliente',this.clientes[i].nombreCompleto);
        return;
      }
    }
  }

}
