import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-test',
  templateUrl: './statistieken.component.html',
  styleUrls: ['./statistieken.component.css']
})


export class StatistiekenComponent implements OnInit {

  currentTab: String; //Bijhouden welke subcomponent te openen

  //Alle submenu items van statistieken, bij aanmaken van een knop hier een toevoegen
  tabs: any[] = [
    {
      id: 1,
      title: 'Overheids Raport',
    },
    {
      id: 2,
      title: 'Algemene Statistieken',
    },
  ];

  constructor() {
  }

  ngOnInit() { //Todo: Current Tab instellen!
    this.currentTab = '2';
  }

  //Bij het kliken op een knop verander je welke component je moet laden
  setTab(tabId : String){
    this.currentTab = tabId;
  }

}

