import {Component, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FichesSession} from "../../../shared/fiches-session";
import {FichesService} from "../../../services/fiches.service";
import {Hospitalization} from "../../../models/hospitalization";
import {Animal} from "../../../models/animal";
import {Observable} from "rxjs/Observable";
import {Cage} from "../../../models/cage";
import {HospitalizationComment} from "../../../models/hospitalization-comment";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {FichesCageModalComponent} from "../fiches-cage-modal/fiches-cage-modal.component";
import {Subscription} from "rxjs/Subscription";
import {FichesAlgemeenModalComponent} from "../fiches-algemeen-modal/fiches-algemeen-modal.component";

@Component({
  selector: 'app-fiches-nazorg',
  templateUrl: './fiches-nazorg.component.html',
  styleUrls: ['../all-fiches-components.component.css', './fiches-nazorg.component.css']
})
export class FichesNazorgComponent implements OnInit {

  constructor(private fichesService: FichesService, private fichesSession: FichesSession, private bsModalService: BsModalService) {
  }

  // gegevens van session
  hospitalizationComments: Observable<HospitalizationComment[]>;
  hospitalization: Hospitalization;
  animal: Animal;
  animal_ideal_weight_general: number;

  // nieuwe gegegevens van deze component
  nazorgForm: FormGroup;
  cages: Observable<Cage[]>;
  cage: Cage;
  showCageInfo: boolean = false;

  bsModalRef: BsModalRef;
  modalSubscription: Subscription;

  ngOnInit() {
    // de eerste keer de form aanmaken en opslaan in ficheSession
    if (this.fichesSession.nazorgForm == null) {
      this.createNazorgForm();
    } else {
      // anders de form ophalen uit ficheSession
      this.nazorgForm = this.fichesSession.nazorgForm;
      this.getDataFromSession();
    }

    // gegevens vanuit session ophalen
    // wordt getriggerd in fiches-overzicht.component.ts , na het ophalen van data in ngOnInit()
    this.fichesService.ficheSessionIsCompleted.subscribe(
      () => {
        this.getDataFromSession();

        // extra gegevens ophalen - cage van deze hospitalization
        this.fichesService.getCageById(this.fichesSession.hospitalization.cage).subscribe(
          (array: any) => {
            this.cage = array[0];
            this.fichesSession.cage = array[0];
            this.fillNazorgForm();
          }
        );
      }
    );

    // subscribe op het klikken op knoppen van fiche-navigatie
    this.fichesService.refillForm.subscribe(
      (form: string) => {
        if (form === "nazorgButton") {
          this.getDataFromSession();
        }
      }
    );
  }

  getDataFromSession() {
    this.hospitalization = this.fichesSession.hospitalization;
    this.animal = this.fichesSession.animal;
    this.animal_ideal_weight_general = this.fichesSession.animal_ideal_weight_general;
    this.hospitalizationComments = this.fichesSession.hospitalizationComments;
    this.cages = this.fichesSession.cages;
  }

  createNazorgForm() {
    this.fichesSession.nazorgForm = new FormGroup({
      cage: new FormControl(null),
      menu_percentage: new FormControl(null),
      hospitalization_comment: new FormControl(null),
      just_comment: new FormControl(null),
      animal_ideal_weight_general: new FormControl(null)
    });
    this.nazorgForm = this.fichesSession.nazorgForm;
  };

  fillNazorgForm() {
    (<FormControl>this.nazorgForm.controls['cage'])
      .setValue(this.hospitalization.cage, {onlySelf: true});
    (<FormControl>this.nazorgForm.controls['menu_percentage'])
      .setValue(this.hospitalization.menu_percentage, {onlySelf: true});
    (<FormControl>this.nazorgForm.controls['hospitalization_comment'])
      .setValue(this.hospitalization.hospitalization_comment, {onlySelf: true});
    (<FormControl>this.nazorgForm.controls['just_comment'])
      .setValue(this.hospitalization.just_comment, {onlySelf: true});
    (<FormControl>this.nazorgForm.controls['animal_ideal_weight_general'])
      .setValue(this.animal_ideal_weight_general, {onlySelf: true});
  };

  public kooiChanged(event) {
    this.fichesService.getCageById(event.target.value).subscribe(
      (data:any)=>this.fichesSession.cage = data[0]
    );
  }

  public showInfoKooien() {
    if (this.hospitalization != undefined) {
      this.cage = this.fichesSession.cage;
      this.showCageInfo = true;
      this.bsModalRef = this.bsModalService.show(FichesCageModalComponent, {});
    }
  }

  onClick_nazorgOpslaan() {
    this.hospitalization.cage = this.nazorgForm.value.cage;
    this.hospitalization.menu_percentage = this.nazorgForm.value.menu_percentage;
    this.hospitalization.hospitalization_comment = this.nazorgForm.value.hospitalization_comment;
    this.hospitalization.just_comment = this.nazorgForm.value.just_comment;
    // TODO: session gegevens opslaan vanuit overzicht form bij update/post
    if (this.fichesSession.animal_isMale) {
      this.animal.ideal_weight_general_male = this.nazorgForm.value.animal_ideal_weight_general;
      this.animal.ideal_weight_female = null;
    } else {
      this.animal.ideal_weight_female = this.nazorgForm.value.animal_ideal_weight_general;
      this.animal.ideal_weight_general_male = null;
    }
    this.fichesService.updateHospitalizationById(this.hospitalization);
    this.fichesService.updateAnimalById(this.animal);

    this.fichesService.getCageById(this.fichesSession.hospitalization.cage).subscribe(
      (array: any) => {
        this.cage = array[0];
        this.fichesSession.cage = array[0];
      }
    );

    this.fichesSession.algemeenModalHeader = "Succes";
    this.fichesSession.algemeenModalText = "Deze nazorg fiche is succesvol opgeslagen";
    this.bsModalRef = this.bsModalService.show(FichesAlgemeenModalComponent, {});

  }

}
