import {Component, OnInit} from '@angular/core';
import {ConfigurationTaskV2ModelViewModel} from "../../../models/viewmodels/configuration-task-v2-model-view-model";
import {Observable} from "rxjs/Observable";
import {TaskV2ModelService} from "../../../services/task-v2-model.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ConfigurationTasksEditComponent} from "./configuration-tasks-edit/configuration-tasks-edit.component";
import {ConfigurationTasksDeleteComponent} from "./configuration-tasks-delete/configuration-tasks-delete.component";

@Component({
  selector: 'app-configuration-tasks',
  templateUrl: './configuration-tasks.component.html',
  styleUrls: ['./configuration-tasks.component.css']
})
export class ConfigurationTasksComponent implements OnInit {

  constructor(private taskV2ModelService: TaskV2ModelService, private bsModalService: BsModalService) {
  }

  taskV2Models: ConfigurationTaskV2ModelViewModel[];

  bsModalRef: BsModalRef;

  ngOnInit() {
    this.loadTaskV2Models();
    this.bsModalService.onHide.subscribe(event => {
      if(this.bsModalRef == undefined)
        return;
      if (this.bsModalRef.content instanceof ConfigurationTasksEditComponent && this.bsModalRef.content.actionCompleted === true || this.bsModalRef.content instanceof ConfigurationTasksDeleteComponent && this.bsModalRef.content.deleteSuccess === true)
        this.loadTaskV2Models();
    });
  }

  loadTaskV2Models(): void {
    this.taskV2ModelService.getAllTaskV2ModelsConfigurationViewModels().subscribe(result => {
      this.taskV2Models = [];
      result.forEach(res => {
        let taskModel: ConfigurationTaskV2ModelViewModel = Object.assign(new ConfigurationTaskV2ModelViewModel(), res);
        this.taskV2Models.push(taskModel);
      });
    });
  }

  onClickAdd(): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationTasksEditComponent, {initialState: {taskV2Model: new ConfigurationTaskV2ModelViewModel()}});
  }

  onClickEdit(taskV2Model: ConfigurationTaskV2ModelViewModel): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationTasksEditComponent, {initialState: {taskV2Model: taskV2Model}});
  }

  onClickDelete(taskV2Model: ConfigurationTaskV2ModelViewModel): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationTasksDeleteComponent, {initialState: {taskV2Model: taskV2Model}});
  }

}
