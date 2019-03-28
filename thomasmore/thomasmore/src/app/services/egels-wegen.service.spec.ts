import { TestBed, inject } from '@angular/core/testing';

import { EgelsWegenService } from './egels-wegen.service';

describe('EgelsWegenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EgelsWegenService]
    });
  });

  it('should be created', inject([EgelsWegenService], (service: EgelsWegenService) => {
    expect(service).toBeTruthy();
  }));
});
