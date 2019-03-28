import { TestBed, inject } from '@angular/core/testing';

import { QuarantaineActionService } from './quarantaine-action.service';

describe('QuarantaineActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuarantaineActionService]
    });
  });

  it('should be created', inject([QuarantaineActionService], (service: QuarantaineActionService) => {
    expect(service).toBeTruthy();
  }));
});
