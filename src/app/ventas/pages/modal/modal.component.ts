import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() sector:any;

  constructor(public activeModal:NgbActiveModal) { }

  ngOnInit(): void {
  }

  alerta(folio:string){
    if(folio.length==4){
      this.activeModal.close({ok:true, folio:Number(folio)});

    }
    else{
      alert("EL FOLIO DEBE CONTENER 4 DIGITOS")
    }
  }

}
