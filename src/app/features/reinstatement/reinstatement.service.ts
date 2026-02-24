import { Injectable, signal, computed } from '@angular/core';
import { Reinstatement, ReinstatementStatus } from './reinstatement.model';

const MOCK_REINSTATEMENTS: Reinstatement[] = [
  { id: '1', accountNumber: 'ACA-771001', customerName: 'Patricia Adams',  status: 'Open',      quoteAmount: 2450.00, dueDate: '2026-03-01', assignedTo: 'Jeff P.' },
  { id: '2', accountNumber: 'ACA-772002', customerName: 'Samuel Harris',   status: 'Pending',   quoteAmount: 1875.50, dueDate: '2026-02-28', assignedTo: 'Jeff P.' },
  { id: '3', accountNumber: 'ACA-773003', customerName: 'Gloria Turner',   status: 'Completed', quoteAmount: 3200.00, dueDate: '2026-02-15', assignedTo: 'Maria S.' },
  { id: '4', accountNumber: 'ACA-774004', customerName: 'Anthony Scott',   status: 'Open',      quoteAmount: 990.75,  dueDate: '2026-03-05', assignedTo: 'Carlos R.' },
  { id: '5', accountNumber: 'ACA-775005', customerName: 'Linda Clark',     status: 'Declined',  quoteAmount: 4100.00, dueDate: '2026-02-10', assignedTo: 'Jeff P.' },
  { id: '6', accountNumber: 'ACA-776006', customerName: 'George Mitchell', status: 'Pending',   quoteAmount: 1500.00, dueDate: '2026-03-03', assignedTo: 'Maria S.' },
];

@Injectable({ providedIn: 'root' })
export class ReinstatementService {
  private readonly _reinstatements = signal<Reinstatement[]>(MOCK_REINSTATEMENTS);

  readonly reinstatements = this._reinstatements.asReadonly();

  readonly stats = computed(() => {
    const all = this._reinstatements();
    return {
      open:      all.filter(i => i.status === 'Open').length,
      pending:   all.filter(i => i.status === 'Pending').length,
      completed: all.filter(i => i.status === 'Completed').length,
      declined:  all.filter(i => i.status === 'Declined').length,
    };
  });

  updateStatus(id: string, status: ReinstatementStatus): void {
    this._reinstatements.update(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }
}
