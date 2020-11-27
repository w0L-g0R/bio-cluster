import { TestBed } from '@angular/core/testing';

import { WkoDataService } from './wko-data.service';

describe('WkoDataService', () => {
  let service: WkoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WkoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
