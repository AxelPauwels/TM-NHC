import {Measure} from './measure';
import {PrepareCategory} from './prepare-category';

export class Food {
  id: number;
  name: string;
  feedingMeasure: Measure;
  displaySingular: string;
  displayPlural: string;
  prepareCategory: PrepareCategory;
  extraQuantity: number;
}
