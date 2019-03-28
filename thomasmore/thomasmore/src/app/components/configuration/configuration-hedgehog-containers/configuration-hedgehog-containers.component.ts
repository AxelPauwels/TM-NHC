import {Component, OnInit} from '@angular/core';
import {HedgehogContainerDivision} from "../../../models/hedgehog-container-division";
import {Observable} from "rxjs/Observable";
import {BakkenBewerkenService} from "../../../services/bakken-bewerken.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {ConfigurationHedgehogContainersEditComponent} from "./configuration-hedgehog-containers-edit/configuration-hedgehog-containers-edit.component";
import {ConfigurationHedgehogContainersHospitalizationsComponent} from "./configuration-hedgehog-containers-hospitalizations/configuration-hedgehog-containers-hospitalizations.component";

@Component({
  selector: 'app-configuration-hedgehog-containers',
  templateUrl: './configuration-hedgehog-containers.component.html',
  styleUrls: ['./configuration-hedgehog-containers.component.css']
})
export class ConfigurationHedgehogContainersComponent implements OnInit {

  constructor(private bakkenBewerkenService: BakkenBewerkenService, private bsModalService: BsModalService) {
  }

  bsModalRef: BsModalRef;
  containerDivisions: HedgehogContainerDivision[];
  containers: any[];
  numberOfContainers: number;

  ngOnInit() {
    this.bsModalService.onHide.subscribe(this.onHideModal.bind(this));
    this.loadContainerDivisions();
    this.loadContainers();
  }

  onHideModal(): void {
    if (this.bsModalRef == null)
      return;
    if(this.bsModalRef.content instanceof ConfigurationHedgehogContainersEditComponent && this.bsModalRef.content.changedNumber)
      this.loadContainers();
  }

  loadContainers(): void {
    this.bakkenBewerkenService.getContainers().subscribe(containers => {
      this.containers = containers;
      this.numberOfContainers = this.containers.length;

      this.bakkenBewerkenService.getContainersHospitalizations().subscribe(hospitalizations => {
        hospitalizations.forEach(hospitalization => {
          if(hospitalization == undefined)
          hospitalization.name = this.containerDivisions[hospitalization.hedgehog_container_division-1].name;
        });
        containers.forEach(cont => {
          cont.hospitalizations = hospitalizations.filter(i => i.hedgehog_container == cont.id);
        });
      });
    });
  }

  loadContainerDivisions(): void {
    this.bakkenBewerkenService.getContainerDivisions().subscribe(result => this.containerDivisions = result);
  }

  onClickChangeNumberOfContainers(): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationHedgehogContainersEditComponent, {initialState: {numberOfContainers: this.numberOfContainers}});
  }

  onClickEditContainer(container): void {
    this.bsModalRef = this.bsModalService.show(ConfigurationHedgehogContainersHospitalizationsComponent, {initialState: {container: container}});
  }

}
