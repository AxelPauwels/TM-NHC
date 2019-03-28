import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Taskv2Category} from '../models/taskv2-category';
import {HttpClient} from '@angular/common/http';
import {TaskPlannerViewmodel} from '../models/viewmodels/task-planner-viewmodel';
import {Globals} from "../shared/globals";

@Injectable()
export class TaskplannerService {

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  getAllTaskV2Categories(): Observable<Taskv2Category[]> {
    return this.httpClient.get<Taskv2Category[]>(this.globals.baseUrl + '/api-v2/taskv2category');
  }

  getTaskPlannerViewModel(date: Date): Observable<TaskPlannerViewmodel> {
    return this.httpClient.get<TaskPlannerViewmodel>(this.globals.baseUrl + '/api-v2/taskplanner/' + date.getTime());
  }

  completeTask(taskId: number, date: Date, staffName: string) {
    return this.httpClient.patch(this.globals.baseUrl + '/api-v2/taskv2/id/' + taskId  , {id: taskId, date_completed: new Date(date), staff_name: staffName});
  }


}
