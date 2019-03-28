import { TestBed, inject } from '@angular/core/testing';

import { CageService } from './cage.service';

describe('CageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CageService]
    });
  });

  it('should be created', inject([CageService], (service: CageService) => {
    expect(service).toBeTruthy();
  }));
});
