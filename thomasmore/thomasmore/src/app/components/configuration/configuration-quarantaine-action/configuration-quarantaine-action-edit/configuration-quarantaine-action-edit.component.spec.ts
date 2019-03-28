import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationQuarantaineActionEditComponent } from './configuration-quarantaine-action-edit.component';

describe('ConfigurationQuarantaineActionEditComponent', () => {
  let component: ConfigurationQuarantaineActionEditComponent;
  let fixture: ComponentFixture<ConfigurationQuarantaineActionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationQuarantaineActionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationQuarantaineActionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
