import {Component, OnInit} from '@angular/core';
import {FichesService} from "../../../services/fiches.service";
import {FichesSession} from "../../../shared/fiches-session";
import {BsModalRef} from "ngx-bootstrap";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-fiches',
  templateUrl: './fiches.component.html',
  styleUrls: ['../all-fiches-components.component.css', './fiches.component.css']
})
export class FichesComponent implements OnInit {

  showNazorgFiche: boolean = true;

  // TODO: BOOTSTRAP MODAL
  // constructor(private bsModalService:BsModalService) {
  // }
  showMedischeFiche: boolean = false;
  showQuarantaineFiche: boolean = false;
  updateModusIsGroep: boolean = false;

  constructor(private fichesService: FichesService, private fichesSession: FichesSession, public bsModalRef: BsModalRef, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // luisteren naar ficheNavigatie (welke fiche component tonen?)
    this.fichesService.onFicheViewChange.subscribe(
      (ficheToShow: string) => {
        switch (ficheToShow) {
          case "nazorgButton":
            this.showNazorgFiche = true;
            this.showMedischeFiche = false;
            this.showQuarantaineFiche = false;
            break;
          case "medischeButton":
            this.showNazorgFiche = false;
            this.showMedischeFiche = true;
            this.showQuarantaineFiche = false;
            break;
          case "quarantaineButton":
            this.showNazorgFiche = false;
            this.showMedischeFiche = false;
            this.showQuarantaineFiche = true;
            break;
        }
      }
    );

    this.route.params.subscribe(params => {
      this.fichesSession.id = params['id'];
      this.fichesSession.updatemode = params['updatemode'];
      switch (params['updatemode']) {
        case "single":
          this.updateModusIsGroep = false;
          break;
        case "groep":
          this.updateModusIsGroep = true;
          break;
      }
    });

    // gegevens ophalen en opslaan in session (voor andere componenten)
    this.fichesSession.animals = this.fichesService.getAnimals();
    this.fichesSession.entrance_reasons = this.fichesService.getRedenVanBinnenkomst();
    this.fichesSession.cages = this.fichesService.getCages();
    this.fichesSession.hospitalizationComments = this.fichesService.getHospitalizationComments();
    this.fichesSession.quarantaineActions = this.fichesService.getQuarantaineActions();
  }

}
