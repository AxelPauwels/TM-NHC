import 'rxjs/Rx';
import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Animal} from "../models/animal";
import {EntranceReason} from "../models/entrance-reason";
import {Globals} from "../shared/globals";
import {Hospitalization} from "../models/hospitalization";
import {Contact} from "../models/contact";
import {HospitalizationComment} from "../models/hospitalization-comment";

@Injectable()
export class OpnameTabletService {

  constructor(private httpClient: HttpClient, private  globals: Globals) {
  }

  getAnimals(): Observable<Animal[]> {
    const url = this.globals.baseUrl + '/api-v2/animal/';
    return this.httpClient.get<Animal[]>(url);
  }

  getFicheLastId() {
    const url = this.globals.baseUrl + '/api-v2/fiche/lastid';
    return this.httpClient.get(url);
  }

  getHospitalization_byId(hospitalizationId: number) {
    const url = this.globals.baseUrl + '/api-v2/fiche/idsingle/' + hospitalizationId;
    return this.httpClient.get(url);
  }

  getHospitalizationComment_byId(hospitalizationCommentId: number) {
    const url = this.globals.baseUrl + '/api-v2/hospitalizationcomment/id/' + hospitalizationCommentId;
    return this.httpClient.get(url);
  }

  getRedenVanBinnenkomst(): Observable<EntranceReason[]> {
    const url = this.globals.baseUrl + '/api-v2/entrancereason/';
    return this.httpClient.get<EntranceReason[]>(url);
  }

  insertContact(newContact: Contact) {
    const url = this.globals.baseUrl + '/api-v2/contact/';
    return this.httpClient.post(url, newContact);
  }

  insertHospitalizationComment(newHospitalizationComment: HospitalizationComment) {
    const url = this.globals.baseUrl + '/api-v2/hospitalizationcomment/';
    return this.httpClient.post(url, newHospitalizationComment);
  }

  insertHospitalization_group() {
    const object = {"id": null};
    const url = this.globals.baseUrl + '/api-v2/hospitalizationgroup/';
    return this.httpClient.post(url, object);
  }

  insertHospitalization(newHospitalization: Hospitalization) {
    const url = this.globals.baseUrl + '/api-v2/fiche/';
    return this.httpClient.post(url, newHospitalization)
  }

  insertContactIntoHospitalization(hospitalizationId: number, contactId: number) {
    const object: Object = {
      "id": hospitalizationId,
      "contact": contactId
    };
    return this.httpClient.post(this.globals.baseUrl + '/api-v2/fiche/idwithcontact/' + hospitalizationId, object);
  }

  updateHospitalization(bestaandHospitalization: Hospitalization) {
    const url = this.globals.baseUrl + '/api-v2/fiche/id/' + bestaandHospitalization.id;
    this.httpClient.post(url, bestaandHospitalization)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured ");
          console.log(err);
        }
      );
  }

}


