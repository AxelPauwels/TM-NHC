import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTaskCategoriesEditComponent } from './configuration-task-categories-edit.component';

describe('ConfigurationTaskCategoriesEditComponent', () => {
  let component: ConfigurationTaskCategoriesEditComponent;
  let fixture: ComponentFixture<ConfigurationTaskCategoriesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTaskCategoriesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTaskCategoriesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
