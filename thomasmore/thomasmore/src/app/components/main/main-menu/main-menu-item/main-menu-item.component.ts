import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-menu-item',
  templateUrl: './main-menu-item.component.html',
  styleUrls: ['./main-menu-item.component.css']
})
export class MainMenuItemComponent implements OnInit {

  constructor() {
  }

  @Input() action: any;

  ngOnInit() {
  }

}
