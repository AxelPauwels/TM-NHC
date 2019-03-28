import {Taskv2Model} from './taskv2-model';
import {Cage} from './cage';
import {Taskv2Category} from "./taskv2-category";

export class Taskv2 {
  id: number;
  taskv2Model: Taskv2Model;
  cage: Cage;
  custom_name: string;
  date_created: any;
  dateCompleted: any;
  staffName: string;
  information: string;
  taskv2_category: Taskv2Category;
}
