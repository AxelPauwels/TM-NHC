import { TestBed, inject } from '@angular/core/testing';

import { RecurModelService } from './recur-model.service';

describe('RecurModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecurModelService]
    });
  });

  it('should be created', inject([RecurModelService], (service: RecurModelService) => {
    expect(service).toBeTruthy();
  }));
});
