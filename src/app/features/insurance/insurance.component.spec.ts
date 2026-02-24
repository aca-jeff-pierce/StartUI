import { render, screen, fireEvent } from '@testing-library/angular';
import { InsuranceComponent } from './insurance.component';
import { InsuranceService } from './insurance.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { signal, computed } from '@angular/core';
import { InsuranceRecord } from './insurance.model';

const mockRecord: InsuranceRecord = {
  id: '2', accountNumber: 'ACA-552002', customerName: 'Raymond Carter',
  status: 'Lapsed', insuranceProvider: 'GEICO', expirationDate: '2026-01-01',
  cpiApplied: false, assignedTo: 'Jeff P.',
};

const createMockService = () => {
  const _records = signal<InsuranceRecord[]>([mockRecord]);
  return {
    records: _records.asReadonly(),
    stats: computed(() => ({ active: 0, lapsed: 1, cpiApplied: 0, pending: 0 })),
    updateStatus: jest.fn(),
    applyCpi: jest.fn(),
  };
};

const mockFeed = { entries: signal([]), addEntry: jest.fn() };

describe('InsuranceComponent', () => {
  const renderComponent = (svcOverride?: ReturnType<typeof createMockService>) =>
    render(InsuranceComponent, {
      providers: [
        { provide: InsuranceService, useValue: svcOverride ?? createMockService() },
        { provide: ActivityFeedService, useValue: mockFeed },
      ],
    });

  it('should render the section heading', async () => {
    await renderComponent();
    expect(screen.getByText(/insurance/i)).toBeInTheDocument();
  });

  it('should display insurance records in the table', async () => {
    await renderComponent();
    expect(screen.getByText('ACA-552002')).toBeInTheDocument();
    expect(screen.getByText('Raymond Carter')).toBeInTheDocument();
  });

  it('should open detail panel when a row is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-552002'));
    expect(screen.getByText('Record Detail')).toBeInTheDocument();
  });

  it('should call updateStatus and addEntry when Clear Lapse is clicked', async () => {
    const mockSvc = createMockService();
    await renderComponent(mockSvc);
    fireEvent.click(screen.getByText('ACA-552002'));
    fireEvent.click(screen.getByRole('button', { name: /clear lapse/i }));
    expect(mockSvc.updateStatus).toHaveBeenCalledWith('2', 'Active');
    expect(mockFeed.addEntry).toHaveBeenCalled();
  });
});
