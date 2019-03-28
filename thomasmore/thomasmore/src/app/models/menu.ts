import {Animal} from './animal';
import {Food} from './food';

export class Menu {
  id: number;
  animal: Animal;
  food: Food;
  quantity: number;
  each: number;
  board: number;
}
