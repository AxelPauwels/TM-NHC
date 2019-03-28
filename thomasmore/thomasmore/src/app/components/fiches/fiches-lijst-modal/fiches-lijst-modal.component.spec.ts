import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FichesLijstModalComponent} from "./fiches-lijst-modal.component";

describe('FichesLijstModalComponent', () => {
  let component: FichesLijstModalComponent;
  let fixture: ComponentFixture<FichesLijstModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesLijstModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesLijstModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
