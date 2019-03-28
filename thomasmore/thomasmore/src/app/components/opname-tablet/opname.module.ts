import {NgModule} from '@angular/core';
import {OpnameStartschermComponent} from "./opname-startscherm/opname-startscherm.component";
import {OpnameTabletService} from "../../services/opname-tablet.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyDatePickerModule} from "mydatepicker";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {OpnameComponent} from "./opname/opname.component";
import {ContactgegevensComponent} from "./contactgegevens/contactgegevens.component";
import {OpnameTabletSession} from "../../shared/opname-tablet-session";

@NgModule({
  declarations: [
    OpnameStartschermComponent,
    OpnameComponent,
    ContactgegevensComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserModule,
    HttpClientModule,
    PerfectScrollbarModule,
    MyDatePickerModule
  ],
  providers: [OpnameTabletService,OpnameTabletSession]
})
export class OpnameModule {

}
