import {Injectable} from '@angular/core';
import {HedgehogContainer} from '../models/hedgehog-container';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {post} from 'selenium-webdriver/http';
import {Globals} from '../shared/globals';

@Injectable()
export class EgelsWegenService {

  constructor(private http: HttpClient, private  globals: Globals) {
  }

  getHedgehogContainers(): Observable<any> {
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainer';
    return this.http.get(url, {responseType: 'json'});
  }

  getHedgehogContainersWithRelations(): Observable<any> {
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainer/withrelations';
    return this.http.get(url, {responseType: 'json'});
  }

  getHedgehogContainersWithRelationsByContainerNumber(number): Observable<any> {
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainer/withrelationsbycontainernumber/';
    return this.http.get(url + number, {responseType: 'json'});
  }

  getOccupiedContainers(): Observable<any> {
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainer/occupiedcontainers';
    return this.http.get(url, {responseType: 'json'});
  }

  saveWeight(data) {
    const url = this.globals.baseUrl + '/api-v2/weight';
    return this.http.post(url, data);
  }

  getAllWeightsOfHedgeHog(hospitalizationId): Observable<any> {
    const url = this.globals.baseUrl + '/api-v2/weight/hospitalization/';
    return this.http.get(url + hospitalizationId, {responseType: 'json'});
  }

  removeHedgeHogFromContainer(id) {
    const url = this.globals.baseUrl + '/api-v2/hospitalizationhedgehogcontainer/id/';
    return this.http.delete(url + id, {responseType: 'json'});
  }

  getAllContainerDivision() {
    const url = this.globals.baseUrl + '/api-v2/hedgehogcontainerdivision';
    return this.http.get(url, {responseType: 'json'});
  }

  removeWeight(id): Observable<any> {
    const url = this.globals.baseUrl + '/api-v2/weight/id/';
    return this.http.delete(url + id, {responseType: 'json'});
  }
}
