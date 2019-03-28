import {Injectable} from '@angular/core';

@Injectable()
export class OpnameTabletSession {

  nieuweOpname: boolean = true;
  opnameNummer: number;
  opnameGroepsNummer: number;
  contact_id:number;
  hospitalization_group_id:number;

  // FORMULIER - OPNAME
  entrance = new Date();
  animal = 0;
  quantity = null;
  entrance_reason = 0;
  origin = null;
  just_comment = null;
  status_code = "IC";
  menu_percentage = 100;
  male_quantity = 0;
  female_quantity = 0;
  exit_reason = null;

  status_code_checkbox: boolean = false;
  just_comment_checkbox:boolean = false;
  showJust_comment: boolean = false;

  // FORMULIER - CONTACTGEGEVENS
  name: String;
  street: String;
  number: String;
  postal: String;
  city: String;
  email: String = null;
  isLid_checkbox: boolean = false;
}
