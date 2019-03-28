import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {FichesLijstService} from "../../../services/fiches-lijst.service";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {FichesSession} from "../../../shared/fiches-session";
import {FichesLijstModalComponent} from "../fiches-lijst-modal/fiches-lijst-modal.component";

@Component({
  selector: 'app-fiches-lijst',
  templateUrl: './fiches-lijst.component.html',
  styleUrls: ['./fiches-lijst.component.css']
})
export class FichesLijstComponent implements OnInit {
  Data: Observable<any[]>;
  keyNames: any[];

  DataArray;
  FilteredArray;
  sortDescending: boolean = true;
  searchTerm: string = "";
  bsModalRef: BsModalRef;


  constructor(private fichesLijstService: FichesLijstService, private router: Router, private bsModalService: BsModalService, private fichesSession: FichesSession) {
  }

  ngOnInit() {
    //Ophalen van data uit de database backend -> opnameTabletService
    this.Data = this.fichesLijstService.getHospitalizations();
    this.Data.subscribe(result => {
      if (result.length >= 0)
        this.keyNames = Object.keys(result[0]);
      this.DataArray = result;
      this.FilteredArray = result;
    });
  }

  rowClicked(id, quantity) {
    this.fichesSession.navigateToFichesHospitalizationId = id;
    if (quantity > 1) {
      this.fichesSession.algemeenModalHeader = "Fiches: single & groep";
      this.fichesSession.algemeenModalText = "Dit dier behoort tot een groep van andere dieren toen ze zijn binnengebracht.\n\n" +
        "Wil je dit één dier aanpassen, \n\n of wil je alle dieren van deze groep aanpassen?";
      this.bsModalRef = this.bsModalService.show(FichesLijstModalComponent, {});
    } else {
      this.router.navigate(['./fiches/fiche/' + id + '/single']);
    }
  }

  headerClicked(sortMethod) {
    if (this.sortDescending) {
      this.DataArray = this.DataArray.sort(this.dynamicSort("-" + sortMethod));
      this.sortDescending = false;
    } else {
      this.DataArray = this.DataArray.sort(this.dynamicSort(sortMethod));
      this.sortDescending = true;
    }
  }

  dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  findIfContains(obj) {
    return obj.name.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  onSearchChange() {
    this.DataArray = this.FilteredArray.filter(this.findIfContains.bind(this));
  }
}
