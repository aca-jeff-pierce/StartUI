import { render, screen, fireEvent } from '@testing-library/angular';
import { SvcSupportComponent } from './svc-support.component';
import { SvcSupportService } from './svc-support.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { signal, computed } from '@angular/core';
import { SvcSupportTicket } from './svc-support.model';

const mockTicket: SvcSupportTicket = {
  id: '1', ticketNumber: 'TKT-4501', accountNumber: 'ACA-881001',
  customerName: 'Barbara Lewis', status: 'Open', category: 'Payment Issue',
  slaBreach: true, assignedTo: 'Jeff P.',
};

const createMockService = () => {
  const _tickets = signal<SvcSupportTicket[]>([mockTicket]);
  return {
    tickets: _tickets.asReadonly(),
    stats: computed(() => ({ open: 1, slaBreach: 1, resolved: 0, escalated: 0 })),
    updateStatus: jest.fn(),
  };
};

const mockFeed = { entries: signal([]), addEntry: jest.fn() };

describe('SvcSupportComponent', () => {
  const renderComponent = (svcOverride?: ReturnType<typeof createMockService>) =>
    render(SvcSupportComponent, {
      providers: [
        { provide: SvcSupportService, useValue: svcOverride ?? createMockService() },
        { provide: ActivityFeedService, useValue: mockFeed },
      ],
    });

  it('should render the section heading', async () => {
    await renderComponent();
    expect(screen.getByText(/svc support/i)).toBeInTheDocument();
  });

  it('should display ticket records in the table', async () => {
    await renderComponent();
    expect(screen.getByText('ACA-881001')).toBeInTheDocument();
    expect(screen.getByText('Barbara Lewis')).toBeInTheDocument();
  });

  it('should open detail panel when a row is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-881001'));
    expect(screen.getByText('Record Detail')).toBeInTheDocument();
  });

  it('should call updateStatus and addEntry when Resolve is clicked', async () => {
    const mockSvc = createMockService();
    await renderComponent(mockSvc);
    fireEvent.click(screen.getByText('ACA-881001'));
    fireEvent.click(screen.getByRole('button', { name: /resolve/i }));
    expect(mockSvc.updateStatus).toHaveBeenCalledWith('1', 'Resolved');
    expect(mockFeed.addEntry).toHaveBeenCalled();
  });
});
