import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {AuthComponent} from "../../../components/auth/auth.component";
import {Subject} from "rxjs/Subject";
import {Role} from "../../../models/role.enum";

export class AuthRequest {

  constructor(bsModalService: BsModalService, role: Role, onSuccess?: Function, onCancel?: Function) {
    this.bsModalService = bsModalService;
    this.requiredRole = role;
    this.success(onSuccess).fail(onCancel);

    this.bsModalRef = this.bsModalService.show(AuthComponent, {
      initialState: {
        onComplete: this.complete.bind(this),
        onCancel: this.hide.bind(this),
        onDestroy: this.clearSubs.bind(this),
        requiredRole: role
      }
    });
  }

  private bsModalService: BsModalService;
  private bsModalRef: BsModalRef;
  private onSuccess: Subject<any> = new Subject<any>();
  private requiredRole: Role;

  private destroySubject: Subject<boolean> = new Subject<boolean>();

  public success(callback): AuthRequest {
    if (callback == null)
      return this;
    this.onSuccess.asObservable().takeUntil(this.destroySubject).subscribe(callback);
    return this;
  }

  public fail(callback): AuthRequest {
    if (callback == null)
      return this;
    this.bsModalService.onHide.asObservable().takeUntil(this.destroySubject).subscribe(callback);
    return this;
  }

  private hide(): void {
    this.bsModalRef.hide();
    this.bsModalRef = null;
  }

  private complete(): void {
    this.onSuccess.next();
    this.clearSubs();
    this.hide();
  }

  private clearSubs(): void {
    if (this.destroySubject.closed)
      return;
    this.destroySubject.next(true);
    this.destroySubject.unsubscribe();
  }

}
