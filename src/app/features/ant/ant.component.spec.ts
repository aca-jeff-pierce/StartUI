import { render, screen, fireEvent } from '@testing-library/angular';
import { AntComponent } from './ant.component';
import { AntService } from './ant.service';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { signal, computed } from '@angular/core';
import { AntRequest } from './ant.model';

const mockRequest: AntRequest = {
  id: '1', accountNumber: 'ACA-112233', customerName: 'Robert Brown',
  status: 'Pending', requestType: 'Deferral', requestDate: '2026-02-20', assignedTo: 'Jeff P.',
};

const createMockService = () => {
  const _requests = signal<AntRequest[]>([mockRequest]);
  return {
    requests: _requests.asReadonly(),
    stats: computed(() => ({ pending: 1, approved: 0, denied: 0, expired: 0 })),
    updateStatus: jest.fn(),
  };
};

const mockFeed = { entries: signal([]), addEntry: jest.fn() };

describe('AntComponent', () => {
  const renderComponent = (svcOverride?: ReturnType<typeof createMockService>) =>
    render(AntComponent, {
      providers: [
        { provide: AntService, useValue: svcOverride ?? createMockService() },
        { provide: ActivityFeedService, useValue: mockFeed },
      ],
    });

  it('should render the section heading', async () => {
    await renderComponent();
    expect(screen.getByText(/ant/i)).toBeInTheDocument();
  });

  it('should display ANT request records in the table', async () => {
    await renderComponent();
    expect(screen.getByText('ACA-112233')).toBeInTheDocument();
    expect(screen.getByText('Robert Brown')).toBeInTheDocument();
  });

  it('should open detail panel when a row is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('ACA-112233'));
    expect(screen.getByText('Record Detail')).toBeInTheDocument();
  });

  it('should call updateStatus and addEntry when Approve is clicked', async () => {
    const mockSvc = createMockService();
    await renderComponent(mockSvc);
    fireEvent.click(screen.getByText('ACA-112233'));
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));
    expect(mockSvc.updateStatus).toHaveBeenCalledWith('1', 'Approved');
    expect(mockFeed.addEntry).toHaveBeenCalled();
  });
});
