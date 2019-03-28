import {Component, OnInit} from '@angular/core';
import {OpnameTabletService} from "../../../services/opname-tablet.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Contact} from "../../../models/contact";
import {ActivatedRoute, Router} from "@angular/router";
import {OpnameTabletSession} from "../../../shared/opname-tablet-session";
import {Hospitalization} from "../../../models/hospitalization";
import {HospitalizationComment} from "../../../models/hospitalization-comment";

@Component({
  selector: 'app-contactgegevens',
  templateUrl: './contactgegevens.component.html',
  styleUrls: ['./contactgegevens.component.css']
})

export class ContactgegevensComponent implements OnInit {
  opnameNummer: number;
  contactgegevensForm: FormGroup;

  constructor(private opnameTabletService: OpnameTabletService, private router: Router, private route: ActivatedRoute, private opnameTabletSession: OpnameTabletSession) {
  }

  ngOnInit() {
    // gegevens ophalen voor formulier op te bouwen (dropdowns)
    this.opnameNummer = this.opnameTabletSession.opnameNummer;

    // formulier maken
    this.contactgegevensForm = new FormGroup({
      name: new FormControl(this.opnameTabletSession.name, Validators.required),
      street: new FormControl(this.opnameTabletSession.street, Validators.required),
      number: new FormControl(this.opnameTabletSession.number, Validators.required),
      postal: new FormControl(this.opnameTabletSession.postal, Validators.required),
      city: new FormControl(this.opnameTabletSession.city, Validators.required),
      email: new FormControl(this.opnameTabletSession.email),
      isLid_checkbox: new FormControl(this.opnameTabletSession.isLid_checkbox)
    });
  }

  onClick_contactgegevensOpslaan() {
    this.opnameTabletSession.name = this.contactgegevensForm.value.name;
    this.opnameTabletSession.street = this.contactgegevensForm.value.street;
    this.opnameTabletSession.number = this.contactgegevensForm.value.number.toString();
    this.opnameTabletSession.postal = this.contactgegevensForm.value.postal.toString();
    this.opnameTabletSession.city = this.contactgegevensForm.value.city;
    this.opnameTabletSession.email = this.contactgegevensForm.value.email;
    this.opnameTabletSession.isLid_checkbox = this.contactgegevensForm.value.isLid_checkbox;
    this.dezeOpnameOpslaan();
  }

  dezeOpnameOpslaan() {
    // eerst contact opslaan
    const newContact: Contact = new Contact(
      this.opnameTabletSession.name,
      this.opnameTabletSession.street,
      this.opnameTabletSession.number,
      this.opnameTabletSession.postal,
      this.opnameTabletSession.city,
      this.opnameTabletSession.email
    );

    this.opnameTabletService.insertContact(newContact).subscribe(
      (result: any) => {
        this.opnameTabletSession.contact_id = result.id;
        this.insertHospitalization();
      }
    );
  }

  insertHospitalization() {


    // eerst een hospitalization_group inserten
    this.opnameTabletService.insertHospitalization_group().subscribe(
      (object: any) => {
        this.opnameTabletSession.hospitalization_group_id = object.id;

        const newHospitalization = new Hospitalization(
          this.opnameTabletSession.entrance,
          this.opnameTabletSession.animal,
          this.opnameTabletSession.quantity,
          this.opnameTabletSession.entrance_reason,
          this.opnameTabletSession.just_comment,
          this.opnameTabletSession.origin,
          this.opnameTabletSession.status_code,
          this.opnameTabletSession.menu_percentage,
          this.opnameTabletSession.male_quantity,
          this.opnameTabletSession.female_quantity,
          this.opnameTabletSession.exit_reason,
          this.opnameTabletSession.contact_id,
          this.opnameTabletSession.hospitalization_group_id,
        );
        console.log("DIT GAAT NAAR BACK");
        console.log(newHospitalization);

        this.opnameTabletService.insertHospitalization(newHospitalization).subscribe(
          () => this.clearforms_and_navigateToNieuweOpname()
        );
      }
    );

  }

  clearforms_and_navigateToNieuweOpname() {
    this.opnameTabletSession.nieuweOpname = true;
    this.opnameTabletSession.opnameNummer = null;
    this.opnameTabletSession.contact_id = null;

    this.opnameTabletSession.entrance = new Date();
    this.opnameTabletSession.animal = 0;
    this.opnameTabletSession.quantity = null;
    this.opnameTabletSession.entrance_reason = 0;
    this.opnameTabletSession.just_comment = null;
    this.opnameTabletSession.origin = null;
    this.opnameTabletSession.status_code = "IC";
    this.opnameTabletSession.menu_percentage = 100;
    this.opnameTabletSession.male_quantity = 0;
    this.opnameTabletSession.female_quantity = 0;
    this.opnameTabletSession.exit_reason = null;
    this.opnameTabletSession.status_code_checkbox = false;
    this.opnameTabletSession.just_comment_checkbox = false;
    this.opnameTabletSession.showJust_comment = false;

    // FORMULIER - CONTACTGEGEVENS
    this.opnameTabletSession.name = null;
    this.opnameTabletSession.street = null;
    this.opnameTabletSession.number = null;
    this.opnameTabletSession.postal = null;
    this.opnameTabletSession.city = null;
    this.opnameTabletSession.email = null;
    this.opnameTabletSession.isLid_checkbox = false;

    this.router.navigateByUrl('opnameTablet/nieuweOpname');
  }


}
