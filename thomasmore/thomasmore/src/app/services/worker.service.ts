import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Worker} from "../models/worker";
import {Globals} from "../shared/globals";


@Injectable()
export class WorkerService {

  constructor(private httpClient: HttpClient, private  globals: Globals) {
  }

  getWorkers() {
    const url = this.globals.baseUrl + '/api-v2/worker/';
    return this.httpClient.get<Worker[]>(url);
  }

  getWorker(worker: Worker) {
    const url = this.globals.baseUrl + '/api-v2/worker/';
    return this.httpClient.post(url, worker);
  }

  insertWorker(worker: any) {
    const url = this.globals.baseUrl + '/api-v2/worker/';
    return this.httpClient.post(url, worker);
  }

  getWorkersByDate(date){
    const url = this.globals.baseUrl + '/api-v2/worker/date/' + date;
    return this.httpClient.get(url);
  }

  removeWorker(id){
    const url = this.globals.baseUrl + '/api-v2/worker/id/' + id;
    return this.httpClient.delete(url);
  }
}
