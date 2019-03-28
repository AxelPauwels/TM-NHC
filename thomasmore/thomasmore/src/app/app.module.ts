import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, ModuleWithProviders, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {StatistiekenModule} from "./modules/statistieken.module";
import {MainMenuComponent} from './components/main/main-menu/main-menu.component';
import {MainComponent} from './components/main/main.component';
import {MainMenuItemComponent} from './components/main/main-menu/main-menu-item/main-menu-item.component';
import {HttpModule} from "@angular/http";
import {EgelsWegenService} from './services/egels-wegen.service';
import {EgelsComponent} from './components/egels/egels.component';
import {TaskPlannerComponent} from './components/task-planner/task-planner.component';
import {TaskPlannerCategoryItemComponent} from './components/task-planner/task-planner-category-item/task-planner-category-item.component';
import {TaskPlannerTaskItemComponent} from './components/task-planner/task-planner-category-item/task-planner-task-item/task-planner-task-item.component';
import {APP_BASE_HREF, CommonModule, registerLocaleData} from '@angular/common';
import localeNlBe from '@angular/common/locales/nl-BE';
import localeNlBeExtra from '@angular/common/locales/extra/nl-BE';
import {TaskplannerService} from './services/taskplanner.service';
import {InputTaskComponent} from "./components/input-task/input-task.component";
import {CageService} from "./services/cage.service";
import {InputTaskService} from "./services/input-task.service";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingModule} from 'ngx-loading';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {nlBeLocale} from 'ngx-bootstrap/locale';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {MyDatePickerModule} from 'mydatepicker';
import {Globals} from "./shared/globals";
import {OpnameModule} from "./components/opname-tablet/opname.module";
import {ConfigurationComponent} from './components/configuration/configuration.component';
import {ConfigurationMenuComponent} from './components/configuration/configuration-menu/configuration-menu.component';
import {ConfigurationMenuItemComponent} from './components/configuration/configuration-menu/configuration-menu-item/configuration-menu-item.component';
import {ConfigurationTaskCategoriesComponent} from './components/configuration/configuration-task-categories/configuration-task-categories.component';
import {ConfigurationTasksComponent} from './components/configuration/configuration-tasks/configuration-tasks.component';
import {Taskv2CategoryService} from "./services/taskv2-category.service";
import {ConfigurationTaskCategoriesEditComponent} from './components/configuration/configuration-task-categories/configuration-task-categories-edit/configuration-task-categories-edit.component';
import {ModalModule, BsModalService} from 'ngx-bootstrap/modal';
import {SelectModule} from 'ng2-select';
import {ConfigurationTaskCategoriesDeleteComponent} from './components/configuration/configuration-task-categories/configuration-task-categories-delete/configuration-task-categories-delete.component';
import {MomentModule} from 'angular2-moment';
import {TaskV2ModelService} from "./services/task-v2-model.service";
import {ConfigurationTasksEditComponent} from './components/configuration/configuration-tasks/configuration-tasks-edit/configuration-tasks-edit.component';
import {RecurModelService} from "./services/recur-model.service";
import * as moment from "moment";
import {BakkenBewerkenService} from './services/bakken-bewerken.service';
import {ChartsModule} from 'ng2-charts';
import {FichesModule} from "./modules/fiches.module";
import {ConfigurationTasksDeleteComponent} from './components/configuration/configuration-tasks/configuration-tasks-delete/configuration-tasks-delete.component';
import {InputWorkerComponent} from "./components/input-worker/input-worker.component";
import {WorkerService} from "./services/worker.service";
import {ConfigurationQuarantaineActionComponent} from './components/configuration/configuration-quarantaine-action/configuration-quarantaine-action.component';
import {QuarantaineActionService} from "./services/quarantaine-action.service";
import {ConfigurationQuarantaineActionEditComponent} from './components/configuration/configuration-quarantaine-action/configuration-quarantaine-action-edit/configuration-quarantaine-action-edit.component';
import {ConfigurationQuarantaineActionDeleteComponent} from './components/configuration/configuration-quarantaine-action/configuration-quarantaine-action-delete/configuration-quarantaine-action-delete.component';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {environment} from "../environments/environment";
import {ConfigurationHedgehogContainersComponent} from './components/configuration/configuration-hedgehog-containers/configuration-hedgehog-containers.component';
import {WorkerCalendarComponent} from './components/worker-calendar/worker-calendar.component';
import {CalendarModule} from 'angular-calendar';
import {ConfigurationHedgehogContainersEditComponent} from './components/configuration/configuration-hedgehog-containers/configuration-hedgehog-containers-edit/configuration-hedgehog-containers-edit.component';
import {ConfigurationHedgehogContainersHospitalizationsComponent} from './components/configuration/configuration-hedgehog-containers/configuration-hedgehog-containers-hospitalizations/configuration-hedgehog-containers-hospitalizations.component';
import {AuthModule} from "./modules/auth/auth.module";
import {routing} from "./app.routing";
import {FichesLijstComponent} from "./components/fiches/fiches-lijst/fiches-lijst.component";
import {FichesCageModalComponent} from "./components/fiches/fiches-cage-modal/fiches-cage-modal.component";
import {FichesLijstModule} from "./modules/fiches-lijst.module";


@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    MainComponent,
    MainMenuItemComponent,
    EgelsComponent,
    InputTaskComponent,
    TaskPlannerComponent,
    TaskPlannerCategoryItemComponent,
    TaskPlannerTaskItemComponent,
    ConfigurationComponent,
    ConfigurationMenuComponent,
    ConfigurationMenuItemComponent,
    ConfigurationTaskCategoriesComponent,
    ConfigurationTasksComponent,
    ConfigurationTaskCategoriesEditComponent,
    ConfigurationTaskCategoriesDeleteComponent,
    ConfigurationTasksEditComponent,
    //TODO:InputVrijwilligerComponent,
    ConfigurationTasksDeleteComponent,
    InputWorkerComponent,
    ConfigurationQuarantaineActionComponent,
    ConfigurationQuarantaineActionEditComponent,
    ConfigurationQuarantaineActionDeleteComponent,
    ConfigurationHedgehogContainersComponent,
    ConfigurationHedgehogContainersEditComponent,
    ConfigurationHedgehogContainersHospitalizationsComponent,
    InputWorkerComponent,
    WorkerCalendarComponent,
    ConfigurationHedgehogContainersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    routing,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    StatistiekenModule,
    PerfectScrollbarModule,
    LoadingModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    MyDatePickerModule,
    OpnameModule,
    FichesModule,
    ModalModule.forRoot(),
    SelectModule,
    MomentModule,
    ChartsModule,
    AuthModule.forRoot(),
    ChartsModule,
    CalendarModule.forRoot(),
    FichesLijstModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: environment.v3Path},
    Globals, {
      provide: LOCALE_ID,
      useValue: 'nl-BE'
    },
    BsModalService,
    TaskplannerService,
    EgelsWegenService,
    CageService,
    InputTaskService,
    Taskv2CategoryService,
    TaskV2ModelService,
    RecurModelService,
    WorkerService,
    QuarantaineActionService,
    BakkenBewerkenService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfigurationTaskCategoriesEditComponent,
    ConfigurationTaskCategoriesDeleteComponent,
    InputTaskComponent,
    InputWorkerComponent,
    ConfigurationTasksEditComponent,
    ConfigurationTasksDeleteComponent,
    ConfigurationQuarantaineActionDeleteComponent,
    ConfigurationQuarantaineActionEditComponent,
    ConfigurationHedgehogContainersEditComponent,
    ConfigurationHedgehogContainersHospitalizationsComponent,
  ]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeNlBe, 'nl-BE', localeNlBeExtra);
    defineLocale('nl-be', nlBeLocale);
    // bsLocaleService.use('nl-be');
    moment.locale('nl-BE');
  }
}
