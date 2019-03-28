import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesNazorgComponent } from './fiches-nazorg.component';

describe('FichesNazorgComponent', () => {
  let component: FichesNazorgComponent;
  let fixture: ComponentFixture<FichesNazorgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesNazorgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesNazorgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
