import {Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup} from "@angular/router";
import {StatistiekenComponent} from "./components/statistieken/statistieken.component";
import {TaskPlannerComponent} from "./components/task-planner/task-planner.component";
import {OpnameStartschermComponent} from "./components/opname-tablet/opname-startscherm/opname-startscherm.component";
import {OpnameComponent} from "./components/opname-tablet/opname/opname.component";
import {ContactgegevensComponent} from "./components/opname-tablet/contactgegevens/contactgegevens.component";
import {ConfigurationComponent} from "./components/configuration/configuration.component";
import {ConfigurationTasksComponent} from "./components/configuration/configuration-tasks/configuration-tasks.component";
import {ConfigurationTaskCategoriesComponent} from "./components/configuration/configuration-task-categories/configuration-task-categories.component";
import {FichesComponent} from "./components/fiches/fiches/fiches.component";
import {InputWorkerComponent} from "./components/input-worker/input-worker.component";
import {ConfigurationQuarantaineActionComponent} from "./components/configuration/configuration-quarantaine-action/configuration-quarantaine-action.component";
import {WorkerCalendarComponent} from "./components/worker-calendar/worker-calendar.component";
import {EgelsComponent} from "./components/egels/egels.component";
import {ConfigurationHedgehogContainersComponent} from "./components/configuration/configuration-hedgehog-containers/configuration-hedgehog-containers.component";
import {FichesLijstComponent} from "./components/fiches/fiches-lijst/fiches-lijst.component";


export function match(url: string) {
  return function(segments: UrlSegment[],
                  segmentGroup: UrlSegmentGroup,
                  route: Route) {
    const matchSegments = url.split('/');
    if (
      matchSegments.length > segments.length ||
      (matchSegments.length !== segments.length && route.pathMatch === 'full')
    ) {
      return null;
    }

    const consumed: UrlSegment[] = [];
    const posParams: { [name: string]: UrlSegment } = {};
    for (let index = 0; index < matchSegments.length; ++index) {
      const segment = segments[index].toString().toLowerCase();
      const matchSegment = matchSegments[index];

      if (matchSegment.startsWith(':')) {
        posParams[matchSegment.slice(1)] = segments[index];
        consumed.push(segments[index]);
      } else if (segment.toLowerCase() === matchSegment.toLowerCase()) {
        consumed.push(segments[index]);
      } else {
        return null;
      }
    }

    return {consumed, posParams};
  };
}


export function configuratieMatch() { return match('configuratie').apply(this, arguments); }
export function configuratieTaskMatch() { return match('taak').apply(this, arguments); }
export function configuratieTaskCategoryMatch() { return match('taakcategorie').apply(this, arguments); }
export function configuratieQuarantaineActionMatch() { return match('quarantaineaction').apply(this, arguments); }
export function configuratieHedgehogContainerMatch() { return match('hedgehogcontainer').apply(this, arguments); }

export function takenMatch() { return match('taken').apply(this, arguments); }
export function statistiekenMatch() { return match('statistieken').apply(this, arguments); }
export function opnameTabletNieuwMatch() { return match('opnametablet/nieuweopname').apply(this, arguments); }
export function opnameTabletOpnameMatch() { return match('opnametablet/opname').apply(this, arguments); }
export function opnameTabletContactMatch() { return match('opnametablet/contactgegevens').apply(this, arguments); }
export function fichesLijstMatch() { return match('fiches/fichelijst').apply(this, arguments); }

export function fichesMatch() {
  return match('fiches/fiche/:id/:updatemode').apply(this, arguments);
}
export function egelsWegenMatch() { return match('egelswegen').apply(this, arguments); }
export function addWorkerMatch() { return match('addworker').apply(this, arguments); }
export function kalenderMatch() { return match('kalender').apply(this, arguments); }

export const APP_ROUTES: Routes =  [
  // {path: '', redirectTo: '/home', pathMatch: 'full'},
  {matcher: kalenderMatch, component: WorkerCalendarComponent},
  {matcher: configuratieMatch, component: ConfigurationComponent, children: [
      {matcher: configuratieTaskMatch, component: ConfigurationTasksComponent},
      {matcher: configuratieTaskCategoryMatch, component: ConfigurationTaskCategoriesComponent},
      {matcher: configuratieQuarantaineActionMatch, component: ConfigurationQuarantaineActionComponent},
      {matcher: configuratieHedgehogContainerMatch, component: ConfigurationHedgehogContainersComponent}
    ]
  },
  {matcher: takenMatch, component: TaskPlannerComponent},
  {matcher: statistiekenMatch, component: StatistiekenComponent},
  {matcher: opnameTabletNieuwMatch, component: OpnameStartschermComponent},
  {matcher: opnameTabletOpnameMatch, component: OpnameComponent},
  {matcher: opnameTabletContactMatch, component: ContactgegevensComponent},
  {matcher: fichesLijstMatch, component: FichesLijstComponent},
  {matcher: fichesMatch, component: FichesComponent},
  {matcher: egelsWegenMatch, component: EgelsComponent},
  {matcher: addWorkerMatch, component: InputWorkerComponent},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
