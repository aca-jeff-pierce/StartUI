import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AntService } from './ant.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { AntRequest } from './ant.model';

type FilterChip = 'All' | 'My Queue' | 'Pending' | 'Expired';

@Component({
  selector: 'app-ant',
  imports: [StatCardComponent, StatusBadgeComponent],
  templateUrl: './ant.component.html',
  styleUrl: './ant.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AntComponent {
  private readonly svc = inject(AntService);
  private readonly feedSvc = inject(ActivityFeedService);

  protected readonly stats = this.svc.stats;
  protected readonly activeFilter = signal<FilterChip>('All');
  protected readonly selectedRecord = signal<AntRequest | null>(null);
  protected readonly chips: readonly FilterChip[] = ['All', 'My Queue', 'Pending', 'Expired'];

  protected readonly filteredRequests = computed(() => {
    const filter = this.activeFilter();
    return this.svc.requests().filter(i => {
      switch (filter) {
        case 'My Queue': return i.assignedTo === 'Jeff P.';
        case 'Pending':  return i.status === 'Pending';
        case 'Expired':  return i.status === 'Expired';
        default:         return true;
      }
    });
  });

  protected selectRecord(record: AntRequest): void {
    this.selectedRecord.set(record);
  }

  protected closePanel(): void {
    this.selectedRecord.set(null);
  }

  protected approve(record: AntRequest): void {
    this.svc.updateStatus(record.id, 'Approved');
    this.feedSvc.addEntry({ section: 'ANT', action: 'Request approved', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected deny(record: AntRequest): void {
    this.svc.updateStatus(record.id, 'Denied');
    this.feedSvc.addEntry({ section: 'ANT', action: 'Request denied', accountNumber: record.accountNumber });
    this.closePanel();
  }
}
