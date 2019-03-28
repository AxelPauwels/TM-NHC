import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FichesLijstComponent} from "../components/fiches/fiches-lijst/fiches-lijst.component";
import {FichesLijstService} from "../services/fiches-lijst.service";
import {FichesLijstModalComponent} from "../components/fiches/fiches-lijst-modal/fiches-lijst-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    FichesLijstComponent,
    FichesLijstModalComponent
  ],
  entryComponents: [
    FichesLijstModalComponent
  ],
  providers: [FichesLijstService],
  exports: []
})
export class FichesLijstModule {
}
