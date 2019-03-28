import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HedgehogContainer} from '../../models/hedgehog-container';
import {EgelsWegenService} from '../../services/egels-wegen.service';
import {FormControl, FormGroup} from '@angular/forms';
import Chart from "frappe-charts/dist/frappe-charts.min.esm"

@Component({
  selector: 'app-egels',
  templateUrl: './egels.component.html',
  styleUrls: ['./egels.component.css']
})
export class EgelsComponent implements OnInit {

  today: any;
  ws;
  weight: any;
  containers: HedgehogContainer;

  selectedContainerInfo = [];
  selectedHedgeHog = null;

  showHedgeHogInfo: boolean = false;
  showLocationPicker: boolean = false;
  showChart: boolean = false;

  weightArray: any;


  lineChartLabels = [];
  lineChartData = [
    {data: [], label: 'gewicht'},
  ];
  lineChartOptions: any = {
    responsive: true
  };
  lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  lineChartLegend: boolean = true;
  lineChartType: string = 'line';

  constructor(private egelsWegenService: EgelsWegenService) {
  }

  ngOnInit() {
    this.wsInit();
    this.getContainers();

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  wsInit() {
    this.ws = new WebSocket("ws://192.168.1.200:8080/socket");

    this.ws.onmessage = function (evt) {
      let data = JSON.parse(evt.data);
      if (data.kind == "weight") {
        this.weight = data.data;
      }
      if (data.kind == "save") {
        console.log("save");
        this.saveWeight();
      }
      if (data.kind == "remove") {
        this.showChart = false;
        this.egelsWegenService.removeWeight(this.weightArray[this.weightArray.length - 1].id).subscribe(result => {
          this.getAllWeightsOfHedgeHog();
          this.ws.send('{"success": null}');
        }, error => {
          this.ws.send('{"fail": null}');
          this.showChart = true;
        });
      }
    }.bind(this);

    this.ws.onerror = function (error) {
      console.log("Websocket error ", error);
    }
  }

  getContainers() {
    this.egelsWegenService.getOccupiedContainers().subscribe(data => {
      this.containers = data;
    });
  }

  changeContainerNumber(event) {
    this.selectedContainerInfo = [];
    this.showChart = false;
    this.showLocationPicker = false;

    let selectedContainer = event.target.value;

    //Indien de container is gesplitst worden hier de 2 splitsingen in een array gezet
    this.egelsWegenService.getHedgehogContainersWithRelationsByContainerNumber(selectedContainer).subscribe(data => {

      this.selectedContainerInfo = data;
      console.log(this.selectedContainerInfo);

      if (this.selectedContainerInfo.length >= 2) {
        console.log("Container is gesplitst");
        this.showLocationPicker = true;
        this.showHedgeHogInfo = false;
      }
      else {
        console.log("Container is niet gesplitst");
        this.selectedHedgeHog = this.selectedContainerInfo[0];
        this.showLocationPicker = false;
        this.showHedgeHogInfo = true;
        console.log("selected hedgehog ", this.selectedHedgeHog);
        this.getAllWeightsOfHedgeHog();
      }
    });
  }

  changeLocation(event) {
    this.showChart = false;
    this.selectedHedgeHog = this.selectedContainerInfo.find(i => i.name == event.target.value);
    this.showHedgeHogInfo = true;
    console.log("selected hedgehog ", this.selectedHedgeHog);

    this.getAllWeightsOfHedgeHog();
  }

  saveWeight() {
    this.showChart = false;
    this.today = new Date().getUTCFullYear() + '-' + new Date().getUTCMonth() + 1 + '-' + new Date().getUTCDate();
    let data = {"hospitalization": this.selectedHedgeHog.hospitalization, "grams": this.weight, "date": this.today};

    //TODO: gewichten worden opnieuw opgeroepen voor data is weggeschreven
    this.egelsWegenService.saveWeight(data).subscribe(result => {
      this.getAllWeightsOfHedgeHog();
      this.ws.send('{"success": null}');
    }, error => {
      this.ws.send('{"fail": null}');
      this.showGraph();

    });

  }

  //NOT USED RIGHT NOW
  Calibrate() {
    this.ws.send('{"calibrate": 1001}');
  }

  Tare() {
    this.ws.send('{"tare": null}')
  }

  getAllWeightsOfHedgeHog() {
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];

    this.egelsWegenService.getAllWeightsOfHedgeHog(this.selectedHedgeHog.hospitalization).subscribe(
      data => {
        this.weightArray = data;
        console.log("weight", data);

        for (let i of this.weightArray) {
          let d = new Date(i.date);
          d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
          i.date = d.toLocaleDateString();

          this.lineChartLabels.push(i.date);
          this.lineChartData[0].data.push(i.grams);

          this.showGraph();
        }
      }
    );
  }

  showGraph() {
    this.showChart = true;
  }

  removeWeight(id) {
    if (confirm("Bent u zeker?")) {
      this.egelsWegenService.removeWeight(id).subscribe(result => {
        this.getAllWeightsOfHedgeHog();
      });
    }
  }
}
