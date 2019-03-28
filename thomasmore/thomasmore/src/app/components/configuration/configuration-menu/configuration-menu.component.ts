import { Component, OnInit } from '@angular/core';
import {Globals} from "../../../shared/globals";
import {AuthRequestService} from "../../../modules/auth/services/auth-request.service";

@Component({
  selector: 'app-configuration-menu',
  templateUrl: './configuration-menu.component.html',
  styleUrls: ['./configuration-menu.component.css']
})
export class ConfigurationMenuComponent implements OnInit {

  constructor(private globals: Globals, private authRequestService: AuthRequestService) { }

  baseRoutes: string[] = [this.globals.baseUrl + '/#/', this.globals.baseUrl + '/#/config/', ''];

  menuItems: any[] = [];
  menuData: any[] = [
    ['Fiches', 'fiche', 1],
    ['Opname', 'opname', 0],
    ['Opname redenen', 'entrance_reason', 1],
    ['Vertrek redenen', 'exit_reason', 1],
    ['Diersoorten', 'animal', 1],
    ['Menu\'s', 'menu', 1],
    ['Voeder-producten', 'food', 1],
    ['Eenheidsmaten', 'measure', 1],
    ['Bereidingscategorieën', 'prepare_category', 1],
    ['Kooien', 'cage', 1],
    ['Routes', 'route', 1],
    ['Instellingen', 'preferences', 1],
    // New routes
    ['Herhalende taken', 'taak', 2],
    ['Taakcategorieën', 'taakcategorie', 2],
    ['Quarantaine handelingen', 'quarantaineaction', 2],
    ['Egelbakken', 'hedgehogcontainer', 2]
  ];

  ngOnInit() {
    this.menuData.forEach(menuItem => this.addItem(menuItem[0], menuItem[1], menuItem[2]));
  }

  addItem(title: string, route: string, routeType: number): void {
    this.menuItems.push({
      title: title,
      route: this.baseRoutes[routeType] + route,
      routeType: routeType
    });
  }

}
