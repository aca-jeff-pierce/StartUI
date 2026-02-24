import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SettlementsService } from './settlements.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { Settlement } from './settlements.model';

type FilterChip = 'All' | 'My Queue' | 'Counter Offers' | 'Accepted';

@Component({
  selector: 'app-settlements',
  imports: [StatCardComponent, StatusBadgeComponent, DecimalPipe],
  templateUrl: './settlements.component.html',
  styleUrl: './settlements.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettlementsComponent {
  private readonly svc = inject(SettlementsService);
  private readonly feedSvc = inject(ActivityFeedService);

  protected readonly stats = this.svc.stats;
  protected readonly activeFilter = signal<FilterChip>('All');
  protected readonly selectedRecord = signal<Settlement | null>(null);
  protected readonly chips: readonly FilterChip[] = ['All', 'My Queue', 'Counter Offers', 'Accepted'];

  protected readonly filteredSettlements = computed(() => {
    const filter = this.activeFilter();
    return this.svc.settlements().filter(i => {
      switch (filter) {
        case 'My Queue':       return i.assignedTo === 'Jeff P.';
        case 'Counter Offers': return i.status === 'Counter Offer';
        case 'Accepted':       return i.status === 'Accepted';
        default:               return true;
      }
    });
  });

  protected selectRecord(record: Settlement): void {
    this.selectedRecord.set(record);
  }

  protected closePanel(): void {
    this.selectedRecord.set(null);
  }

  protected accept(record: Settlement): void {
    this.svc.updateStatus(record.id, 'Accepted');
    this.feedSvc.addEntry({ section: 'Settlements', action: 'Settlement offer accepted', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected void_(record: Settlement): void {
    this.svc.updateStatus(record.id, 'Voided');
    this.feedSvc.addEntry({ section: 'Settlements', action: 'Settlement voided', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected counterOffer(record: Settlement): void {
    this.svc.updateStatus(record.id, 'Counter Offer');
    this.feedSvc.addEntry({ section: 'Settlements', action: 'Counter offer submitted', accountNumber: record.accountNumber });
    this.closePanel();
  }
}
