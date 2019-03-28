import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable()
export class Globals {

  constructor(private router: Router) {
  }
  //baseUrl: string = `http://${environment.backendHost}:${environment.backendPort}${environment.backendPath}`;
  baseUrl: string = 'http://' + location.href.split('/')[2].split(':')[0] + ":" + environment.backendPort;
  baseUrlTM: string = 'http://' + location.href.split('/')[2].split(':')[0]; // :4200 weggedaan
  emailValidationPattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
}
