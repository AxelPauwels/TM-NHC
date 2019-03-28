import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlannerCategoryItemComponent } from './task-planner-category-item.component';

describe('TaskPlannerCategoryItemComponent', () => {
  let component: TaskPlannerCategoryItemComponent;
  let fixture: ComponentFixture<TaskPlannerCategoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPlannerCategoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPlannerCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
