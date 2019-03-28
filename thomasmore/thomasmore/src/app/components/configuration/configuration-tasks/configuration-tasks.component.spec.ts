import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTasksComponent } from './configuration-tasks.component';

describe('ConfigurationTasksComponent', () => {
  let component: ConfigurationTasksComponent;
  let fixture: ComponentFixture<ConfigurationTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
