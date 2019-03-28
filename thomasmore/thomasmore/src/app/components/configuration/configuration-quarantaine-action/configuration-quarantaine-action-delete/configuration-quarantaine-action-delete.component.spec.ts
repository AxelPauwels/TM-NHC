import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationQuarantaineActionDeleteComponent } from './configuration-quarantaine-action-delete.component';

describe('ConfigurationQuarantaineActionDeleteComponent', () => {
  let component: ConfigurationQuarantaineActionDeleteComponent;
  let fixture: ComponentFixture<ConfigurationQuarantaineActionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationQuarantaineActionDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationQuarantaineActionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
