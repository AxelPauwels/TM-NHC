import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {Cage} from "../../../models/cage";
import {FichesSession} from "../../../shared/fiches-session";

@Component({
  selector: 'app-fiches-cage-modal',
  templateUrl: './fiches-cage-modal.component.html',
  styleUrls: ['./fiches-cage-modal.component.css']
})

export class FichesCageModalComponent implements OnInit {
  selectedCage: Cage;

  constructor(public bsModalRef: BsModalRef, private fichesSession: FichesSession) {
  }

  ngOnInit() {
    this.selectedCage = this.fichesSession.cage;
  }

  onClick_modalClose(closeModalWithData = false) {
    if (!closeModalWithData) {
      this.bsModalRef.hide();
    }
  }

  onCancel() {
    this.bsModalRef.hide();
  }


}

