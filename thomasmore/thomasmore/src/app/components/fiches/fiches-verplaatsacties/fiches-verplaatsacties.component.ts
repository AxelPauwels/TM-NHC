import {Component, OnInit} from '@angular/core';
import {FichesService} from "../../../services/fiches.service";
import {FichesSession} from "../../../shared/fiches-session";
import {FichesAlgemeenModalComponent} from "../fiches-algemeen-modal/fiches-algemeen-modal.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-fiches-verplaatsacties',
  templateUrl: './fiches-verplaatsacties.component.html',
  styleUrls: ['../all-fiches-components.component.css', './fiches-verplaatsacties.component.css']
})
export class FichesVerplaatsactiesComponent implements OnInit {

  bsModalRef: BsModalRef;

  constructor(private fichesService: FichesService, private fichesSession: FichesSession, private bsModalService: BsModalService) {
  }

  ngOnInit() {
  }

  onClick_naarIC(event) {
    this.fichesService.hospitalizationNaarIC(this.fichesSession.hospitalization);
    this.fichesSession.algemeenModalHeader="Naar IC";
    this.fichesSession.algemeenModalText = "Het dier werd verplaatst naar IC.";
    this.bsModalRef = this.bsModalService.show(FichesAlgemeenModalComponent, {});
  }

  onClick_vrijlaten(event) {
    this.fichesService.hospitalizationVrijlaten(this.fichesSession.hospitalization);
    this.fichesSession.algemeenModalHeader="Vrijgelaten";
    this.fichesSession.algemeenModalText = "Het dier werd vrijgelaten.";
    this.bsModalRef = this.bsModalService.show(FichesAlgemeenModalComponent, {});
  }

}
