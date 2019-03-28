import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StatistiekenComponent} from "../components/statistieken/statistieken.component";
import {ExcelService} from "../services/excel.service";
import {OverheidsRaportComponent} from "../components/statistieken/overheids-raport/overheids-raport.component";
import {AlgemeneStatistiekenComponent} from "../components/statistieken/algemene-statistieken/algemene-statistieken.component";
import {StatistiekenService} from '../services/statistieken.service';
import {RouterModule} from "@angular/router";
import { BsDatepickerModule } from "ngx-bootstrap";
import { ChartsModule } from "ng2-charts";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [StatistiekenComponent,
    OverheidsRaportComponent,
    AlgemeneStatistiekenComponent,
  ],
  providers: [ExcelService, StatistiekenService],
  exports: []
})
export class StatistiekenModule {
}
