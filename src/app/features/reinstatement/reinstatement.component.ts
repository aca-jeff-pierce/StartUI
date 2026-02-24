import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReinstatementService } from './reinstatement.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { Reinstatement } from './reinstatement.model';

type FilterChip = 'All' | 'My Queue' | 'Pending' | 'Open';

@Component({
  selector: 'app-reinstatement',
  imports: [StatCardComponent, StatusBadgeComponent, DecimalPipe],
  templateUrl: './reinstatement.component.html',
  styleUrl: './reinstatement.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReinstatementComponent {
  private readonly svc = inject(ReinstatementService);
  private readonly feedSvc = inject(ActivityFeedService);

  protected readonly stats = this.svc.stats;
  protected readonly activeFilter = signal<FilterChip>('All');
  protected readonly selectedRecord = signal<Reinstatement | null>(null);
  protected readonly chips: readonly FilterChip[] = ['All', 'My Queue', 'Pending', 'Open'];

  protected readonly filteredReinstatements = computed(() => {
    const filter = this.activeFilter();
    return this.svc.reinstatements().filter(i => {
      switch (filter) {
        case 'My Queue': return i.assignedTo === 'Jeff P.';
        case 'Pending':  return i.status === 'Pending';
        case 'Open':     return i.status === 'Open';
        default:         return true;
      }
    });
  });

  protected selectRecord(record: Reinstatement): void {
    this.selectedRecord.set(record);
  }

  protected closePanel(): void {
    this.selectedRecord.set(null);
  }

  protected approve(record: Reinstatement): void {
    this.svc.updateStatus(record.id, 'Completed');
    this.feedSvc.addEntry({ section: 'Reinstatement', action: 'Reinstatement approved', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected decline(record: Reinstatement): void {
    this.svc.updateStatus(record.id, 'Declined');
    this.feedSvc.addEntry({ section: 'Reinstatement', action: 'Reinstatement declined', accountNumber: record.accountNumber });
    this.closePanel();
  }
}
