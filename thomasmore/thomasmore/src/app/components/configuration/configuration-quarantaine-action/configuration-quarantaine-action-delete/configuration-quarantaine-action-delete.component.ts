import { Component, OnInit } from '@angular/core';
import {QuarantaineAction} from "../../../../models/quarantaine-action";
import {BsModalRef} from "ngx-bootstrap";
import {QuarantaineActionService} from "../../../../services/quarantaine-action.service";

@Component({
  selector: 'app-configuration-quarantaine-action-delete',
  templateUrl: './configuration-quarantaine-action-delete.component.html',
  styleUrls: ['./configuration-quarantaine-action-delete.component.css']
})
export class ConfigurationQuarantaineActionDeleteComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private quarantaineActionService: QuarantaineActionService) { }

  deleteSuccess: boolean;
  quarantaineAction: QuarantaineAction;

  ngOnInit() {
  }

  onClickSave(): void {
    if(this.quarantaineAction.name == undefined || this.quarantaineAction.name == '')
      return;

    this.quarantaineActionService.delete(this.quarantaineAction).subscribe(resultQuarantaineAction => {
      this.deleteSuccess = true;
      this.bsModalRef.hide();
    });
  }

  onClickCancel(): void {
    this.bsModalRef.hide();
  }

}
