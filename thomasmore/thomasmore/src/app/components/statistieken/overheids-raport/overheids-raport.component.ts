import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../../../services/excel.service';
import { StatistiekenService } from '../../../services/statistieken.service';
import { Observable } from 'rxjs/Observable';
import { CheckboxRequiredValidator } from '@angular/forms';
import { timeout } from 'q';

@Component({
  selector: 'app-overheids-raport',
  templateUrl: './overheids-raport.component.html',
  styleUrls: ['../statistieken.component.css']
})

export class OverheidsRaportComponent implements OnInit {

  Data: Observable<any[]>;
  filename = '';
  keyNames: any[];
  Exceldata: any;
  ExportCheck = 0;
  extraInfo = true;
  fromDate: any;
  toDate: any;
  verbose: string;
  loader = false;

  constructor(public excelService: ExcelService, private statistiekenService: StatistiekenService) {
  }

  ngOnInit() {
  }

  filterData(data) { // genereer excel
    const Exceldata = [];
    this.verbose = 'Data ophalen!';

    // Redenen van inkomst ordenen
    this.statistiekenService.getEntrance().subscribe(entrance => {
      const temp = {};
      temp['Animal'] = 'Verwijder deze rij!';
      temp['Totaal'] = 'X';
      for (const item of entrance) {
        temp[item.name] = 'Entr';
      }
      Exceldata.push(temp);
    },
      () => { }, // error
      () => { this.ExportCheck++; } // complete
    );

    // Redenen van buitengaan ordenen
    this.statistiekenService.getExit().subscribe(exit => {
      const temp = {};
      temp['Animal'] = 'Verwijder deze rij!';
      temp['Totaal'] = 'X';
      for (const item of exit) {
        temp[item.name] = 'Exit';
      }
      Exceldata.push(temp);
    }, (
    ) => { }, // error
      () => { this.ExportCheck++; } // complete
    );

    // Data vanuit de database sorteren
    this.Data = this.statistiekenService.getForExcel();
    this.Data.subscribe(
      data => {
        if (data.length > 0) {

          this.keyNames = Object.keys(data[0]);

          this.verbose = 'Data sorteren';
          this.loader = true;
          data.sort(function (a, b) {
            // to get a value that is either negative, positive, or zero.
            return b.entrance - a.entrance;
          });

          this.verbose = 'Data omvormen';
          for (const item of data) {
            let key = this.animalExistsCheck(item.animal_name, Exceldata);
            if (typeof this.fromDate == 'undefined' && typeof this.toDate == 'undefined') {
              if (key == null) {
                Exceldata.push({
                  Animal: item.animal_name,
                  Totaal: item.quantity,
                  [item.entrance_name]: 1,
                  [item.exit_name]: 1
                });
              }
              else {
                Exceldata[key].Totaal += item.quantity;
                Exceldata[key][item.entrance_name] = (typeof Exceldata[key][item.entrance_name] == 'undefined' ? 1 : Exceldata[key][item.entrance_name] += 1);
                Exceldata[key][item.exit_name] = (typeof Exceldata[key][item.exit_name] == 'undefined' ? 1 : Exceldata[key][item.exit_name] += 1);
              }
              this.Exceldata = Exceldata;

            } else if (new Date(item.entrance) > this.fromDate && new Date(item.entrance) < this.toDate) {
              if (key == null) {
                Exceldata.push({
                  Animal: item.animal_name,
                  Totaal: item.quantity,
                  [item.entrance_name]: 1,
                  [item.exit_name]: 1
                });
              }
              else {
                Exceldata[key].Totaal += item.quantity;
                Exceldata[key][item.entrance_name] = (typeof Exceldata[key][item.entrance_name] == 'undefined' ? 1 : Exceldata[key][item.entrance_name] += 1);
                Exceldata[key][item.exit_name] = (typeof Exceldata[key][item.exit_name] == 'undefined' ? 1 : Exceldata[key][item.exit_name] += 1);
              }
              this.Exceldata = Exceldata;
            }
          }
          this.Exceldata = Exceldata;
        }
      }, 
      () => { // On error 
      }, 
      () => {  // On Completion 
        this.ExportCheck++;
        if (this.extraInfo) {
          setTimeout(() => {
            this.toExcel(this.Exceldata, this.filename);
          }, 3000);
        } else {
          this.ExportCheck += 2;
          this.toExcel(this.Exceldata, this.filename);
        }
        this.verbose = 'Data omvormen naar excel';
      });
  }

  animalExistsCheck(name, dataArr) {
    for (let item in dataArr) {
      if (dataArr[item].Animal == name) return item;
    } return null;
  }

  // Exporteren naar excel bestand
  toExcel(data, filename) {
     // Controleren of het naam veld is ingevuld
      const excel = this.excelService; // exelService in variabelen zetten voor gebruik in buitenstaande context
      // data.subscribe(function (data) { // Data omzetten naar een leesbare array
      excel.exportAsExcelFile(data, filename); // opsturen naar excelService
      // });
      this.verbose = 'Klaar';
      this.loader = false
  }
}

