import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ImpoundsService } from './impounds.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { Impound } from './impound.model';

type FilterChip = 'All' | 'My Queue' | 'Critical' | 'Pending';

@Component({
  selector: 'app-impounds',
  imports: [StatCardComponent, StatusBadgeComponent],
  templateUrl: './impounds.component.html',
  styleUrl: './impounds.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpoundsComponent {
  private readonly svc = inject(ImpoundsService);
  private readonly feedSvc = inject(ActivityFeedService);

  protected readonly stats = this.svc.stats;
  protected readonly activeFilter = signal<FilterChip>('All');
  protected readonly selectedRecord = signal<Impound | null>(null);
  protected readonly chips: readonly FilterChip[] = ['All', 'My Queue', 'Critical', 'Pending'];

  protected readonly filteredImpounds = computed(() => {
    const filter = this.activeFilter();
    return this.svc.impounds().filter(i => {
      switch (filter) {
        case 'My Queue':  return i.assignedTo === 'Jeff P.';
        case 'Critical':  return i.status === 'Critical' || i.status === 'Escalated';
        case 'Pending':   return i.status === 'Pending';
        default:          return true;
      }
    });
  });

  protected selectRecord(record: Impound): void {
    this.selectedRecord.set(record);
  }

  protected closePanel(): void {
    this.selectedRecord.set(null);
  }

  protected release(record: Impound): void {
    this.svc.updateStatus(record.id, 'Released');
    this.feedSvc.addEntry({ section: 'Impounds', action: 'Impound released', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected escalate(record: Impound): void {
    this.svc.updateStatus(record.id, 'Escalated');
    this.feedSvc.addEntry({ section: 'Impounds', action: 'Impound escalated', accountNumber: record.accountNumber });
    this.closePanel();
  }
}
