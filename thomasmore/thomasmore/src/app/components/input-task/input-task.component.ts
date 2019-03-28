import {Input, Component, OnInit } from '@angular/core';
import {Cage} from "../../models/cage";
import {Taskv2} from "../../models/taskv2";
import {CageService} from "../../services/cage.service";
import {InputTaskService} from "../../services/input-task.service";
import {TaskplannerService} from "../../services/taskplanner.service";
import {Taskv2Category} from "../../models/taskv2-category";
import {SelectModule} from 'ng2-select';
import {BsModalRef} from "ngx-bootstrap";
import {FormGroup} from "@angular/forms";
import {IMyDpOptions} from "mydatepicker";


@Component({
  selector: 'app-input-task',
  templateUrl: './input-task.component.html',
  styleUrls: ['./input-task.component.css']
})

export class InputTaskComponent implements OnInit {
  @Input()
  taskNames = [];

  task = new Taskv2();
  selectName: string;
  taskName: string;
  selectedCage: any;
  cages = [];
  cagesSelect = [];
  taskCategories = [];
  form: any;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };

  constructor(private cageservice:CageService, private inputTaskService: InputTaskService, private taskPlannerService: TaskplannerService, public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.task.date_created = new Date();

    this.cageservice.getCages().subscribe(
      (cages: Cage[]) => {
        this.cages = cages;
      });


    this.taskPlannerService.getAllTaskV2Categories().subscribe(
      (categories: Taskv2Category[]) => {
        this.taskCategories = categories;
        console.dir(this.taskCategories);
    });

    for(var i = 0; i < this.cages.length; i++){
      this.cagesSelect.push({
        id: this.cages[i].id,
        text: this.cages[i].name
      });
    }

    this.taskNames.push("poetsen");
    this.taskNames.push("gritselen");

    this.taskNames.push("andere");
  }

  //knop "opslaan"
  onSubmit(){

    this.validateForm();

    let saveTask = {
      custom_name: this.task.custom_name,
      cage: 0,
      date_created: this.getDateString(this.task.date_created),
      information: this.task.information,
      taskv2_category: this.task.taskv2_category.id
    };

    if(this.selectName == "poetsen" || this.selectName == "gritselen"){
      this.taskName = this.selectName + " " + this.task.cage.name;
      saveTask.custom_name = this.taskName;
      saveTask.cage = this.task.cage.id;
    } else {
      saveTask.custom_name = this.task.custom_name;
      saveTask.cage = null;
    }

    this.inputTaskService.saveTask(saveTask).subscribe(res => {
      this.bsModalRef.hide();
    });

  }

  //knop "annuleren"
  onCancel() {
    this.bsModalRef.hide();
  }

  //geeft true terug als de form valide is
  validateForm(){
    if(this.selectName == null || this.selectName == '--selecteer--'){
      return false;
    }

    if(this.selectName == 'andere'){
      if(this.task.custom_name == null || this.task.custom_name == ''){
        return false;
      }
      if(this.task.information == null || this.task.information == ''){
        return false;
      }
    } else {
      if(this.task.cage == null){
        return false;
      }
    }

    if(this.task.taskv2_category == null){
      return false;
    }

    if(this.task.date_created == null){
      return false;
    }

    return true;
  }

  getDateString(object: any){
    return object.date.year + '-' + object.date.month + '-' + object.date.day;
  }

  /*loadCages(){
    for(var i = 0; i < this.cages.length; i++){
      this.cagesSelect.push({
        id: this.cages[i].id,
        text: this.cages[i].name
      });
    }
    console.dir(this.cagesSelect);
  }*/
}
