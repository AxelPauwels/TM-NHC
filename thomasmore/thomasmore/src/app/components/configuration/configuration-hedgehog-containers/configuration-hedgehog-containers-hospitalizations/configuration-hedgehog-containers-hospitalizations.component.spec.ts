import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationHedgehogContainersHospitalizationsComponent } from './configuration-hedgehog-containers-hospitalizations.component';

describe('ConfigurationHedgehogContainersHospitalizationsComponent', () => {
  let component: ConfigurationHedgehogContainersHospitalizationsComponent;
  let fixture: ComponentFixture<ConfigurationHedgehogContainersHospitalizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationHedgehogContainersHospitalizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationHedgehogContainersHospitalizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
