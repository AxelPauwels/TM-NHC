import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesOverzichtComponent } from './fiches-overzicht.component';

describe('FichesOverzichtComponent', () => {
  let component: FichesOverzichtComponent;
  let fixture: ComponentFixture<FichesOverzichtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesOverzichtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesOverzichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
