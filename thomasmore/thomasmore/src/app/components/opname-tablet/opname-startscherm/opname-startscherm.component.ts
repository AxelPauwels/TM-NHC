import {Component, OnInit} from '@angular/core';
import {OpnameTabletService} from "../../../services/opname-tablet.service";
import {Router} from "@angular/router";
import {OpnameTabletSession} from "../../../shared/opname-tablet-session";

@Component({
  selector: 'app-opname-startscherm',
  templateUrl: './opname-startscherm.component.html',
  styleUrls: ['./opname-startscherm.component.css']
})

export class OpnameStartschermComponent implements OnInit {
  opnameNummer: number;

  constructor(private opnameTabletService: OpnameTabletService, private router: Router, private opnameTabletSession: OpnameTabletSession) {
  }

  ngOnInit() {
    this.opnameTabletService.getFicheLastId().subscribe(
      (array: any) => {
        this.opnameNummer = array[0].id + 1;
        this.opnameTabletSession.opnameNummer = this.opnameNummer;
        this.opnameTabletSession.nieuweOpname = true;
      }
    );
  }

  onClick_opnameStarten() {
    this.router.navigateByUrl('opnameTablet/opname');
  }

}
