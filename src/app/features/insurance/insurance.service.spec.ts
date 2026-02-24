import { TestBed } from '@angular/core/testing';
import { InsuranceService } from './insurance.service';

describe('InsuranceService', () => {
  let service: InsuranceService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(InsuranceService); });

  it('should have mock insurance data', () => {
    expect(service.records().length).toBeGreaterThan(0);
  });

  it('should compute stats correctly', () => {
    const stats = service.stats();
    expect(stats.active).toBeGreaterThanOrEqual(0);
    expect(stats.lapsed).toBeGreaterThanOrEqual(0);
  });

  it('should update status when updateStatus is called', () => {
    service.updateStatus('2', 'Active');
    const updated = service.records().find(i => i.id === '2');
    expect(updated?.status).toBe('Active');
  });
});
