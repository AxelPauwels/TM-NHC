import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-configuration-menu-item',
  templateUrl: './configuration-menu-item.component.html',
  styleUrls: ['./configuration-menu-item.component.css']
})
export class ConfigurationMenuItemComponent implements OnInit {

  constructor() { }

  @Input()
  category: any;

  ngOnInit() {
  }

  onClickRoute(): void {
    if(this.category.routeType == 2)
      return;
    window.location.href = this.category.route;
  }

}
