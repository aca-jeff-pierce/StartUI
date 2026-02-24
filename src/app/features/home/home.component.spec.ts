import { render, screen } from '@testing-library/angular';
import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { signal } from '@angular/core';
import { ActivityEntry } from '../../core/services/activity.model';

const mockAuth = {
  currentUser: signal({ name: 'Jeff Pierce', role: 'Collections Agent', initials: 'JP', id: '1' }),
  isAuthenticated: signal(true),
};

const mockFeedEntry: ActivityEntry = {
  id: '1',
  section: 'Impounds',
  action: 'Impound released',
  accountNumber: 'ACA-889231',
  timestamp: new Date(Date.now() - 120_000),
};

const mockFeed = {
  entries: signal([mockFeedEntry]),
  addEntry: jest.fn(),
};

describe('HomeComponent', () => {
  const renderComponent = () =>
    render(HomeComponent, {
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuth },
        { provide: ActivityFeedService, useValue: mockFeed },
      ],
    });

  it('should render all 6 section tiles', async () => {
    await renderComponent();
    expect(screen.getByText('Impounds')).toBeInTheDocument();
    expect(screen.getByText('ANT')).toBeInTheDocument();
    expect(screen.getByText('Reinstatement')).toBeInTheDocument();
    expect(screen.getByText('Svc Support')).toBeInTheDocument();
    expect(screen.getByText('Insurance')).toBeInTheDocument();
    expect(screen.getByText('Settlements')).toBeInTheDocument();
  });

  it('should display the logged-in agent name in the greeting', async () => {
    await renderComponent();
    expect(screen.getByText(/jeff pierce/i)).toBeInTheDocument();
  });

  it('should display activity feed entries', async () => {
    await renderComponent();
    expect(screen.getByText('ACA-889231')).toBeInTheDocument();
  });
});
