import {Injectable} from '@angular/core';
import {Animal} from "../models/animal";
import {HttpClient} from "@angular/common/http";
import {Hospitalization} from "../models/hospitalization";
import {EntranceReason} from "../models/entrance-reason";
import {AnimalKingdom} from "../models/animal-kingdom";
import {ExitReason} from "../models/exit-reason";
import {Observable} from "rxjs/Observable";
import {Globals} from "../shared/globals";
import {timeout} from "rxjs/operators";

@Injectable()
export class StatistiekenService {

  data;
  constructor(private httpClient: HttpClient, private  globals: Globals) {
  }

  getForExcel(): Observable<Hospitalization[]> {
    const url = this.globals.baseUrl + '/api-v2/fiche/forexcel';
    this.data = this.httpClient.get<Hospitalization[]>(url);
    return this.data;
  }

  getEntrance(): Observable<EntranceReason[]> {
    const url = this.globals.baseUrl + '/api-v2/entrancereason/';
    this.data = this.httpClient.get<EntranceReason[]>(url);
    return this.data;
  }

  getExit(): Observable<ExitReason[]> {
    const url = this.globals.baseUrl + '/api-v2/exitreason/';
    this.data = this.httpClient.get<ExitReason[]>(url);
    return this.data;
  }

  getHospitalization():  Observable<Hospitalization[]>  {
    const url = this.globals.baseUrl + '/api-v2/fiche';
    this.data = this.httpClient.get<ExitReason[]>(url);
    return this.data;
  }
}
