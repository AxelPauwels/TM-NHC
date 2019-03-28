import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-fiches-medisch',
  templateUrl: './fiches-medisch.component.html',
  styleUrls: ['../all-fiches-components.component.css','./fiches-medisch.component.css']
})
export class FichesMedischComponent implements OnInit {

  constructor() { }

  medischeForm: FormGroup = null;

  ngOnInit() {
    // formulier maken - medischeFiche
    this.medischeForm = new FormGroup({
    });
  }

}
