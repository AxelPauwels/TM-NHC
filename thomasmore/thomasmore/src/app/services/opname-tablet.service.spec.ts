import { TestBed, inject } from '@angular/core/testing';

import { OpnameTabletService } from './opname-tablet.service';

describe('OpnameTabletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpnameTabletService]
    });
  });

  it('should be created', inject([OpnameTabletService], (service: OpnameTabletService) => {
    expect(service).toBeTruthy();
  }));
});
