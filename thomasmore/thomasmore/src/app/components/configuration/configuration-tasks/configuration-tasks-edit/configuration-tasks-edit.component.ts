import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {ConfigurationTaskV2ModelViewModel} from "../../../../models/viewmodels/configuration-task-v2-model-view-model";
import {RecurModel} from "../../../../models/recur-model";
import {RecurModelService} from "../../../../services/recur-model.service";
import {Taskv2CategoryService} from "../../../../services/taskv2-category.service";
import {Taskv2Category} from "../../../../models/taskv2-category";
import {TaskV2ModelService} from "../../../../services/task-v2-model.service";
import {Taskv2Model} from "../../../../models/taskv2-model";
import moment = require("moment");

@Component({
  selector: 'app-configuration-tasks-edit',
  templateUrl: './configuration-tasks-edit.component.html',
  styleUrls: ['./configuration-tasks-edit.component.css']
})
export class ConfigurationTasksEditComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private recurModelService: RecurModelService, private taskV2Categoryservice: Taskv2CategoryService, private taskV2ModelService: TaskV2ModelService) {
  }

  @Input()
  taskV2Model: ConfigurationTaskV2ModelViewModel;

  // Dropdown data
  taskV2Categories: Taskv2Category[];
  recurModels: RecurModel[];
  recurDays: any[] = [];
  recurMonths: any[] = [];

  selectedRecurModel: RecurModel;
  selectedTaskV2Category: Taskv2Category;
  selectedRecurDay: any = {};
  selectedRecurMonth: any = {};

  initialLoadCompleted: boolean;
  actionCompleted: boolean;


  ngOnInit() {
    this.taskV2Model = Object.assign(new ConfigurationTaskV2ModelViewModel(), this.taskV2Model);
    this.recurModelService.getAllRecurModels().subscribe(result => {
      result.forEach(recurModel => recurModel.text = recurModel.name);
      this.recurModels = result;
      this.selectedRecurModel = this.taskV2Model.recurModel == null ? this.recurModels[0] : this.recurModels.find(model => model.id == this.taskV2Model.recurModel);

      this.taskV2Categoryservice.getAll().subscribe(result => {
        result.forEach(taskV2Category => taskV2Category.text = taskV2Category.name);
        this.taskV2Categories = result;
        this.selectedTaskV2Category = this.taskV2Model.categoryId == null ? this.taskV2Categories[0] : this.taskV2Categories.find(category => category.id == this.taskV2Model.categoryId);

        for (let i = 1; i <= 12; i++)
          this.recurMonths.push({id: i, text: moment().month(i - 1).format('MMMM')});

        this.selectedRecurMonth = this.taskV2Model.recurMonth == null ? this.recurMonths[0] : this.recurMonths.find(month => month.id == this.taskV2Model.recurMonth + 1);

        this.loadRecurDays();
        this.initialLoadCompleted = true;
      });

    });
  }

  loadRecurDays(): void {
    this.recurDays = [];
    switch (this.selectedRecurModel.id) {
      case 2:
        for (let i = 1; i <= 7; i++) {
          this.recurDays.push({id: i, text: moment().day(i == 7 ? 0 : i).format('dddd')});
        }
        break;
      case 3:
        for (let i = 1; i <= 31; i++) {
          this.recurDays.push({id: i, text: i.toString()});
        }
        break;
      case 4:
        let totalDaysInMonth = this.selectedRecurMonth.id == 2 ? 28 : moment().month(this.selectedRecurMonth.id).daysInMonth();
        for (let i = 1; i <= totalDaysInMonth; i++) {
          this.recurDays.push({id: i, text: i.toString()});
        }
        break;
    }
    this.selectedRecurDay = this.recurDays.length == 0 ? {} : (this.taskV2Model.recurDay == null ? this.recurDays[0] : this.recurDays.find(day => day.id == this.taskV2Model.recurDay + (this.taskV2Model.recurModel == 2 ? 1 : 0)));
  }

  onSelectRecurDay(value: any): void {
    this.selectedRecurDay = value;
  }

  onSelectRecurModel(value: RecurModel): void {
    this.selectedRecurModel = value;
    this.loadRecurDays();
  }

  onSelectRecurMonth(value: any): void {
    this.selectedRecurMonth = value;
    this.loadRecurDays();
  }

  onSelectTaskV2Category(value: any): void {
    this.selectedTaskV2Category = value;
  }

  onClickSave(): void {
    const newTaskModel = Object.assign(new Taskv2Model(), {
      id: this.taskV2Model.id,
      name: this.taskV2Model.name,
      taskv2_category: this.selectedTaskV2Category.id,
      recur_model: this.selectedRecurModel.id,
      recur_day: this.selectedRecurDay.id - +(this.selectedRecurModel.id == 2),
      recur_month: this.selectedRecurMonth.id - 1,
      recur_multiplier: this.taskV2Model.recurMultiplier,
      information: this.taskV2Model.information
    });


    if (newTaskModel.name == undefined || newTaskModel.name == '')
      return;

    if (newTaskModel.recur_model != 4)
      newTaskModel.recur_month = null;
    if (newTaskModel.recur_model == 1)
      newTaskModel.recur_day = null;
    if (newTaskModel.recur_multiplier == 1)
      newTaskModel.recur_multiplier = null;


    let actionToDo = this.taskV2Model.id == null ? this.taskV2ModelService.createTaskV2Model : this.taskV2ModelService.updateTaskV2Model;
    actionToDo.bind(this.taskV2ModelService)(newTaskModel).subscribe(result => {
      this.actionCompleted = true;
      this.bsModalRef.hide();
    });

  }

  onClickCancel(): void {
    this.bsModalRef.hide();
  }

  getRecurString(): string {
    const newTaskModel = Object.assign(new ConfigurationTaskV2ModelViewModel(), {
      taskv2_category: this.selectedTaskV2Category,
      name: this.taskV2Model.name,
      recurModel: this.selectedRecurModel.id,
      recurDay: this.selectedRecurDay.id - +(this.selectedRecurModel.id == 2),
      recurMonth: this.selectedRecurMonth.id - 1,
      recurMultiplier: this.taskV2Model.recurMultiplier
    });
    return newTaskModel.getResultString();
  }

  isValidName(): boolean {
    return this.taskV2Model.name != null && this.taskV2Model.name.trim() != '';
  }

}
