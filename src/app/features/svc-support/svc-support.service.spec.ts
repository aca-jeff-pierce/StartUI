import { TestBed } from '@angular/core/testing';
import { SvcSupportService } from './svc-support.service';

describe('SvcSupportService', () => {
  let service: SvcSupportService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(SvcSupportService); });

  it('should have mock ticket data', () => {
    expect(service.tickets().length).toBeGreaterThan(0);
  });

  it('should compute stats correctly', () => {
    const stats = service.stats();
    expect(stats.open).toBeGreaterThanOrEqual(0);
    expect(stats.slaBreach).toBeGreaterThanOrEqual(0);
  });

  it('should update status when updateStatus is called', () => {
    service.updateStatus('1', 'Resolved');
    const updated = service.tickets().find(i => i.id === '1');
    expect(updated?.status).toBe('Resolved');
  });
});
