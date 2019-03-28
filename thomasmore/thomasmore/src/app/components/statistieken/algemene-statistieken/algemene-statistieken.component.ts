import { Component, OnInit } from '@angular/core';
import { StatistiekenService } from "../../../services/statistieken.service";
import { getLocaleDateTimeFormat } from '@angular/common';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

@Component({
  selector: 'app-algemene-statistieken',
  templateUrl: './algemene-statistieken.component.html',
  styleUrls: ['../statistieken.component.css']
})

export class AlgemeneStatistiekenComponent implements OnInit {

  showChart1: boolean = false;
  nowDate: any = new Date();

  //Eerste chart
  barChartLabels = [];
  barChartData = [
    { data: [], label: 'aantal' },
  ];
  barChartOptions: any = {
    responsive: true
  };
  barChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  barChartLegend: boolean = true;
  barChartType: string = 'bar';

  constructor(private statistiekenService: StatistiekenService) {
  }

  ngOnInit() {
    // TODO: database function schrijven voor data in een periode op te halen
    // Eerste grafiek data ophalen.
    this.statistiekenService.getHospitalization().subscribe(data => {
      this.barChartLabels = [];
      this.barChartData[0].data = [];

      for (let item of data) {
        let d = new Date(item.entrance);
        d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

        if (new Date(item.entrance).getFullYear() === new Date().getFullYear()
        && new Date(item.entrance).getMonth() >= new Date().getMonth() -1 ) {
          this.barChartLabels.push(d.toLocaleDateString());
          this.barChartData[0].data.push(item.quantity);
        }
      }
    },
      () => { }, // error
      () => { this.showChart1 = true; } // complete
    );

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}