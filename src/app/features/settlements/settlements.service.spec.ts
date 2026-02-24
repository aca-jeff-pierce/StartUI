import { TestBed } from '@angular/core/testing';
import { SettlementsService } from './settlements.service';

describe('SettlementsService', () => {
  let service: SettlementsService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(SettlementsService); });

  it('should have mock settlement data', () => {
    expect(service.settlements().length).toBeGreaterThan(0);
  });

  it('should compute stats correctly', () => {
    const stats = service.stats();
    expect(stats.offersOut).toBeGreaterThanOrEqual(0);
    expect(stats.counterOffers).toBeGreaterThanOrEqual(0);
  });

  it('should update status when updateStatus is called', () => {
    service.updateStatus('1', 'Accepted');
    const updated = service.settlements().find(i => i.id === '1');
    expect(updated?.status).toBe('Accepted');
  });
});
