import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlannerTaskItemComponent } from './task-planner-task-item.component';

describe('TaskPlannerTaskItemComponent', () => {
  let component: TaskPlannerTaskItemComponent;
  let fixture: ComponentFixture<TaskPlannerTaskItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPlannerTaskItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPlannerTaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
