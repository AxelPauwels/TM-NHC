import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationMenuItemComponent } from './configuration-menu-item.component';

describe('ConfigurationMenuItemComponent', () => {
  let component: ConfigurationMenuItemComponent;
  let fixture: ComponentFixture<ConfigurationMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
