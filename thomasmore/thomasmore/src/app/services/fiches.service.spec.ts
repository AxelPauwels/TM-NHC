import { TestBed, inject } from '@angular/core/testing';

import { FichesService } from './fiches.service';

describe('FichesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FichesService]
    });
  });

  it('should be created', inject([FichesService], (service: FichesService) => {
    expect(service).toBeTruthy();
  }));
});
