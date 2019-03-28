import 'rxjs/Rx';
import {Injectable, OnInit} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CageService {

  constructor(private http: Http) { }


  getCages() {
    const url = 'http://localhost:3000/api-v2/cage';
    return this.http.get(url)
      .map((response: Response) => {
        const cages = response.json();
        return cages;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

}
