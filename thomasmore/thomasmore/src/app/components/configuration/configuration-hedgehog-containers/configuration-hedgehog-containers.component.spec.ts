import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationHedgehogContainersComponent } from './configuration-hedgehog-containers.component';

describe('ConfigurationHedgehogContainersComponent', () => {
  let component: ConfigurationHedgehogContainersComponent;
  let fixture: ComponentFixture<ConfigurationHedgehogContainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationHedgehogContainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationHedgehogContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
