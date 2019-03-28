import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {EntranceReason} from "../models/entrance-reason";
import {Animal} from "../models/animal";
import {HttpClient} from "@angular/common/http";
import {Globals} from "../shared/globals";
import {Cage} from "../models/cage";
import {HospitalizationComment} from "../models/hospitalization-comment";
import {QuarantaineAction} from "../models/quarantaine-action";
import {Hospitalization} from "../models/hospitalization";
import {Contact} from "../models/contact";
import {Weight} from "../models/weight";
import {Quarantaine} from "../models/quarantaine";

@Injectable()
export class FichesService {

  onFicheViewChange = new EventEmitter<string>();
  refillForm = new EventEmitter<string>();
  ficheSessionIsCompleted = new EventEmitter();
  updateWeightsTable = new EventEmitter();

  constructor(private httpClient: HttpClient, private  globals: Globals) {
  }

  getHospitalizationById(id: number) {
    const url = this.globals.baseUrl + '/api-v2/fiche/idsingle/' + id;
    return this.httpClient.get(url);
  }

  getAnimals(): Observable<Animal[]> {
    const url = this.globals.baseUrl + '/api-v2/animal/';
    return this.httpClient.get<Animal[]>(url);
  }

  getAnimalById(id: number) {
    const url = this.globals.baseUrl + '/api-v2/animal/idsingle/' + id;
    return this.httpClient.get(url);
  }

  getRedenVanBinnenkomst(): Observable<EntranceReason[]> {
    const url = this.globals.baseUrl + '/api-v2/entrancereason/';
    return this.httpClient.get<EntranceReason[]>(url);
  }

  getCages(): Observable<Cage[]> {
    const url = this.globals.baseUrl + '/api-v2/cage';
    return this.httpClient.get<Cage[]>(url);
  }

  getCageById(id: number) {
    const url = this.globals.baseUrl + '/api-v2/cage/idsingle/' + id;
    return this.httpClient.get(url);
  }

  getHospitalizationComments(): Observable<HospitalizationComment[]> {
    const url = this.globals.baseUrl + '/api-v2/hospitalizationcomment/';
    return this.httpClient.get<HospitalizationComment[]>(url);
  }

  getQuarantaineActions(): Observable<QuarantaineAction[]> {
    const url = this.globals.baseUrl + '/api-v2/quarantaineaction/';
    return this.httpClient.get<QuarantaineAction[]>(url);
  }

  changeViewFiche(ficheToShow) {
    this.onFicheViewChange.emit(ficheToShow);
    this.refillForm.emit(ficheToShow);
  }

  ficheSessionIsComplete() {
    this.ficheSessionIsCompleted.emit();
  }

  updateHospitalizationById(bestaandHospitalization: Hospitalization) {
    const url = this.globals.baseUrl + '/api-v2/fiche/id/' + bestaandHospitalization.id;
    return this.httpClient.post(url, bestaandHospitalization).subscribe(
      res => {
        // console.log(res);
      },
      err => {
        console.log("Error occured ");
        console.log(err);
      }
    );
  }

  updateAnimalById(bestaandAnimal: Animal) {
    const url = this.globals.baseUrl + '/api-v2/animal/id/' + bestaandAnimal.id;
    return this.httpClient.post(url, bestaandAnimal).subscribe(
      res => {
        // console.log(res);
      },
      err => {
        console.log("Error occured ");
        console.log(err);
      }
    );
  }

  getWeightsByHospitalizationId(hospitalizationId: number) {
    const url = this.globals.baseUrl + '/api-v2/weight/hospitalization/' + hospitalizationId;
    return this.httpClient.get(url);
  }

  insertNewWeight(newWeight: Weight) {
    const url = this.globals.baseUrl + '/api-v2/weight';
    return this.httpClient.post(url, newWeight);
  }


  // deleteWeight(weight: Weight) {
  //   const url = this.globals.baseUrl + '/api-v2/weight';
  //   return this.httpClient.post(url, weight);
  // }

  updateWeights() {
    this.updateWeightsTable.emit();
  }

  hospitalizationVrijlaten(hospitalization: Hospitalization) {
    const object = {
      "id": hospitalization.id,
      "status_code": "END"
    };
    const url = this.globals.baseUrl + '/api-v2/fiche/id/' + hospitalization.id;
    return this.httpClient.put(url, object).subscribe();
  }

  hospitalizationNaarIC(hospitalization: Hospitalization) {
    const object = {
      "id": hospitalization.id,
      "status_code": "IC"
    };
    const url = this.globals.baseUrl + '/api-v2/fiche/id/' + hospitalization.id;
    return this.httpClient.put(url, object).subscribe();
  }

  insertNewQuarantaine(newQuarantaine: Quarantaine) {
    const url = this.globals.baseUrl + '/api-v2/quarantaine';
    return this.httpClient.post(url, newQuarantaine);
  }

  getQuarantainesByHospitalizationId(hospitalizationId: number) {
    const url = this.globals.baseUrl + '/api-v2/quarantaine/hospid/' + hospitalizationId;
    return this.httpClient.get(url);
  }

}
