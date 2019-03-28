import { TestBed, inject } from '@angular/core/testing';

import { TaskV2ModelService } from './task-v2-model.service';

describe('TaskV2ModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskV2ModelService]
    });
  });

  it('should be created', inject([TaskV2ModelService], (service: TaskV2ModelService) => {
    expect(service).toBeTruthy();
  }));
});
