import { TestBed, inject } from '@angular/core/testing';

import { TaskplannerService } from './taskplanner.service';

describe('TaskplannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskplannerService]
    });
  });

  it('should be created', inject([TaskplannerService], (service: TaskplannerService) => {
    expect(service).toBeTruthy();
  }));
});
