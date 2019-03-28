import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Globals} from "../shared/globals";
import {ConfigurationTaskV2CategoryViewModel} from "../models/viewmodels/configuration-task-v2-category-view-model";
import {Taskv2Category} from "../models/taskv2-category";

@Injectable()
export class Taskv2CategoryService {

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  getAll(): Observable<Taskv2Category[]> {
    return this.httpClient.get<Taskv2Category[]>(this.globals.baseUrl + '/api-v2/taskv2category');
  }

  getAllTaskV2CategoriesConfigurationViewModels(): Observable<ConfigurationTaskV2CategoryViewModel[]> {
    return this.httpClient.get<ConfigurationTaskV2CategoryViewModel[]>(this.globals.baseUrl + '/api-v2/taskv2category/configviewmodel');
  }

  createTaskV2Category(category): Observable<any> {
    return this.httpClient.post<any>(this.globals.baseUrl + '/api-v2/taskv2category', {name: category.name});
  }


  updateTaskV2Category(category): Observable<any> {
    return this.httpClient.patch<any>(this.globals.baseUrl + '/api-v2/taskv2category/' + category.id, {name: category.name});
  }

  deleteTaskV2Category(id): Observable<any> {
    return this.httpClient.delete<any>(this.globals.baseUrl + '/api-v2/taskv2category/' + id);
  }

}
