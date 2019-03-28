import {Injectable} from '@angular/core';
import {Globals} from "../../../shared/globals";
import {Role} from "../../../models/role.enum";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class AuthService {

  constructor(private globals: Globals, private httpClient: HttpClient) {}

  authenticate(role: Role, password: string): Observable<boolean> {
    let result = new Subject<boolean>();
    this.httpClient.get<any[]>(`${this.globals.baseUrl}/api-v2/user/pin/${password}`).subscribe(roles => {
      result.next(roles.length != 0 && roles[0].roles.split(';').includes(role.toString()));
    });
    return result;
  }

}
