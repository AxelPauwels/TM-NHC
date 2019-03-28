import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ContactgegevensComponent} from "./contactgegevens.component";


describe('OpnameComponent', () => {
  let component: ContactgegevensComponent;
  let fixture: ComponentFixture<ContactgegevensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactgegevensComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgegevensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
