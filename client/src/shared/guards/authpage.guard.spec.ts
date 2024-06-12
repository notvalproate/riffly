import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authpageGuard } from './authpage.guard';

describe('authpageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authpageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
