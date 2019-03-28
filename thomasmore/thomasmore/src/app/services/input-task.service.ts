import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Globals} from "../shared/globals";


@Injectable()
export class InputTaskService {

  constructor(private http:Http, private globals: Globals) {
  }

  saveTask(task: any){
    const url = this.globals.baseUrl + '/api-v2/taskv2/';
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(url, task, {headers});
  }
}
