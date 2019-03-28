import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {FichesSession} from "../../../shared/fiches-session";

@Component({
  selector: 'app-fiches-algemeen-modal',
  templateUrl: './fiches-algemeen-modal.component.html',
  styleUrls: ['./fiches-algemeen-modal.component.css']
})

export class FichesAlgemeenModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private fichesSession: FichesSession) {
  }

  algemeenModalText: string;
  algemeenModalHeader: string;

  ngOnInit() {
    this.algemeenModalText = this.fichesSession.algemeenModalText;
    this.algemeenModalHeader = this.fichesSession.algemeenModalHeader;
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

