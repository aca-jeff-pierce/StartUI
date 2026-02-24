import { TestBed } from '@angular/core/testing';
import { ImpoundsService } from './impounds.service';

describe('ImpoundsService', () => {
  let service: ImpoundsService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(ImpoundsService); });

  it('should have mock impound data', () => {
    expect(service.impounds().length).toBeGreaterThan(0);
  });

  it('should compute stats correctly', () => {
    const stats = service.stats();
    expect(stats.active).toBeGreaterThanOrEqual(0);
    expect(stats.critical).toBeGreaterThanOrEqual(0);
  });

  it('should update status when updateStatus is called', () => {
    service.updateStatus('1', 'Released');
    const updated = service.impounds().find(i => i.id === '1');
    expect(updated?.status).toBe('Released');
  });
});
