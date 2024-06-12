import { TestBed } from '@angular/core/testing';

import { UserChartsService } from './user-charts.service';

describe('UserChartsService', () => {
  let service: UserChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
