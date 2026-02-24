import { render, screen, fireEvent } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  it('should render the login form with username and password fields', async () => {
    await render(LoginComponent, { providers: [provideRouter([])] });
    expect(screen.getByLabelText(/username/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  });
});
