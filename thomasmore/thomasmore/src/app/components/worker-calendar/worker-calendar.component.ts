import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as moment from 'moment';
import {WorkerService} from "../../services/worker.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {InputWorkerComponent} from "../input-worker/input-worker.component";
import {CalendarEvent} from 'angular-calendar';


@Component({
  selector: 'app-worker-calendar',
  templateUrl: './worker-calendar.component.html',
  styleUrls: ['./worker-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkerCalendarComponent implements OnInit {

  bsModalRef: BsModalRef;

  viewDate: Date;
  activeDayIsOpen: boolean;
  selectedDay: any;
  dayEnabled: boolean;
  events = [];
  dateString: string;

  constructor(private workerService: WorkerService, private bsModalService: BsModalService) {
  }

  ngOnInit() {
    this.viewDate = new Date();
    this.activeDayIsOpen = true;
    this.dayEnabled = false;
    this.setDateString();

    this.bsModalService.onHide.subscribe(this.closeModal.bind(this));
  }

  //event voor het aanklikken van een dag
  dayClicked(e) {
    this.viewDate = e.date;
    this.selectedDay = e.date;
    let dateString = moment(this.selectedDay).format('YYYY-MM-DD');
    this.getWorkers(dateString);
  }

  //van dagoverzicht terug naar maandoverzicht
  backClick() {
    this.dayEnabled = false;
    this.setDateString();
  }

  //events aanmaken voor op het dagoverzicht
  setEvents(workers) {
    this.events = [];

    for (let i = 0; i < workers.length; i++) {

      let color;
      color = {
        primary: '#5b3a11',
        secondary: '#b57423'
      };

      let event = {
        id: workers[i].id,
        title: workers[i].name,
        start: moment(workers[i].start_time).toDate(),
        end: moment(workers[i].end_time).toDate(),
        color: color,
        actions: [
          {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
              this.deleteItem(event);
            }
          }]
      };

      this.events.push(event);
    }


  }

  //buttons voor switchen van maanden
  previousClick() {
    if (this.dayEnabled) {
      this.viewDate = moment(this.viewDate).add(-1, 'day').toDate();
      this.selectedDay = this.viewDate;
      let dateString = moment(this.viewDate).format('YYYY-MM-DD');
      this.getWorkers(dateString);
      console.log(dateString);

    } else {
      this.viewDate = moment(this.viewDate).add(-1, 'month').toDate();
    }
    this.setDateString();
  }

  //volgende maand
  nextClick() {
    if (this.dayEnabled) {
      this.viewDate = moment(this.viewDate).add(1, 'day').toDate();
      this.selectedDay = this.viewDate;
      let dateString = moment(this.viewDate).format('YYYY-MM-DD');
      this.getWorkers(dateString);
      console.log(dateString);
    } else {
      this.viewDate = moment(this.viewDate).add(1, 'month').toDate();
    }
    this.setDateString();
  }

  //vandaag
  todayClick() {
    this.viewDate = new Date();
    this.selectedDay = new Date();
    this.setDateString();

    if(this.dayEnabled){
      let dateString = moment(this.viewDate).format('YYYY-MM-DD');
      this.getWorkers(dateString);
      console.log(dateString);

    }
  }

  //ophalen workers
  getWorkers(dateString) {
    this.workerService.getWorkersByDate(dateString).subscribe(
      (workers: Worker[]) => {
        this.setEvents(workers);
        this.changeView();
      }
    );
  }

  //modal openen voor toevoegen workers
  addWorkerClick() {
    this.bsModalRef = this.bsModalService.show(InputWorkerComponent, {});
  }


  setDateString() {
    console.log('setDateString');
    let currentDateString = '';
    console.log(this.dayEnabled);

    if (this.dayEnabled) {
      console.log("dayEnabled");
      currentDateString = moment(this.viewDate).format('DD/MM/YYYY');
    } else {
      currentDateString = moment(this.viewDate).format('MMMM YYYY');
    }

    this.dateString = currentDateString;

  }

  //switchen tussen dag- en maandview
  changeView() {
    this.dayEnabled = true;
    this.setDateString();
  }

  closeModal(): void {

  }

  //delete van worker
  deleteItem(event) {
    if (confirm("ben je zeker dat je deze werkuren wilt verwijderen?")) {
      this.workerService.removeWorker(event.id).subscribe(res => {
          let dateString = moment(this.viewDate).format('YYYY-MM-DD');
          this.getWorkers(dateString);
        }
      );
    }
  }

}
