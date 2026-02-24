import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should start unauthenticated', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should authenticate any non-empty username', () => {
    service.login('Jeff Pierce', 'any');
    expect(service.currentUser()).not.toBeNull();
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should set initials from username', () => {
    service.login('Jeff Pierce', 'any');
    expect(service.currentUser()?.initials).toBe('JP');
  });

  it('should clear user on logout', () => {
    service.login('Jeff Pierce', 'any');
    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
