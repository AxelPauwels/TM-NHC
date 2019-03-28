import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMedischComponent } from './fiches-medisch.component';

describe('FichesMedischComponent', () => {
  let component: FichesMedischComponent;
  let fixture: ComponentFixture<FichesMedischComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMedischComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMedischComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
