import { render, screen, fireEvent } from '@testing-library/angular';
import { ImpoundsComponent } from './impounds.component';
import { ImpoundsService } from './impounds.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { signal, computed } from '@angular/core';
import { Impound } from './impound.model';

const mockImpound: Impound = {
  id: '1', accountNumber: 'ACA-889231', customerName: 'Marcus Johnson',
  status: 'Active', location: 'Atlanta, GA', daysInImpound: 5, assignedTo: 'Jeff P.',
};

const createMockService = () => {
  const _impounds = signal<Impound[]>([mockImpound]);
  return {
    impounds: _impounds.asReadonly(),
    stats: computed(() => ({ active: 1, released: 0, pending: 0, critical: 0 })),
    updateStatus: jest.fn(),
  };
};

const mockFeed = { entries: signal([]), addEntry: jest.fn() };

describe('ImpoundsComponent', () => {
  const renderComponent = (svcOverride?: ReturnType<typeof createMockService>) =>
    render(ImpoundsComponent, {
      providers: [
        { provide: ImpoundsService, useValue: svcOverride ?? createMockService() },
        { provide: ActivityFeedService, useValue: mockFeed },
      ],
    });

  it('should render the section heading', async () => {
    await renderComponent();
    expect(screen.getByText(/impounds/i)).toBeInTheDocument();
  });

  it('should display impound records in the table', async () => {
    await renderComponent();
    expect(screen.getByText('ACA-889231')).toBeInTheDocument();
    expect(screen.getByText('Marcus Johnson')).toBeInTheDocument();
  });

  it('should open detail panel when a row is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-889231'));
    expect(screen.getByText('Record Detail')).toBeInTheDocument();
  });

  it('should call updateStatus and addEntry when Release is clicked', async () => {
    const mockSvc = createMockService();
    await renderComponent(mockSvc);
    fireEvent.click(screen.getByText('ACA-889231'));
    fireEvent.click(screen.getByRole('button', { name: /release impound/i }));
    expect(mockSvc.updateStatus).toHaveBeenCalledWith('1', 'Released');
    expect(mockFeed.addEntry).toHaveBeenCalled();
  });
});
