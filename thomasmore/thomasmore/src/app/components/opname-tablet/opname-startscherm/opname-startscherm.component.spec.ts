import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {OpnameStartschermComponent} from "./opname-startscherm.component";


describe('OpnameTabletComponent', () => {
  let component: OpnameStartschermComponent;
  let fixture: ComponentFixture<OpnameStartschermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpnameStartschermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpnameStartschermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
