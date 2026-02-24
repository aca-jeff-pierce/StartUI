import { render, screen, fireEvent } from '@testing-library/angular';
import { SettlementsComponent } from './settlements.component';
import { SettlementsService } from './settlements.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { signal, computed } from '@angular/core';
import { Settlement } from './settlements.model';

const mockSettlement: Settlement = {
  id: '1', accountNumber: 'ACA-991001', customerName: 'Carolyn Rivera',
  status: 'Offer Out', offerAmount: 5200.00, balanceOwed: 8750.00,
  expirationDate: '2026-03-15', assignedTo: 'Jeff P.',
};

const createMockService = () => {
  const _settlements = signal<Settlement[]>([mockSettlement]);
  return {
    settlements: _settlements.asReadonly(),
    stats: computed(() => ({ offersOut: 1, counterOffers: 0, accepted: 0, expired: 0 })),
    updateStatus: jest.fn(),
  };
};

const mockFeed = { entries: signal([]), addEntry: jest.fn() };

describe('SettlementsComponent', () => {
  const renderComponent = (svcOverride?: ReturnType<typeof createMockService>) =>
    render(SettlementsComponent, {
      providers: [
        { provide: SettlementsService, useValue: svcOverride ?? createMockService() },
        { provide: ActivityFeedService, useValue: mockFeed },
      ],
    });

  it('should render the section heading', async () => {
    await renderComponent();
    expect(screen.getByText(/settlements/i)).toBeInTheDocument();
  });

  it('should display settlement records in the table', async () => {
    await renderComponent();
    expect(screen.getByText('ACA-991001')).toBeInTheDocument();
    expect(screen.getByText('Carolyn Rivera')).toBeInTheDocument();
  });

  it('should open detail panel when a row is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-991001'));
    expect(screen.getByText('Record Detail')).toBeInTheDocument();
  });

  it('should call updateStatus and addEntry when Accept Offer is clicked', async () => {
    const mockSvc = createMockService();
    await renderComponent(mockSvc);
    fireEvent.click(screen.getByText('ACA-991001'));
    fireEvent.click(screen.getByRole('button', { name: /accept offer/i }));
    expect(mockSvc.updateStatus).toHaveBeenCalledWith('1', 'Accepted');
    expect(mockFeed.addEntry).toHaveBeenCalled();
  });
});
