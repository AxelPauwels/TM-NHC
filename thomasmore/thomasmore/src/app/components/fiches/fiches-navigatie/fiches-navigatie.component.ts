import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {FichesService} from "../../../services/fiches.service";

@Component({
  selector: 'app-fiches-navigatie',
  templateUrl: './fiches-navigatie.component.html',
  styleUrls: ['../all-fiches-components.component.css','./fiches-navigatie.component.css']
})
export class FichesNavigatieComponent implements OnInit {

  constructor(private fichesService: FichesService, public bsModalRef:BsModalRef) { }

  @ViewChild("nazorgButton", {read: ElementRef}) nazorgButton: ElementRef;
  @ViewChild("medischeButton", {read: ElementRef}) medischeButton: ElementRef;
  @ViewChild("quarantaineButton", {read: ElementRef}) quarantaineButton: ElementRef;

  ngOnInit() {
  }

  public toggleFiches(event) {
    const clickedButton = event.target;
    clickedButton.classList.add('active');
    this.fichesService.changeViewFiche(clickedButton.value);

    switch (clickedButton.value) {
      case "nazorgButton":
        this.medischeButton.nativeElement.classList.remove('active');
        this.quarantaineButton.nativeElement.classList.remove('active');
        break;
      case "medischeButton":
        this.nazorgButton.nativeElement.classList.remove('active');
        this.quarantaineButton.nativeElement.classList.remove('active');
        break;
      case "quarantaineButton":
        this.nazorgButton.nativeElement.classList.remove('active');
        this.medischeButton.nativeElement.classList.remove('active');
        break;
    }
  }
}
