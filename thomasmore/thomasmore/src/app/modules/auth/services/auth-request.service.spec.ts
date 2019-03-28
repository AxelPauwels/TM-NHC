import { TestBed, inject } from '@angular/core/testing';

import { AuthRequestService } from './auth-request.service';

describe('AuthRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthRequestService]
    });
  });

  it('should be created', inject([AuthRequestService], (service: AuthRequestService) => {
    expect(service).toBeTruthy();
  }));
});
