import { TestBed, inject } from '@angular/core/testing';

import { BakkenBewerkenService } from './bakken-bewerken.service';

describe('BakkenBewerkenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BakkenBewerkenService]
    });
  });

  it('should be created', inject([BakkenBewerkenService], (service: BakkenBewerkenService) => {
    expect(service).toBeTruthy();
  }));
});
