import { TestBed } from '@angular/core/testing';
import { ReinstatementService } from './reinstatement.service';

describe('ReinstatementService', () => {
  let service: ReinstatementService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(ReinstatementService); });

  it('should have mock reinstatement data', () => {
    expect(service.reinstatements().length).toBeGreaterThan(0);
  });

  it('should compute stats correctly', () => {
    const stats = service.stats();
    expect(stats.open).toBeGreaterThanOrEqual(0);
    expect(stats.pending).toBeGreaterThanOrEqual(0);
  });

  it('should update status when updateStatus is called', () => {
    service.updateStatus('1', 'Completed');
    const updated = service.reinstatements().find(i => i.id === '1');
    expect(updated?.status).toBe('Completed');
  });
});
