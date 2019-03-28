import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthComponent} from "../../components/auth/auth.component";
import {AuthService} from "./services/auth.service";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AuthRequestService} from "./services/auth-request.service";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AuthComponent
  ],
  providers: [],
  entryComponents: [
    AuthComponent
  ]
})
export class AuthModule {
  static forRoot() {
    return {
      ngModule: AuthModule,
      providers: [ AuthService, AuthRequestService ]
    }
  }


}
