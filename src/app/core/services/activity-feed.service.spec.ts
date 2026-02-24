import { TestBed } from '@angular/core/testing';
import { ActivityFeedService } from './activity-feed.service';

describe('ActivityFeedService', () => {
  let service: ActivityFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityFeedService);
  });

  it('should start with mock activity entries', () => {
    expect(service.entries().length).toBeGreaterThan(0);
  });

  it('should prepend new entries on addEntry', () => {
    const initial = service.entries().length;
    service.addEntry({ section: 'Impounds', action: 'Released', accountNumber: 'ACA-001' });
    expect(service.entries().length).toBe(initial + 1);
    expect(service.entries()[0].action).toBe('Released');
  });

  it('should cap entries at 50', () => {
    for (let i = 0; i < 55; i++) {
      service.addEntry({ section: 'Test', action: `Action ${i}`, accountNumber: `ACA-${i}` });
    }
    expect(service.entries().length).toBeLessThanOrEqual(50);
  });

  it('should assign a unique id and current timestamp to new entries', () => {
    const before = Date.now();
    service.addEntry({ section: 'Settlements', action: 'Offer accepted', accountNumber: 'ACA-999' });
    const entry = service.entries()[0];
    expect(entry.id).toBeTruthy();
    expect(entry.timestamp.getTime()).toBeGreaterThanOrEqual(before);
  });
});
