import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { InsuranceService } from './insurance.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { InsuranceRecord } from './insurance.model';

type FilterChip = 'All' | 'My Queue' | 'Lapsed' | 'CPI Applied';

@Component({
  selector: 'app-insurance',
  imports: [StatCardComponent, StatusBadgeComponent],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceComponent {
  private readonly svc = inject(InsuranceService);
  private readonly feedSvc = inject(ActivityFeedService);

  protected readonly stats = this.svc.stats;
  protected readonly activeFilter = signal<FilterChip>('All');
  protected readonly selectedRecord = signal<InsuranceRecord | null>(null);
  protected readonly chips: readonly FilterChip[] = ['All', 'My Queue', 'Lapsed', 'CPI Applied'];

  protected readonly filteredRecords = computed(() => {
    const filter = this.activeFilter();
    return this.svc.records().filter(i => {
      switch (filter) {
        case 'My Queue':   return i.assignedTo === 'Jeff P.';
        case 'Lapsed':     return i.status === 'Lapsed';
        case 'CPI Applied': return i.status === 'CPI Applied';
        default:           return true;
      }
    });
  });

  protected selectRecord(record: InsuranceRecord): void {
    this.selectedRecord.set(record);
  }

  protected closePanel(): void {
    this.selectedRecord.set(null);
  }

  protected clearLapse(record: InsuranceRecord): void {
    this.svc.updateStatus(record.id, 'Active');
    this.feedSvc.addEntry({ section: 'Insurance', action: 'Insurance lapse cleared', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected applyCpi(record: InsuranceRecord): void {
    this.svc.applyCpi(record.id);
    this.feedSvc.addEntry({ section: 'Insurance', action: 'CPI applied', accountNumber: record.accountNumber });
    this.closePanel();
  }

  protected flagLapse(record: InsuranceRecord): void {
    this.svc.updateStatus(record.id, 'Lapsed');
    this.feedSvc.addEntry({ section: 'Insurance', action: 'Insurance lapse flagged', accountNumber: record.accountNumber });
    this.closePanel();
  }
}
