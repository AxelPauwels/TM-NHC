import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationQuarantaineActionComponent } from './configuration-quarantaine-action.component';

describe('ConfigurationQuarantaineActionComponent', () => {
  let component: ConfigurationQuarantaineActionComponent;
  let fixture: ComponentFixture<ConfigurationQuarantaineActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationQuarantaineActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationQuarantaineActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
