import {TaskPlannerTaskViewmodel} from './task-planner-task-viewmodel';

export class TaskPlannerCategoryViewmodel {
  constructor(
    public id: number,
    public name: string,
    public tasks: TaskPlannerTaskViewmodel[]
  ) {}
}
