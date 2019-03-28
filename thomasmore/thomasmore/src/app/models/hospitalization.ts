export class Hospitalization {
  id: number;
  uuid: string;
  entrance: Date;
  animal: number;
  quantity: number;
  cage: number;
  exit: Date;
  exit_reason: number;
  staff_only: boolean;
  dangerous: boolean;
  medication: string;
  comment: string;
  for_adoption: boolean;
  adoption_from: Date;
  origin: string;
  id_number: string;
  status_code: string;
  statistic_code: string;
  exit_comment: string;
  just_comment: string;
  reserved: boolean;
  menu_percentage: number;
  reserved_for: string;
  contact: number;
  hospitalization_comment: number;
  hospitalization_group: number;
  postal: string;
  entrance_reason: number;
  male_quantity: number;
  female_quantity: number;

  constructor(entrance, animalId, quantity, entrance_reason, just_comment, origin, status_code, menu_percentage, male_quantity, female_quantity, exit_reason, contact, hospitalization_group_id) {
    this.entrance = entrance,
      this.animal = animalId,
      this.quantity = quantity,
      this.entrance_reason = entrance_reason,
      this.just_comment = just_comment,
      this.origin = origin,
      this.status_code = status_code,
      this.menu_percentage = menu_percentage,
      this.male_quantity = male_quantity,
      this.female_quantity = female_quantity,
      this.exit_reason = exit_reason,
      this.contact = contact,
      this.hospitalization_group = hospitalization_group_id
  }
}
