import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  form:FormGroup = new FormGroup({});

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
  }

  crearFormulario(){
    this.form = this.fb.group({

    });
  }

}
