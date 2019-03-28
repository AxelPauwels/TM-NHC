import {RecurModel} from './recur-model';
import {Taskv2Category} from './taskv2-category';
import {Cage} from './cage';

export class Taskv2Model {
  id: number;
  name: string;
  recur_model: RecurModel;
  recur_day: number;
  recur_multiplier: number;
  taskv2_category: Taskv2Category;
  cage: Cage;
  information: string;
  priority: number;
}
