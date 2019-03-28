import { TestBed, inject } from '@angular/core/testing';

import { Taskv2CategoryService } from './taskv2-category.service';

describe('Taskv2CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Taskv2CategoryService]
    });
  });

  it('should be created', inject([Taskv2CategoryService], (service: Taskv2CategoryService) => {
    expect(service).toBeTruthy();
  }));
});
