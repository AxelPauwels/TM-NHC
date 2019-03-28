import { Injectable } from '@angular/core';
import {Globals} from "../shared/globals";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {QuarantaineAction} from "../models/quarantaine-action";

@Injectable()
export class QuarantaineActionService {

  constructor(private httpClient: HttpClient, private  globals: Globals) {
  }

  getAll(): Observable<QuarantaineAction[]> {
    return this.httpClient.get<QuarantaineAction[]>(this.globals.baseUrl + '/api-v2/quarantaineaction/');
  }

  create(quarantaineAction: QuarantaineAction): Observable<QuarantaineAction> {
    return this.httpClient.post<QuarantaineAction>(this.globals.baseUrl + '/api-v2/quarantaineaction/', quarantaineAction);
  }

  edit(quarantaineAction: QuarantaineAction): Observable<QuarantaineAction> {
    return this.httpClient.put<QuarantaineAction>(this.globals.baseUrl + '/api-v2/quarantaineaction/', quarantaineAction);
  }

  delete(quarantaineAction: QuarantaineAction): Observable<any> {
    return this.httpClient.delete<any>(this.globals.baseUrl + '/api-v2/quarantaineaction/' + quarantaineAction.id);
  }

}
