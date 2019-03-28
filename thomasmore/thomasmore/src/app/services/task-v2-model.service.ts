import { Injectable } from '@angular/core';
import {ConfigurationTaskV2CategoryViewModel} from "../models/viewmodels/configuration-task-v2-category-view-model";
import {Globals} from "../shared/globals";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {ConfigurationTaskV2ModelViewModel} from "../models/viewmodels/configuration-task-v2-model-view-model";
import {Taskv2Model} from "../models/taskv2-model";

@Injectable()
export class TaskV2ModelService {

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  getAllTaskV2ModelsConfigurationViewModels(): Observable<ConfigurationTaskV2ModelViewModel[]> {
    return this.httpClient.get<ConfigurationTaskV2ModelViewModel[]>(this.globals.baseUrl + '/api-v2/taskv2model/configviewmodel');
  }

  createTaskV2Model(taskV2Model): Observable<Taskv2Model> {
    return this.httpClient.post<Taskv2Model>(this.globals.baseUrl + '/api-v2/taskv2model', taskV2Model);
  }

  updateTaskV2Model(taskV2Model): Observable<Taskv2Model> {
    return this.httpClient.put<Taskv2Model>(this.globals.baseUrl + '/api-v2/taskv2model', taskV2Model);
  }

  deleteTaskV2Model(taskV2ModelId): Observable<any> {
    return this.httpClient.delete<any>(this.globals.baseUrl + '/api-v2/taskv2model/' + taskV2ModelId);
  }

}
