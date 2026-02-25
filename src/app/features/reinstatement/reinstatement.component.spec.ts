import { render, screen, fireEvent } from '@testing-library/angular';
import { ReinstatementComponent } from './reinstatement.component';
import { ReinstatementService } from './reinstatement.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { signal, computed } from '@angular/core';
import { Reinstatement } from './reinstatement.model';

const mockRecord: Reinstatement = {
  id: '1', accountNumber: 'ACA-771001', customerName: 'Patricia Adams',
  policyType: 'Auto', agentName: 'Susan B.',
  status: 'Open', quoteAmount: 2450.00,
  requestDate: '2026-01-10', lapseDate: '2025-12-15',
  dueDate: '2026-03-01', assignedTo: 'Jeff P.',
};

const createMockService = () => {
  const _reinstatements = signal<Reinstatement[]>([mockRecord]);
  return {
    reinstatements: _reinstatements.asReadonly(),
    stats: computed(() => ({ open: 1, pending: 0, completed: 0, declined: 0 })),
    updateStatus: jest.fn(),
  };
};

const mockFeed = { entries: signal([]), addEntry: jest.fn() };

describe('ReinstatementComponent', () => {
  const renderComponent = (svcOverride?: ReturnType<typeof createMockService>) =>
    render(ReinstatementComponent, {
      providers: [
        { provide: ReinstatementService, useValue: svcOverride ?? createMockService() },
        { provide: ActivityFeedService, useValue: mockFeed },
      ],
    });

  it('should render the section heading', async () => {
    await renderComponent();
    expect(screen.getByText(/reinstatement/i)).toBeInTheDocument();
  });

  it('should display reinstatement records in the table', async () => {
    await renderComponent();
    expect(screen.getByText('ACA-771001')).toBeInTheDocument();
    expect(screen.getByText('Patricia Adams')).toBeInTheDocument();
  });

  it('should open detail panel when a row is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-771001'));
    expect(screen.getByText('Record Detail')).toBeInTheDocument();
  });

  it('should display group labels in the detail panel', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-771001'));
    expect(screen.getByText('Policy Information')).toBeInTheDocument();
    expect(screen.getByText('Reinstatement Details')).toBeInTheDocument();
  });

  it('should display new fields in the detail panel', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-771001'));
    expect(screen.getByText('Auto')).toBeInTheDocument();
    expect(screen.getByText('Susan B.')).toBeInTheDocument();
    expect(screen.getByText('2026-01-10')).toBeInTheDocument();
    expect(screen.getByText('2025-12-15')).toBeInTheDocument();
  });

  it('should call updateStatus and addEntry when Approve is clicked', async () => {
    const mockSvc = createMockService();
    await renderComponent(mockSvc);
    fireEvent.click(screen.getByText('ACA-771001'));
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));
    expect(mockSvc.updateStatus).toHaveBeenCalledWith('1', 'Completed');
    expect(mockFeed.addEntry).toHaveBeenCalled();
  });
});
