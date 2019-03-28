import {Component, Input, OnInit} from '@angular/core';
import {TaskPlannerTaskViewmodel} from '../../../../models/viewmodels/task-planner-task-viewmodel';
import {TaskplannerService} from '../../../../services/taskplanner.service';

@Component({
  selector: 'app-task-planner-task-item',
  templateUrl: './task-planner-task-item.component.html',
  styleUrls: ['./task-planner-task-item.component.css']
})
export class TaskPlannerTaskItemComponent implements OnInit {

  constructor(private taskPlannerService: TaskplannerService) {
  }

  @Input()
  task: TaskPlannerTaskViewmodel;

  @Input()
  currentDate: Date;

  public loading = false;

  ngOnInit() {
  }

  onClickSave() {
    this.loading = true;
    if (this.task.staff_name.trim() !== '' && this.task.staff_name !== undefined) {
      const completedTime = new Date();
      const task = this.task;
      this.taskPlannerService.completeTask(task.id, completedTime, task.staff_name).subscribe(result => {
        task.date_completed = completedTime;
        this.loading = false;
      }, error => {
        this.loading = false;
      });
    }
  }

  isSameDate(date: Date) {
    const clonedDate = new Date(date);
    return clonedDate.getFullYear() === this.currentDate.getFullYear() && clonedDate.getMonth() === this.currentDate.getMonth() && clonedDate.getDay() === this.currentDate.getDay();
  }

}
