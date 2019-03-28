import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTasksDeleteComponent } from './configuration-tasks-delete.component';

describe('ConfigurationTasksDeleteComponent', () => {
  let component: ConfigurationTasksDeleteComponent;
  let fixture: ComponentFixture<ConfigurationTasksDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTasksDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTasksDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
