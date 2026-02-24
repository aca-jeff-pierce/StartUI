import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SvcSupportService } from './svc-support.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { SvcSupportTicket } from './svc-support.model';

type FilterChip = 'All' | 'My Queue' | 'SLA Breach' | 'Escalated';

@Component({
  selector: 'app-svc-support',
  imports: [StatCardComponent, StatusBadgeComponent],
  templateUrl: './svc-support.component.html',
  styleUrl: './svc-support.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvcSupportComponent {
  private readonly svc = inject(SvcSupportService);
  private readonly feedSvc = inject(ActivityFeedService);

  protected readonly stats = this.svc.stats;
  protected readonly activeFilter = signal<FilterChip>('All');
  protected readonly selectedRecord = signal<SvcSupportTicket | null>(null);
  protected readonly chips: readonly FilterChip[] = ['All', 'My Queue', 'SLA Breach', 'Escalated'];

  protected readonly filteredTickets = computed(() => {
    const filter = this.activeFilter();
    return this.svc.tickets().filter(i => {
      switch (filter) {
        case 'My Queue':   return i.assignedTo === 'Jeff P.';
        case 'SLA Breach': return i.slaBreach === true;
        case 'Escalated':  return i.status === 'Escalated';
        default:           return true;
      }
    });
  });

  protected selectRecord(record: SvcSupportTicket): void {
    this.selectedRecord.set(record);
  }

  protected closePanel(): void {
    this.selectedRecord.set(null);
  }

  protected resolve(record: SvcSupportTicket): void {
    this.svc.updateStatus(record.id, 'Resolved');
    this.feedSvc.addEntry({ section: 'Svc Support', action: 'Ticket resolved', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected escalate(record: SvcSupportTicket): void {
    this.svc.updateStatus(record.id, 'Escalated');
    this.feedSvc.addEntry({ section: 'Svc Support', action: 'Ticket escalated', accountNumber: record.accountNumber });
    this.closePanel();
  }
}
