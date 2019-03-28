import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesCageModalComponent } from './fiches-cage-modal.component';

describe('FichesCageModalComponent', () => {
  let component: FichesCageModalComponent;
  let fixture: ComponentFixture<FichesCageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesCageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesCageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
