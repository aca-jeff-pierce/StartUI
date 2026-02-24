import { render, screen, fireEvent } from '@testing-library/angular';
import { ShellComponent } from './shell.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { signal } from '@angular/core';

const mockUser = { name: 'Jeff Pierce', role: 'Collections Agent', initials: 'JP', id: '1' };

const createMockAuth = () => ({
  currentUser: signal(mockUser),
  isAuthenticated: signal(true),
  logout: jest.fn(),
});

describe('ShellComponent', () => {
  it('should render all 7 nav items', async () => {
    await render(ShellComponent, {
      providers: [provideRouter([]), { provide: AuthService, useValue: createMockAuth() }],
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Impounds')).toBeInTheDocument();
    expect(screen.getByText('ANT')).toBeInTheDocument();
    expect(screen.getByText('Reinstatement')).toBeInTheDocument();
    expect(screen.getByText('Svc Support')).toBeInTheDocument();
    expect(screen.getByText('Insurance')).toBeInTheDocument();
    expect(screen.getByText('Settlements')).toBeInTheDocument();
  });

  it('should display the logged-in user name', async () => {
    await render(ShellComponent, {
      providers: [provideRouter([]), { provide: AuthService, useValue: createMockAuth() }],
    });
    expect(screen.getAllByText('Jeff Pierce').length).toBeGreaterThan(0);
  });

  it('should hide nav labels when sidebar is collapsed', async () => {
    const { fixture } = await render(ShellComponent, {
      providers: [provideRouter([]), { provide: AuthService, useValue: createMockAuth() }],
    });
    const collapseBtn = screen.getByLabelText(/collapse sidebar/i);
    fireEvent.click(collapseBtn);
    fixture.detectChanges();
    expect(screen.queryByText('Impounds')).not.toBeInTheDocument();
  });

  it('should call auth.logout and navigate on sign out', async () => {
    const mockAuth = createMockAuth();
    await render(ShellComponent, {
      providers: [provideRouter([{ path: 'login', component: ShellComponent }]), { provide: AuthService, useValue: mockAuth }],
    });
    const signOutBtn = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(signOutBtn);
    expect(mockAuth.logout).toHaveBeenCalledTimes(1);
  });
});
