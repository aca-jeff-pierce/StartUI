import { render, screen } from '@testing-library/angular';
import { ShellComponent } from './shell.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '../auth/auth.service';

const mockAuth = {
  currentUser: () => ({ name: 'Jeff Pierce', role: 'Collections Agent', initials: 'JP', id: '1' }),
  isAuthenticated: () => true,
  logout: jest.fn(),
};

describe('ShellComponent', () => {
  it('should render all 7 nav items', async () => {
    await render(ShellComponent, {
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuth },
      ],
    });
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Impounds')).toBeTruthy();
    expect(screen.getByText('Settlements')).toBeTruthy();
  });

  it('should display the logged-in user name', async () => {
    await render(ShellComponent, {
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuth },
      ],
    });
    expect(screen.getByText('Jeff Pierce')).toBeTruthy();
  });
});
