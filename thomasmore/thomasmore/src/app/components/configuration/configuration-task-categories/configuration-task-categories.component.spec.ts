import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTaskCategoriesComponent } from './configuration-task-categories.component';

describe('ConfigurationTaskCategoriesComponent', () => {
  let component: ConfigurationTaskCategoriesComponent;
  let fixture: ComponentFixture<ConfigurationTaskCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTaskCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTaskCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
