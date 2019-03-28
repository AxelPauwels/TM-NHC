import {Component, OnInit} from '@angular/core';
import {QuarantaineAction} from "../../../models/quarantaine-action";
import {Observable} from "rxjs/Observable";
import {QuarantaineActionService} from "../../../services/quarantaine-action.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ConfigurationQuarantaineActionEditComponent} from "./configuration-quarantaine-action-edit/configuration-quarantaine-action-edit.component";
import {ConfigurationQuarantaineActionDeleteComponent} from "./configuration-quarantaine-action-delete/configuration-quarantaine-action-delete.component";

@Component({
  selector: 'app-configuration-quarantaine-action',
  templateUrl: './configuration-quarantaine-action.component.html',
  styleUrls: ['./configuration-quarantaine-action.component.css']
})
export class ConfigurationQuarantaineActionComponent implements OnInit {

  constructor(private quarantaineActionService: QuarantaineActionService, private bsModalService: BsModalService) {
  }

  quarantaineActions: Observable<QuarantaineAction[]>;
  bsModalRef: BsModalRef;

  ngOnInit() {
    this.loadQuarantaineActions();
    this.bsModalService.onHide.subscribe(event => {
      if(this.bsModalRef == undefined)
        return;
      if (this.bsModalRef.content instanceof ConfigurationQuarantaineActionEditComponent && this.bsModalRef.content.editSuccess === true || this.bsModalRef.content instanceof ConfigurationQuarantaineActionDeleteComponent && this.bsModalRef.content.deleteSuccess === true)
        this.loadQuarantaineActions();
    });
  }

  loadQuarantaineActions(): void {
    this.quarantaineActions = this.quarantaineActionService.getAll();
  }

  onClickAdd(): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationQuarantaineActionEditComponent, {initialState: {quarantaineAction: new QuarantaineAction()}});
  }

  onClickEdit(quarantaineAction: QuarantaineAction): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationQuarantaineActionEditComponent, {initialState: {quarantaineAction: Object.assign(new QuarantaineAction(), quarantaineAction)}});
  }

  onClickDelete(quarantaineAction: QuarantaineAction): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationQuarantaineActionDeleteComponent, {initialState: {quarantaineAction: Object.assign(new QuarantaineAction(), quarantaineAction)}});
  }


}
