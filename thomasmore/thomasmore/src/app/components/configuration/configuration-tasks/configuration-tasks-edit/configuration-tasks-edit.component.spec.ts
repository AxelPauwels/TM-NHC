import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTasksEditComponent } from './configuration-tasks-edit.component';

describe('ConfigurationTasksEditComponent', () => {
  let component: ConfigurationTasksEditComponent;
  let fixture: ComponentFixture<ConfigurationTasksEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTasksEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTasksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
