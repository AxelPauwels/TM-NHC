import {Component, OnInit} from '@angular/core';
import {OpnameTabletService} from "../../../services/opname-tablet.service";
import {Animal} from "../../../models/animal";
import {Observable} from "rxjs/Observable";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EntranceReason} from "../../../models/entrance-reason";
import {IMyDpOptions} from 'mydatepicker';
import {ActivatedRoute, Router} from "@angular/router";
import {OpnameTabletSession} from "../../../shared/opname-tablet-session";

@Component({
  selector: 'app-opname',
  templateUrl: './opname.component.html',
  styleUrls: ['./opname.component.css']
})

export class OpnameComponent implements OnInit {
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };
  opnameNummer: number;
  opnameGroepsNummer: number;
  opnameForm: FormGroup = null;
  animals: Observable<Animal[]>;
  entrance_reasons: Observable<EntranceReason[]>;
  showJust_comment: boolean;

  constructor(private opnameTabletService: OpnameTabletService, private router: Router, private route: ActivatedRoute, private opnameTabletSession: OpnameTabletSession) {
  }

  ngOnInit() {
    // gegevens ophalen voor formulier op te bouwen (dropdowns)
    this.opnameNummer = this.opnameTabletSession.opnameNummer;
    this.opnameGroepsNummer = this.opnameTabletSession.opnameNummer;
    this.animals = this.opnameTabletService.getAnimals();
    this.entrance_reasons = this.opnameTabletService.getRedenVanBinnenkomst();
    this.showJust_comment = this.opnameTabletSession.showJust_comment;

    // formulier maken
    this.opnameForm = new FormGroup({
      entrance: new FormControl(this.opnameTabletSession.entrance, Validators.required),
      animal: new FormControl(this.opnameTabletSession.animal, Validators.required),
      quantity: new FormControl(this.opnameTabletSession.quantity, Validators.required),
      entrance_reason: new FormControl(this.opnameTabletSession.entrance_reason, Validators.required),
      origin: new FormControl(this.opnameTabletSession.origin, Validators.required),
      status_code_checkbox: new FormControl(this.opnameTabletSession.status_code_checkbox),
      just_comment_checkbox: new FormControl(this.opnameTabletSession.just_comment_checkbox),
      just_comment: new FormControl(this.opnameTabletSession.just_comment)
    });
    this.setDate();
  }

  setDate(): void {
    // Set today date using the patchValue function
    this.opnameForm.patchValue({
      entrance: {
        date: {
          year: this.opnameTabletSession.entrance.getFullYear(),
          month: this.opnameTabletSession.entrance.getMonth() + 1,
          day: this.opnameTabletSession.entrance.getDate()
        }
      }
    });
  }

  onCheckboxChange(e: any) {
    // bijhouden of de input voor hospitalization_comment moet getoont worden of niet
    this.opnameTabletSession.showJust_comment = !this.opnameTabletSession.showJust_comment;
    this.showJust_comment = !this.showJust_comment;
  }

  onClick_opnameOpslaan() {
    this.opnameTabletSession.opnameNummer = this.opnameNummer;
    this.opnameTabletSession.opnameGroepsNummer = this.opnameGroepsNummer;
    this.opnameTabletSession.entrance = this.getCorrectDateFormat(this.opnameForm.value.entrance.date);
    this.opnameTabletSession.entrance = this.getCorrectDateFormat(this.opnameForm.value.entrance.date);
    this.opnameTabletSession.animal = this.opnameForm.value.animal;
    this.opnameTabletSession.quantity = this.opnameForm.value.quantity;
    this.opnameTabletSession.entrance_reason = this.opnameForm.value.entrance_reason;
    this.opnameTabletSession.origin = this.opnameForm.value.origin;
    this.opnameTabletSession.status_code_checkbox = this.opnameForm.value.status_code_checkbox;
    this.opnameTabletSession.just_comment_checkbox = this.opnameForm.value.just_comment_checkbox;

    // indien vrijgelaten: de status_code & exit_reason aanpassen
    if (this.opnameForm.value.status_code_checkbox) {
      this.opnameTabletSession.status_code = "END";
      this.opnameTabletSession.exit_reason = 6;
    }

    // just_comment enkel opslaan indien deze verschillend is tussen de form en de sessionData
    if (this.opnameForm.value.just_comment != this.opnameTabletSession.just_comment) {
      this.opnameTabletSession.just_comment = this.opnameForm.value.just_comment;
    }
    this.router.navigateByUrl('opnameTablet/contactgegevens');
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
