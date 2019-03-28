import {Component, OnInit} from '@angular/core';
import {FichesService} from "../../../services/fiches.service";
import {FichesSession} from "../../../shared/fiches-session";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Animal} from "../../../models/animal";
import {EntranceReason} from "../../../models/entrance-reason";
import {HospitalizationComment} from "../../../models/hospitalization-comment";
import {Hospitalization} from "../../../models/hospitalization";
import {Weight} from "../../../models/weight";
import {FichesAlgemeenModalComponent} from "../fiches-algemeen-modal/fiches-algemeen-modal.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {FichesCageModalComponent} from "../fiches-cage-modal/fiches-cage-modal.component";

@Component({
  selector: 'app-fiches-overzicht',
  templateUrl: './fiches-overzicht.component.html',
  styleUrls: ['../all-fiches-components.component.css', './fiches-overzicht.component.css']
})
export class FichesOverzichtComponent implements OnInit {

  // gegevens van session
  animals: Observable<Animal[]>;
  entrance_reasons: Observable<EntranceReason[]>;
  hospitalizationComments: Observable<HospitalizationComment[]>;
  hospitalization: Hospitalization;
  weights: Weight[];
  animal: Animal;
  myDatePickerOptions = this.fichesSession.myDatePickerOptions;
  // nieuwe gegegevens van deze component
  overzichtForm: FormGroup = null;
  animal_isMale: boolean = true;
  animal_ideal_weight_general: number;
  bsModalRef: BsModalRef;


  constructor(private fichesService: FichesService, private fichesSession: FichesSession, private bsModalService: BsModalService) {
  }

  ngOnInit() {
    // leeg formulier aanmaken
    this.overzichtForm = new FormGroup({
      entrance: new FormControl(null),
      animal: new FormControl(null),
      entrance_reason: new FormControl(null),
      origin: new FormControl(null),
      id_number: new FormControl(null),
      sex: new FormControl(null),
      streefgewichtDatum: new FormControl(null),
      streefgewicht: new FormControl(null)
    });

    // gegevens vanuit session
    this.fichesService.ficheSessionIsCompleted.subscribe(
      () => {
        this.animals = this.fichesSession.animals;
        this.entrance_reasons = this.fichesSession.entrance_reasons;
        this.hospitalizationComments = this.fichesSession.hospitalizationComments;
      }
    );

    // gegevens ophalen - hospitalization
    this.fichesService.getHospitalizationById(this.fichesSession.id).subscribe(
      (array: any) => {
        this.hospitalization = array[0];
        // bijhouden of het male of female is
        if (this.hospitalization.male_quantity == 1) {
          this.animal_isMale = true;
          this.fichesSession.animal_isMale = true;
        } else {
          this.animal_isMale = false;
          this.fichesSession.animal_isMale = false;
        }

        // gegevens ophalen - animal
        this.fichesService.getAnimalById(array[0].animal).subscribe(
          (array: any) => {
            this.animal = array[0];

            // het ideale gewicht bijhouden (afhankelijk het male of female is)
            let _ideal_weight_general = this.animal.ideal_weight_general_male;
            if (!this.animal_isMale) {
              _ideal_weight_general = this.animal.ideal_weight_female;
            }
            this.animal_ideal_weight_general = _ideal_weight_general;

            // gegevens opslaan in ficheSession voor andere componenten
            this.fichesSession.hospitalization = this.hospitalization;
            this.fichesSession.animal = this.animal;
            this.fichesSession.animal_ideal_weight_general = this.animal_ideal_weight_general;

            // gegevens ophalen - gewichten van deze hospitalization
            this.fichesService.getWeightsByHospitalizationId(this.fichesSession.id).subscribe(
              (array: any) => {
                this.weights = array;

                this.weights = this.sortArray("byDate", array);
                this.fichesSession.weights = this.sortArray("byDate", array);
                this.fichesService.ficheSessionIsComplete();
                this.fillForm_overzichtForm();
              }
            );
          }
        );
      }
    );

    // luisteren wannneer er een weight (streefgewicht) wordt toegevoegd, en vervolgens de table updaten
    // of via array.push?
    this.fichesService.updateWeightsTable.subscribe(() => {
      this.fichesService.getWeightsByHospitalizationId(this.fichesSession.id).subscribe(
        (array: any) => {
          this.weights = this.sortArray("byDate", array);
          this.fichesSession.weights = this.sortArray("byDate", array);
        }
      );
    })
  }

  // sorteerfuncties voor arrays
  sortArray(sorteerFunctie: string, array: any) {
    switch (sorteerFunctie) {
      case "byDate":
        array.sort((a: any, b: any) => {
          if (a.date > b.date) {
            return -1;
          } else if (a.date < b.date) {
            return 1;
          } else {
            return 0;
          }
        });
        return array;
    }
  }

  // formulier opvullen wanneer data binnen is
  fillForm_overzichtForm() {
    this.setDate();
    (<FormControl>this.overzichtForm.controls['animal']).setValue(this.animal.id, {onlySelf: true});
    (<FormControl>this.overzichtForm.controls['entrance_reason']).setValue(this.hospitalization.entrance_reason, {onlySelf: true});
    (<FormControl>this.overzichtForm.controls['origin']).setValue(this.hospitalization.origin, {onlySelf: true});
    (<FormControl>this.overzichtForm.controls['id_number']).setValue(this.hospitalization.id_number, {onlySelf: true});
    let sex = 0; // 0 is mannelijk, 1 is vrouwelijk
    if (this.hospitalization.female_quantity == 1) {
      sex = 1;
    }
    (<FormControl>this.overzichtForm.controls['sex']).setValue(sex, {onlySelf: true});
  };

  // datum 'setten' via patchValue-functie
  setDate(): void {
    // datum van datebase omzetten naar een echte Datum
    const entranceDate = new Date(this.hospitalization.entrance);
    this.overzichtForm.patchValue({
      entrance: {
        date: {
          year: entranceDate.getFullYear(),
          month: entranceDate.getMonth() + 1,
          day: entranceDate.getDate()
        }
      }
    });
    // De huidige datum instellen voor de streefgewichten
    const weightDate = new Date();
    this.overzichtForm.patchValue({
      streefgewichtDatum: {
        date: {
          year: weightDate.getFullYear(),
          month: weightDate.getMonth() + 1,
          day: weightDate.getDate()
        }
      }
    });
  }

  onClick_overzichtOpslaan() {
    this.hospitalization.entrance = this.getCorrectDateFormat(this.overzichtForm.value.entrance.date);
    this.animal.id = this.overzichtForm.value.animal;
    this.hospitalization.animal = this.overzichtForm.value.animal;
    this.hospitalization.entrance_reason = this.overzichtForm.value.entrance_reason;
    this.hospitalization.origin = this.overzichtForm.value.origin;
    this.hospitalization.id_number = this.overzichtForm.value.id_number;

    // het ideale gewicht bijhouden (afhankelijk het male of female is)
    this.animal_isMale = this.overzichtForm.value.sex == 0;
    this.fichesSession.animal_isMale = this.overzichtForm.value.sex == 0;

    if (this.animal_isMale) {
      this.hospitalization.female_quantity = 0;
      this.hospitalization.male_quantity = 1;
    } else {
      this.hospitalization.female_quantity = 1;
      this.hospitalization.male_quantity = 0;
    }
    this.fichesSession.hospitalization = this.hospitalization;
    this.fichesService.updateHospitalizationById(this.hospitalization);

    this.fichesSession.algemeenModalHeader="Succes";
    this.fichesSession.algemeenModalText="Overzicht Fiche is succesvol opgeslagen";
    this.bsModalRef = this.bsModalService.show(FichesAlgemeenModalComponent, {});

  }

  getCorrectDateFormat(object: any) {
    // de datum (object) vanuit de datepicker omzetten om correct op te slaan in de database
    const year = object.year.toString();
    let month = object.month.toString();
    const day = object.day.toString();

    // de "leading zero" fixen bij sommige browsers die de maand teruggeven als "1" ipv "01"
    if (month.length == 1) {
      month = "0" + object.month.toString();
    }
    return new Date(year + "-" + month + "-" + day);
  }

  onClick_nieuwGewichtOpslaan() {
    if (this.overzichtForm.value.streefgewicht != null) {
      let newWeight = new Weight();
      newWeight.date = this.getCorrectDateFormat(this.overzichtForm.value.streefgewichtDatum.date);
      newWeight.hospitalization = this.hospitalization.id;
      newWeight.grams = this.overzichtForm.value.streefgewicht;
      this.fichesService.insertNewWeight(newWeight).subscribe(
        () => {
          this.fichesService.updateWeights();
        },
        error => {
          this.fichesSession.algemeenModalHeader="Mislukt";
          this.fichesSession.algemeenModalText = "Er werd al een gewicht geregistreerd vandaag!";
          this.bsModalRef = this.bsModalService.show(FichesAlgemeenModalComponent, {});
        }
      );
    } else {
      this.fichesSession.algemeenModalHeader="Mislukt";
      this.fichesSession.algemeenModalText = "Er werd geen gewicht ingevuld !";
      this.bsModalRef = this.bsModalService.show(FichesAlgemeenModalComponent, {});
    }
  }


}
