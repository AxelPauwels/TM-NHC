import { Injectable } from '@angular/core';
import {Globals} from "../shared/globals";
import {HttpClient} from "@angular/common/http";
import {ConfigurationTaskV2ModelViewModel} from "../models/viewmodels/configuration-task-v2-model-view-model";
import {Observable} from "rxjs/Observable";
import {RecurModel} from "../models/recur-model";

@Injectable()
export class RecurModelService {

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  getAllRecurModels(): Observable<RecurModel[]> {
    return this.httpClient.get<RecurModel[]>(this.globals.baseUrl + '/api-v2/recurmodel');
  }

  // createTaskV2Category(category): Observable<any> {
  //   return this.httpClient.post<any>(this.globals.baseUrl + '/api-v2/taskv2category', {name: category.name});
  // }
  //
  //
  // updateTaskV2Category(category): Observable<any> {
  //   return this.httpClient.patch<any>(this.globals.baseUrl + '/api-v2/taskv2category/' + category.id, {name: category.name});
  // }
  //
  // deleteTaskV2Category(id): Observable<any> {
  //   return this.httpClient.delete<any>(this.globals.baseUrl + '/api-v2/taskv2category/' + id);
  // }

}
