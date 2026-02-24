import { Injectable, signal, computed } from '@angular/core';
import { Settlement, SettlementStatus } from './settlements.model';

const MOCK_SETTLEMENTS: Settlement[] = [
  { id: '1', accountNumber: 'ACA-991001', customerName: 'Carolyn Rivera', status: 'Offer Out',     offerAmount: 5200.00,  balanceOwed: 8750.00,  expirationDate: '2026-03-15', assignedTo: 'Jeff P.' },
  { id: '2', accountNumber: 'ACA-992002', customerName: 'Eugene Morgan',  status: 'Counter Offer', offerAmount: 4800.00,  balanceOwed: 7300.00,  expirationDate: '2026-03-10', assignedTo: 'Jeff P.' },
  { id: '3', accountNumber: 'ACA-993003', customerName: 'Alice Cooper',   status: 'Accepted',      offerAmount: 3150.00,  balanceOwed: 6200.00,  expirationDate: '2026-02-28', assignedTo: 'Maria S.' },
  { id: '4', accountNumber: 'ACA-994004', customerName: 'Frank Bailey',   status: 'Expired',       offerAmount: 2900.00,  balanceOwed: 5100.00,  expirationDate: '2026-01-31', assignedTo: 'Carlos R.' },
  { id: '5', accountNumber: 'ACA-995005', customerName: 'Jean Rivera',    status: 'Offer Out',     offerAmount: 6800.00,  balanceOwed: 11200.00, expirationDate: '2026-03-20', assignedTo: 'Jeff P.' },
  { id: '6', accountNumber: 'ACA-996006', customerName: 'Philip Torres',  status: 'Voided',        offerAmount: 1500.00,  balanceOwed: 4000.00,  expirationDate: '2026-01-20', assignedTo: 'Maria S.' },
];

@Injectable({ providedIn: 'root' })
export class SettlementsService {
  private readonly _settlements = signal<Settlement[]>(MOCK_SETTLEMENTS);

  readonly settlements = this._settlements.asReadonly();

  readonly stats = computed(() => {
    const all = this._settlements();
    return {
      offersOut:     all.filter(i => i.status === 'Offer Out').length,
      counterOffers: all.filter(i => i.status === 'Counter Offer').length,
      accepted:      all.filter(i => i.status === 'Accepted').length,
      expired:       all.filter(i => i.status === 'Expired').length,
    };
  });

  updateStatus(id: string, status: SettlementStatus): void {
    this._settlements.update(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }
}
