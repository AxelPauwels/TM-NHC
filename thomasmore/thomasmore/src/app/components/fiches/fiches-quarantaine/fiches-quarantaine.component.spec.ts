import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesQuarantaineComponent } from './fiches-quarantaine.component';

describe('FichesQuarantaineComponent', () => {
  let component: FichesQuarantaineComponent;
  let fixture: ComponentFixture<FichesQuarantaineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesQuarantaineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesQuarantaineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
