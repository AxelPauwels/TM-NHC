import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OpnameComponent} from "./opname.component";


describe('OpnameComponent', () => {
  let component: OpnameComponent;
  let fixture: ComponentFixture<OpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpnameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
