import {Injectable} from '@angular/core';
import {IMyDpOptions} from "mydatepicker";
import {Hospitalization} from "../models/hospitalization";
import {Animal} from "../models/animal";
import {Observable} from "rxjs/Observable";
import {HospitalizationComment} from "../models/hospitalization-comment";
import {EntranceReason} from "../models/entrance-reason";
import {Cage} from "../models/cage";
import {FormGroup} from "@angular/forms";
import {QuarantaineAction} from "../models/quarantaine-action";
import {Weight} from "../models/weight";

@Injectable()
export class FichesSession {
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };
  nazorgForm:FormGroup = null;
  medischeForm: FormGroup = null;
  quarantaineForm: FormGroup = null;

  animals: Observable<Animal[]>;
  entrance_reasons: Observable<EntranceReason[]>;
  cages: Observable<Cage[]>;
  hospitalizationComments: Observable<HospitalizationComment[]>;
  quarantaineActions: Observable<QuarantaineAction[]>;
  weights: Weight;
  animal_isMale: boolean = true;

  hospitalization:Hospitalization;
  animal:Animal;
  animal_ideal_weight_general:number;
  cage:Cage;

  id: number;
  updatemode: string;
  algemeenModalHeader:string;
  algemeenModalText:string;
  navigateToFichesHospitalizationId:number;
}
