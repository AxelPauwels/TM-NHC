import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {HedgehogContainerDivision} from '../models/hedgehog-container-division';
import {Globals} from "../shared/globals";

@Injectable()
export class BakkenBewerkenService {

  constructor(private httpClient: HttpClient, private  globals: Globals) { }

  getContainers(): Observable<any>{
    const url =  this.globals.baseUrl + '/api-v2/hedgehogcontainer';
    return this.httpClient.get(url, {responseType: 'json'});
  }

  addContainers(){

  }

  removeFromContainer(id){
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainerdivision/id/';
    return this.httpClient.delete(url + id, {responseType: 'json'});
  }

  getContainersWithRelationsByContainerNumber(number): Observable<any> {
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainer/withrelationsbycontainernumber/';
    return this.httpClient.get(url + number, {responseType: 'json'});
  }

  getHedgehogsNotInContainer(): Observable<any>{
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainer/hedgehogsnotincontainer/';
    return this.httpClient.get(url, {responseType: 'json'});
  }

  getContainerDivisions(): Observable<any>{
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainerdivision/';
    return this.httpClient.get(url, {responseType: 'json'});
  }

  saveNewNumberOfContainers(number) {
    return this.httpClient.put(`${this.globals.baseUrl}/api-v2/hedgehogcontainer/numberofcontainers/${number}`, null);
  }

  addHedgehogToContainer(hedgehogContainer): Observable<any> {
    return this.httpClient.post(`${this.globals.baseUrl}/api-v2/hospitalizationhedgehogcontainer`, hedgehogContainer);
  }

  removeHedgehogFromContainer(id): Observable<any> {
    return this.httpClient.delete(`${this.globals.baseUrl}/api-v2/hospitalizationhedgehogcontainer/id/${id}`);
  }

  getContainersHospitalizations(): Observable<any>{
    return this.httpClient.get(`${this.globals.baseUrl}/api-v2/hospitalizationhedgehogcontainer`, {responseType: 'json'});
  }

}
