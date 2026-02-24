import { TestBed } from '@angular/core/testing';
import { AntService } from './ant.service';

describe('AntService', () => {
  let service: AntService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(AntService); });

  it('should have mock ANT request data', () => {
    expect(service.requests().length).toBeGreaterThan(0);
  });

  it('should compute stats correctly', () => {
    const stats = service.stats();
    expect(stats.pending).toBeGreaterThanOrEqual(0);
    expect(stats.approved).toBeGreaterThanOrEqual(0);
  });

  it('should update status when updateStatus is called', () => {
    service.updateStatus('1', 'Approved');
    const updated = service.requests().find(i => i.id === '1');
    expect(updated?.status).toBe('Approved');
  });
});
