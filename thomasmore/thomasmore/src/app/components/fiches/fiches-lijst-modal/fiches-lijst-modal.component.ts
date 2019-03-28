import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {FichesSession} from "../../../shared/fiches-session";
import {FichesLijstService} from "../../../services/fiches-lijst.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-fiches-lijst-modal',
  templateUrl: './fiches-lijst-modal.component.html',
  styleUrls: ['./fiches-lijst-modal.component.css']
})

export class FichesLijstModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private fichesSession: FichesSession, private fichesLijstService: FichesLijstService, private router: Router) {
  }
  algemeenModalText: string;
  algemeenModalHeader: string;

  ngOnInit() {
    this.algemeenModalText = this.fichesSession.algemeenModalText;
    this.algemeenModalHeader = this.fichesSession.algemeenModalHeader;
  }

  onClick_annuleer() {
    this.bsModalRef.hide();
  }

  onClick_single() {
    this.router.navigate(['./fiches/fiche/' + this.fichesSession.navigateToFichesHospitalizationId + '/single']);
    this.bsModalRef.hide();
  }

  onClick_groep() {
    this.router.navigate(['./fiches/fiche/' + this.fichesSession.navigateToFichesHospitalizationId + '/groep']);
    this.bsModalRef.hide();
  }

}

