import {Component, Input, OnInit} from '@angular/core';
import {ConfigurationTaskV2ModelViewModel} from "../../../../models/viewmodels/configuration-task-v2-model-view-model";
import {TaskV2ModelService} from "../../../../services/task-v2-model.service";
import {BsModalRef} from "ngx-bootstrap";

@Component({
  selector: 'app-configuration-tasks-delete',
  templateUrl: './configuration-tasks-delete.component.html',
  styleUrls: ['./configuration-tasks-delete.component.css']
})
export class ConfigurationTasksDeleteComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private taskV2ModelService: TaskV2ModelService) { }

  @Input()
  taskV2Model: ConfigurationTaskV2ModelViewModel;

  deleteSuccess: boolean;

  ngOnInit() {
  }

  onConfirm(): void {
    this.taskV2ModelService.deleteTaskV2Model(this.taskV2Model.id).subscribe(result => {
      this.deleteSuccess = true;
      this.bsModalRef.hide();
    });
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }

}
