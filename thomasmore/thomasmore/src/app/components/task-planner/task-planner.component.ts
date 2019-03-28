import {Component, OnInit} from '@angular/core';
import {TaskplannerService} from '../../services/taskplanner.service';
import {TaskPlannerViewmodel} from '../../models/viewmodels/task-planner-viewmodel';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {InputTaskComponent} from "../input-task/input-task.component";

@Component({
  selector: 'app-task-planner',
  templateUrl: './task-planner.component.html',
  styleUrls: ['./task-planner.component.css']
})
export class TaskPlannerComponent implements OnInit {

  constructor(private taskPlannerService: TaskplannerService, private bsModalService: BsModalService) {
  }

  taskPlannerViewModel: TaskPlannerViewmodel;

  currentDate: Date = new Date();
  public loading = false;
  bsModalRef: BsModalRef;


  ngOnInit() {
    this.loadTaskPlanner();
    this.bsModalService.onHide.subscribe(this.closeModal.bind(this));
  }


  loadTaskPlanner(): void {
    // this.loading = true;
    // if (this.taskPlannerViewModel != null)
    //   this.taskPlannerViewModel.taskCategories = [];
    this.taskPlannerService.getTaskPlannerViewModel(this.currentDate).subscribe(result => {
      this.sortTasks(result.taskCategories);
      let containsNewCategory = this.taskPlannerViewModel == undefined || result.taskCategories.length == this.taskPlannerViewModel.taskCategories.length;
      if (!containsNewCategory)
        for (let i = 0; i < result.taskCategories.length; i++)
          if (!this.taskPlannerViewModel.taskCategories.find(cat => cat.id == result.taskCategories[i].id)) {
            containsNewCategory = true;
            break;
          }

      if (containsNewCategory)
        this.taskPlannerViewModel = result;
      else
        for (let i = 0; i < result.taskCategories.length; i++)
          this.taskPlannerViewModel.taskCategories[i].tasks = result.taskCategories[i].tasks;
      // this.loading = false;
    });
  }

  sortTasks(categories): void {
    categories.forEach(category => category.tasks.sort((obj1, obj2) => {
      if (!obj1.date_completed && !obj2.date_completed) {
        if (obj1.date_created < obj2.date_created) {
          return 1;
        } else if (obj1.date_created > obj2.date_created) {
          return -1;
        }
        return 0;
      }
      if (obj1.date_completed && !obj2.date_completed) {
        return 1;
      }
      if (!obj1.date_completed && obj2.date_completed) {
        return -1;
      }
    }));
  }

  changeDate(up): void {
    let newDate;
    if (up === -1)
      newDate = new Date();
    else if (up === 1 || up === 0)
      newDate = new Date(this.currentDate.getTime() + (1000 * 60 * 60 * 24 * (-1 + up * 2)));
    else
      newDate = up;

    newDate.setHours(0, 0, 0, 0);
    this.currentDate.setHours(0, 0, 0, 0);
    if (newDate.getTime() == this.currentDate.getTime())
      return;
    this.taskPlannerViewModel.taskCategories.forEach(tc => tc.tasks = []);
    this.currentDate = newDate;
    this.loadTaskPlanner();
  }

  addTask(): void {
    this.bsModalRef = this.bsModalService.show(InputTaskComponent, {});
  }

  closeModal(): void {
    this.loadTaskPlanner();
  }

}
