import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../shared/globals";
import {Hospitalization} from "../models/hospitalization";
import {Observable} from "rxjs/Observable";

@Injectable()
export class FichesLijstService {

    data;

    constructor(private httpClient: HttpClient, private  globals: Globals) {
    }

    getHospitalizations(): Observable<Hospitalization[]> {
        const url = this.globals.baseUrl + '/api-v2/fiche/getallcomplete';
        return this.httpClient.get<Hospitalization[]>(url);
    }

}
