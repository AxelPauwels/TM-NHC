import {TaskPlannerCategoryViewmodel} from './task-planner-category-viewmodel';

export class TaskPlannerViewmodel {
  constructor(
    public date: Date,
    public taskCategories: TaskPlannerCategoryViewmodel[]
  ) {}
}
