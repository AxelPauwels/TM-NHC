import {Component, OnInit} from '@angular/core';
import {FichesSession} from "../../../shared/fiches-session";
import {FichesService} from "../../../services/fiches.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Animal} from "../../../models/animal";
import {Hospitalization} from "../../../models/hospitalization";
import {HospitalizationComment} from "../../../models/hospitalization-comment";
import {Cage} from "../../../models/cage";
import {Observable} from "rxjs/Observable";
import {QuarantaineAction} from "../../../models/quarantaine-action";
import {Quarantaine} from "../../../models/quarantaine";

@Component({
  selector: 'app-fiches-quarantaine',
  templateUrl: './fiches-quarantaine.component.html',
  styleUrls: ['../all-fiches-components.component.css', './fiches-quarantaine.component.css']
})
export class FichesQuarantaineComponent implements OnInit {

  constructor(private fichesService: FichesService, private fichesSession: FichesSession) {
  }
  // nieuwe gegegevens van deze component
  quarantaineForm: FormGroup;
  quarantaineActions: Observable<QuarantaineAction[]>;
  quarantaineAction: QuarantaineAction;
  quarantaine: Quarantaine;
  quarantaines: Quarantaine[];
  quarantaineDate: Date = new Date();
  myDatePickerOptions;

  ngOnInit() {
    // de eerste keer de form aanmaken en opslaan in ficheSession
    if (this.fichesSession.quarantaineForm == null) {
      this.createQuarantaineForm();
      this.getDataFromSession();
      this.fillQuarantaineForm();
    } else {
      // anders de form ophalen uit ficheSession
      this.quarantaineForm = this.fichesSession.quarantaineForm;
      this.getDataFromSession();
      this.fillQuarantaineForm();
    }

    // gegevens ophalen - quarantaines van deze hospitalization
    this.fichesService.getQuarantainesByHospitalizationId(this.fichesSession.hospitalization.id).subscribe(
      (data:any)=>{
        this.quarantaines = data;
      }
    );

    this.myDatePickerOptions = this.fichesSession.myDatePickerOptions;

    // subscribe op het klikken op knoppen van fiche-navigatie
    this.fichesService.refillForm.subscribe(
      (form: string) => {
        if (form === "quarantaineButton") {
          this.getDataFromSession();
        }
      }
    );
  }

  getDataFromSession() {
    this.quarantaineActions = this.fichesSession.quarantaineActions;
  }

  createQuarantaineForm() {
    this.fichesSession.quarantaineForm = new FormGroup({
      quarantaineDate: new FormControl(null),
      quarantaineAction: new FormControl(null),
      quarantaineExtraInfo: new FormControl(null),
      bewaren: new FormControl(null)
    });
    this.quarantaineForm = this.fichesSession.quarantaineForm;
  };

  fillQuarantaineForm() {
    const quarantaineDate = this.quarantaineDate;
    // datum van datebase omzetten naar een echte Datum
    this.quarantaineForm.patchValue({
      quarantaineDate: {
        date: {
          year: quarantaineDate.getFullYear(),
          month: quarantaineDate.getMonth() + 1,
          day: quarantaineDate.getDate()
        }
      },
      quarantaineAction: 0,
      quarantaineExtraInfo: "abc"
    });
  };

  public bewaarQuarantaine(event) {
    let nieuweQuarantaine = new Quarantaine();
    nieuweQuarantaine.hospitalization = this.fichesSession.hospitalization.id;
    nieuweQuarantaine.date = this.getCorrectDateFormat(this.quarantaineForm.value.quarantaineDate.date);
    nieuweQuarantaine.extra_info = this.quarantaineForm.value.quarantaineExtraInfo;
    nieuweQuarantaine.quarantaine_action = this.quarantaineForm.value.quarantaineAction;

    this.fichesService.insertNewQuarantaine(nieuweQuarantaine).subscribe(
      (insertedData:any)=> {
        this.quarantaines.push(insertedData);
      }
  );

  }

  getCorrectDateFormat(object: any) {
    // de datum (object) vanuit de datepicker omzetten om correct op te slaan in de database
    const year = object.year.toString();
    let month = object.month.toString();
    const day = object.day.toString();

    // de "leading zero" fixen bij sommige browsers die de maand teruggeven als "1" ipv "01"
    if (month.length == 1) {
      month = "0" + object.month.toString();
    }
    return new Date(year + "-" + month + "-" + day);
  }

}
