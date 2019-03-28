import { TestBed, inject } from '@angular/core/testing';

import { InputTaskService } from './input-task.service';

describe('InputTaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputTaskService]
    });
  });

  it('should be created', inject([InputTaskService], (service: InputTaskService) => {
    expect(service).toBeTruthy();
  }));
});
