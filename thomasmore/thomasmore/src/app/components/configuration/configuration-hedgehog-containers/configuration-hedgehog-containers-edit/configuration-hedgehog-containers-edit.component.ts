import { Component, OnInit } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {BakkenBewerkenService} from "../../../../services/bakken-bewerken.service";

@Component({
  selector: 'app-configuration-hedgehog-containers-edit',
  templateUrl: './configuration-hedgehog-containers-edit.component.html',
  styleUrls: ['./configuration-hedgehog-containers-edit.component.css']
})
export class ConfigurationHedgehogContainersEditComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private bakkenBewerkenService: BakkenBewerkenService) { }

  numberOfContainers: number;
  newNumberOfContainers: number;
  changedNumber: boolean = false;

  ngOnInit() {
  }

  onSaveNumberOfContainers(): void {
    console.log(`Old #: ${this.numberOfContainers}; New #: ${this.newNumberOfContainers}`);
    this.bakkenBewerkenService.saveNewNumberOfContainers(this.newNumberOfContainers).subscribe(result => {
      this.changedNumber = true;
      this.bsModalRef.hide();
    });
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }

  isValid(): boolean {
    return this.newNumberOfContainers != null && this.newNumberOfContainers > 0;
  }

}
