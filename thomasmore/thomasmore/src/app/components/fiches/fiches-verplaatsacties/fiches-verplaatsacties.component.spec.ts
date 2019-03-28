import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesVerplaatsactiesComponent } from './fiches-verplaatsacties.component';

describe('FichesVerplaatsactiesComponent', () => {
  let component: FichesVerplaatsactiesComponent;
  let fixture: ComponentFixture<FichesVerplaatsactiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesVerplaatsactiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesVerplaatsactiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
