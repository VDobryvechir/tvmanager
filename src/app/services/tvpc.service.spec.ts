import { TestBed } from '@angular/core/testing';

import { TvpcService } from './tvpc.service';

describe('TvpcService', () => {
  let service: TvpcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TvpcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
