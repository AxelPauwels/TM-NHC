import {PrepareCategory} from './prepare-category';
import {AnimalKingdom} from "./animal-kingdom";

export class Animal {
  id: number;
  name: string;
  eatsAtNight: number;
  menuHash: string;
  foodPrepareCategory: PrepareCategory;
  groupName: string;
  default_for_adoption : boolean;
  ideal_weight_general_male:number;
  ideal_weight_female:number;
  image:string;
  scientific_name:string;

  // defaultForAdoption: number;
  // idealWeightGeneralMale: number;
  // idealWeightFemale: number;
  // image: string;
  // scientificName:string;
  // animalKingdom: AnimalKingdom;


  constructor( name, groupName) {
    this.name = name;
    this.groupName = groupName;
  }
}
