import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FichesAlgemeenModalComponent} from "./fiches-algemeen-modal.component";

describe('FichesAlgemeenModalComponent', () => {
  let component: FichesAlgemeenModalComponent;
  let fixture: ComponentFixture<FichesAlgemeenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FichesAlgemeenModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesAlgemeenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
