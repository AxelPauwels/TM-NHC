import { TestBed, inject } from '@angular/core/testing';

import { StatistiekenService } from './statistieken.service';

describe('StatistiekenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatistiekenService]
    });
  });

  it('should be created', inject([StatistiekenService], (service: StatistiekenService) => {
    expect(service).toBeTruthy();
  }));
});
