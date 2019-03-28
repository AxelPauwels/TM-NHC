import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTaskCategoriesDeleteComponent } from './configuration-task-categories-delete.component';

describe('ConfigurationTaskCategoriesDeleteComponent', () => {
  let component: ConfigurationTaskCategoriesDeleteComponent;
  let fixture: ComponentFixture<ConfigurationTaskCategoriesDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTaskCategoriesDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTaskCategoriesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
