import { APP_ROUTES } from './app.routes';
import { authGuard } from './core/auth/auth.guard';

describe('app routes', () => {
  it('should define a login route', () => {
    const loginRoute = APP_ROUTES.find(r => r.path === 'login');
    expect(loginRoute).toBeDefined();
  });

  it('should define an authenticated shell route with children', () => {
    const shellRoute = APP_ROUTES.find(r => r.path === '');
    expect(shellRoute).toBeDefined();
    expect(shellRoute?.children?.length).toBe(7); // home + 6 sections
    expect(shellRoute?.canActivate).toContain(authGuard);
  });
});
