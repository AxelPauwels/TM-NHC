import { Component, OnInit } from '@angular/core';
import {QuarantaineAction} from "../../../../models/quarantaine-action";
import {BsModalRef} from "ngx-bootstrap";
import {QuarantaineActionService} from "../../../../services/quarantaine-action.service";

@Component({
  selector: 'app-configuration-quarantaine-action-edit',
  templateUrl: './configuration-quarantaine-action-edit.component.html',
  styleUrls: ['./configuration-quarantaine-action-edit.component.css']
})
export class ConfigurationQuarantaineActionEditComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private quarantaineActionService: QuarantaineActionService) { }

  editSuccess: boolean;
  quarantaineAction: QuarantaineAction;

  ngOnInit() {
  }

  onClickSave(): void {
    if(this.quarantaineAction.name == undefined || this.quarantaineAction.name == '')
      return;

    let actions = [this.quarantaineActionService.create, this.quarantaineActionService.edit];
    actions[this.quarantaineAction.id == undefined ? 0 : 1].bind(this.quarantaineActionService)(this.quarantaineAction).subscribe(resultQuarantaineAction => {
      this.editSuccess = true;
      this.bsModalRef.hide();
    });
  }

  onClickCancel(): void {
    this.bsModalRef.hide();
  }

}
