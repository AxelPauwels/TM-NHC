import {Injectable} from '@angular/core';
import {AuthRequest} from "../classes/auth-request";
import {Role} from "../../../models/role.enum";
import {BsModalService} from "ngx-bootstrap";

@Injectable()
export class AuthRequestService {

  constructor(private bsModalService: BsModalService) {}

  requestAuthentication(role: Role, success?: Function, fail?: Function): AuthRequest {
    return new AuthRequest(this.bsModalService, role)
      .fail(fail)
      .success(success);

  }

}
