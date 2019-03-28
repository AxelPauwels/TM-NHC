import { Component, OnInit } from '@angular/core';
import {WorkerService} from "../../services/worker.service";
import * as moment from 'moment';
import {BsModalRef} from "ngx-bootstrap";
import {IMyDpOptions} from "mydatepicker";

@Component({
  selector: 'app-input-worker',
  templateUrl: './input-worker.component.html',
  styleUrls: ['./input-worker.component.css']
})
export class InputWorkerComponent implements OnInit {

  name: string;
  werkDagen = [];

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };

  constructor(private workerService: WorkerService, public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.werkDagen.push({
    });
  }


  //geeft true terug als de form volledig ingevuld is
  validateForm(){
    if(this.name == '' || this.name == null){
      return false;
    }

    for(let day of this.werkDagen){
      if(day.date == '' || day.date == null){
        return false;
      }

      if(!day.voormiddag && !day.namiddag){
        return false;
      }
    }

    if(this.werkDagen.length <= 0){
      return false;
    }

    return true;
  }

  //knop "dag toevoegen"
  onAddDay(){
    this.werkDagen.push({});
  }

  //knop "dag verwijderen"
  onRemoveDay(){
    this.werkDagen.splice(-1);
  }

  //knop "opslaan"; slaat de gegevens op in de database
  onSubmit(){

    let saveObjects = [];

    //form input omvormen naar worker objects
    for(let werkdag of this.werkDagen){

      console.log(werkdag.date);

      console.log(this.getDateString(werkdag.date));

      if(werkdag.voormiddag){
        saveObjects.push({
          name: this.name,
          start_time: moment(this.getDateString(werkdag.date) + " 08:00").format('YYYY-MM-DDTHH:mm:ss'),
          end_time: moment(this.getDateString(werkdag.date) + " 12:00").format('YYYY-MM-DDTHH:mm:ss')
        });
      }

      if(werkdag.namiddag){
        saveObjects.push({
          name: this.name,
          start_time: moment(this.getDateString(werkdag.date) + " 13:00").format('YYYY-MM-DDTHH:mm:ss'),
          end_time: moment(this.getDateString(werkdag.date) + " 17:00").format('YYYY-MM-DDTHH:mm:ss')
        });
      }

    }

    let numberSaved = 0;

    //workers opslaan in database
    for(let worker of saveObjects){
      this.workerService.insertWorker(worker).subscribe(res => {
        numberSaved++;
        if(numberSaved == saveObjects.length){
          this.bsModalRef.hide();
        }
      });
      console.log(worker);
    }

  }

  //knop "annuleren"
  onCancel(){
    this.bsModalRef.hide();
  }

  getDateString(object: any){
    return object.date.year + '-' + object.date.month + '-' + object.date.day;
  }

}
