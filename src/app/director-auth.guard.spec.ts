import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { directorAuthGuard } from './director-auth.guard';

describe('directorAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => directorAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
