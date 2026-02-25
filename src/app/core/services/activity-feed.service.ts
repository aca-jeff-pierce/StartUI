import { Injectable, signal } from '@angular/core';
import { ActivityEntry } from './activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityFeedService {
  private readonly _entries = signal<ActivityEntry[]>([
    {
      id: '1',
      section: 'Impounds',
      action: 'Impound released',
      accountNumber: 'ACA-889231',
      timestamp: new Date(Date.now() - 2 * 60_000),
    },
    {
      id: '2',
      section: 'Settlements',
      action: 'Settlement offer accepted',
      accountNumber: 'ACA-77102',
      timestamp: new Date(Date.now() - 14 * 60_000),
    },
    {
      id: '3',
      section: 'Insurance',
      action: 'Insurance lapse flagged',
      accountNumber: 'ACA-44218',
      timestamp: new Date(Date.now() - 60 * 60_000),
    },
  ]);

  readonly entries = this._entries.asReadonly();

  addEntry(partial: Pick<ActivityEntry, 'section' | 'action' | 'accountNumber'>): void {
    this._entries.update((prev) =>
      [
        {
          id: crypto.randomUUID(),
          ...partial,
          timestamp: new Date(),
        },
        ...prev,
      ].slice(0, 50),
    );
  }
}
