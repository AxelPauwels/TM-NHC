import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {BakkenBewerkenService} from "../../../../services/bakken-bewerken.service";

@Component({
  selector: 'app-configuration-hedgehog-containers-hospitalizations',
  templateUrl: './configuration-hedgehog-containers-hospitalizations.component.html',
  styleUrls: ['./configuration-hedgehog-containers-hospitalizations.component.css']
})
export class ConfigurationHedgehogContainersHospitalizationsComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private bakkenBewerkenService: BakkenBewerkenService) {
  }

  @Input()
  container: any;
  hospitalizations: any[];
  selectedHospitalizationToAdd: any;
  selectedContainerDivision: any;
  containerDivisions: any[] = [];

  possibleHospitalizations: any[];

  ngOnInit() {
    this.loadHospitalizations();
  }

  loadHospitalizations(): void {
    this.hospitalizations = this.container.hospitalizations;
    this.loadContainerDivisions();
    this.bakkenBewerkenService.getContainersWithRelationsByContainerNumber(this.container.id).subscribe(result => {
      this.hospitalizations = result;
      this.container.hospitalizations = result;
      this.loadContainerDivisions();
    });

    this.bakkenBewerkenService.getHedgehogsNotInContainer().subscribe(result => {
      this.possibleHospitalizations = result.map(i => {
        return {id: i.id, text: i.id.toString()}
      });
    });
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }

  loadContainerDivisions(): void {
    this.containerDivisions = [];
    if (this.hospitalizations.length == 0)
      this.containerDivisions.push({
        id: 1,
        text: 'Volledig'
      });
    if(this.hospitalizations.length == 0 || this.hospitalizations.length == 1 && this.hospitalizations[0].hedgehog_container_division == 3)
      this.containerDivisions.push({
        id: 2,
        text: 'Voorkant'
      });
    if(this.hospitalizations.length == 0 || this.hospitalizations.length == 1 && this.hospitalizations[0].hedgehog_container_division == 2)
      this.containerDivisions.push({
        id: 3,
        text: 'Achterkant'
      });
  }

  onSelectContainerDivision(event): void {
    this.selectedContainerDivision = event;
  }

  onSelectHospitalization(event): void {
    this.selectedHospitalizationToAdd = event;
  }

  onClickAddHospitalization(): void {
    if(this.selectedHospitalizationToAdd == null)
      this.selectedHospitalizationToAdd = this.possibleHospitalizations[0];
    if(this.selectedContainerDivision == null)
      this.selectedContainerDivision = this.containerDivisions[0];

    this.bakkenBewerkenService.addHedgehogToContainer({
      hospitalization: this.selectedHospitalizationToAdd.id,
      hedgehog_container: this.container.id,
      hedgehog_container_division: this.selectedContainerDivision.id
    }).subscribe(result => {
      this.loadHospitalizations();
    });
  }

  onClickDeleteHospitalization(hospitalization): void {
    this.bakkenBewerkenService.removeHedgehogFromContainer(hospitalization.hospitalization_hedgehog_container_id).subscribe(result => {
      this.loadHospitalizations();
    });
  }

}
