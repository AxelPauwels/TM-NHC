import {Component, Input, OnInit} from '@angular/core';
import {Taskv2Category} from '../../../models/taskv2-category';
import {Taskv2} from '../../../models/taskv2';
import {TaskPlannerCategoryViewmodel} from "../../../models/viewmodels/task-planner-category-viewmodel";

@Component({
  selector: 'app-task-planner-category-item',
  templateUrl: './task-planner-category-item.component.html',
  styleUrls: ['./task-planner-category-item.component.css']
})
export class TaskPlannerCategoryItemComponent implements OnInit {

  constructor() { }

  @Input()
  taskCategory: TaskPlannerCategoryViewmodel;

  @Input()
  currentDate: Date;

  ngOnInit() {
  }
}
