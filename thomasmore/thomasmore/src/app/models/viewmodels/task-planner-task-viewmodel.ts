export class TaskPlannerTaskViewmodel {
  constructor(public id: number,
              public name: string,
              public date_created: Date,
              public date_completed: Date,
              public staff_name: string,
              public taskv2ModelId: number,
              public information: string) {
  }

}
