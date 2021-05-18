import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {environment} from '../../../../environments/environment'
import { BackendService } from 'src/app/services/backend.service';
import { Router } from '@angular/router';
import { SocketsioService } from 'src/app/services/socketsio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forma:FormGroup = new FormGroup({});
  boton:boolean=false;

  constructor(private formBuilder:FormBuilder, private api:BackendService, private router: Router, private socket:SocketsioService) {
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  login(){
    this.boton=true;
    if(!this.forma.invalid){
      let body = {
        usuario:this.forma.controls['usuario'].value,
        contraseña:this.forma.controls['contraseña'].value,
        trabajador:this.forma.controls['trabajador'].value,
        apikey:environment.apiKey
      }
      this.api.metodo('login','POST','',body)?.subscribe((data:any) =>{
        localStorage.setItem('jwt',data['token']);
        this.socket.emit('signIn',{usuario:body.usuario});
        this.boton=false;
        this.router.navigateByUrl('/ventas/buscarClientes');
      },(error:any)=>{
        if(error.status==401){
        alert(error.error.msg);}
        else
        alert('VUELVELO A INTENTAR, SE CAYÓ EL SERVIDOR');
        this.boton=false;
      });
    }
    else{
      alert("Formulario invalido");
      this.boton=false;
    }
  }

  crearFormulario(){
    this.forma=this.formBuilder.group({
      usuario:['', [Validators.required, Validators.minLength(4)]],
      contraseña:['', [Validators.required, Validators.minLength(3)]],
      trabajador:['', [Validators.required, Validators.minLength(8)]],
    });
  }

}
