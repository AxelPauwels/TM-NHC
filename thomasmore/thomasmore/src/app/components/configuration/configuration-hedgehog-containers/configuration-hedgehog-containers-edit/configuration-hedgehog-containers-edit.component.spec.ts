import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationHedgehogContainersEditComponent } from './configuration-hedgehog-containers-edit.component';

describe('ConfigurationHedgehogContainersEditComponent', () => {
  let component: ConfigurationHedgehogContainersEditComponent;
  let fixture: ComponentFixture<ConfigurationHedgehogContainersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationHedgehogContainersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationHedgehogContainersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
