import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {BrowserModule} from "@angular/platform-browser";
import {FichesService} from "../services/fiches.service";
import {FichesComponent} from "../components/fiches/fiches/fiches.component";
import {FichesSession} from "../shared/fiches-session";
import {MyDatePickerModule} from "mydatepicker";
import {BsModalRef} from "ngx-bootstrap";
import {FichesNazorgComponent} from "../components/fiches/fiches-nazorg/fiches-nazorg.component";
import {FichesMedischComponent} from "../components/fiches/fiches-medisch/fiches-medisch.component";
import {FichesQuarantaineComponent} from "../components/fiches/fiches-quarantaine/fiches-quarantaine.component";
import {FichesOverzichtComponent} from "../components/fiches/fiches-overzicht/fiches-overzicht.component";
import {FichesCageModalComponent} from "../components/fiches/fiches-cage-modal/fiches-cage-modal.component";
import {FichesNavigatieComponent} from "../components/fiches/fiches-navigatie/fiches-navigatie.component";
import {FichesVerplaatsactiesComponent} from "../components/fiches/fiches-verplaatsacties/fiches-verplaatsacties.component";
import {routing} from "../app.routing";
import {FichesLijstService} from "../services/fiches-lijst.service";
import {FichesAlgemeenModalComponent} from "../components/fiches/fiches-algemeen-modal/fiches-algemeen-modal.component";

@NgModule({
  declarations: [
    FichesComponent,
    FichesOverzichtComponent,
    FichesNazorgComponent,
    FichesMedischComponent,
    FichesQuarantaineComponent,
    FichesCageModalComponent,
    FichesAlgemeenModalComponent,
    FichesNavigatieComponent,
    FichesVerplaatsactiesComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserModule,
    HttpClientModule,
    PerfectScrollbarModule,
    MyDatePickerModule,
    routing
  ],
  entryComponents: [
    FichesCageModalComponent,
    FichesAlgemeenModalComponent
  ],
  providers: [
    FichesService,
    FichesSession,
    FichesLijstService,
    BsModalRef
  ],
  exports: []
})
export class FichesModule {
}
