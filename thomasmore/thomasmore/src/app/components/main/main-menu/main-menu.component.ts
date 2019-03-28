import { Component, OnInit } from '@angular/core';
import {Globals} from "../../../shared/globals";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(private globals: Globals) { }

  menuActions: any[] = [
    {
      title: 'Voederbord',
      image: 14,
      url: ''
    },
    {
      title: 'Quarantaine',
      image: 3,
      url: 'walls/quarantaine'
    },
    {
      title: 'Voedselresten',
      image: 15,
      url: 'leftover'
    },
    {
      title: 'Klaarmaken',
      image: 2,
      url: 'walls/preparation'
    },
    {
      title: 'Adoptie',
      image: 13,
      url: 'fiches/adoption'
    },
    {
      title: 'Opname',
      image: 18,
      url: 'opname'
    },
    {
      title: 'Egels wegen',
      image: 17,
      routerLink: 'egelswegen'
    },
    {
      title: 'Fiches',
      image: 5,
      routerLink: '/fiches/fichelijst'
    },
    {
      title: 'Fiches (Achter)',
      image: 5,
      url: 'fiches/recover_list'
    },
    {
      title: 'Fiches (IC)',
      image: 5,
      url: 'fiches/ic_list'
    },
    {
      title: 'Fiches (Archief)',
      image: 5,
      url: 'fiches/end_list'
    },
    {
      title: 'Fiche-overzicht',
      image: 5,
      url: 'fiches/overview_report'
    },
    {
      title: 'Taken',
      image: 8,
      routerLink: '/taken'
    },
    {
      title: 'Kalender Vrijwilligers',
      image: 23,
      routerLink: '/kalender'
    },
    {
      title: 'Wegwijs',
      image: 7,
      url: 'directions'
    },
    {
      title: 'Systeembeheer',
      image: 11,
      routerLink: '/configuratie'
    },
    {
      title: 'Statistieken',
      image: 24,
      routerLink: '/statistieken'
    }
  ];

  ngOnInit() {
  }

  clickAction(action: any): void  {
    if (action.url != undefined) {
      window.location.href = `${this.globals.baseUrl}/#/${action.url}`;
    }
  }

}
