import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesNavigatieComponent } from './fiches-navigatie.component';

describe('FichesNavigatieComponent', () => {
  let component: FichesNavigatieComponent;
  let fixture: ComponentFixture<FichesNavigatieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesNavigatieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesNavigatieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
