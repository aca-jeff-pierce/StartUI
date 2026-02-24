import { Injectable, signal, computed } from '@angular/core';
import { InsuranceRecord, InsuranceStatus } from './insurance.model';

const MOCK_INSURANCE: InsuranceRecord[] = [
  { id: '1', accountNumber: 'ACA-551001', customerName: 'Virginia Robinson', status: 'Active',      insuranceProvider: 'State Farm',  expirationDate: '2026-11-15', cpiApplied: false, assignedTo: 'Jeff P.' },
  { id: '2', accountNumber: 'ACA-552002', customerName: 'Raymond Carter',    status: 'Lapsed',      insuranceProvider: 'GEICO',        expirationDate: '2026-01-01', cpiApplied: false, assignedTo: 'Jeff P.' },
  { id: '3', accountNumber: 'ACA-553003', customerName: 'Shirley Phillips',  status: 'CPI Applied', insuranceProvider: 'CPI Program',  expirationDate: '2026-02-01', cpiApplied: true,  assignedTo: 'Maria S.' },
  { id: '4', accountNumber: 'ACA-554004', customerName: 'Jack Evans',        status: 'Pending',     insuranceProvider: 'Allstate',     expirationDate: '2026-03-20', cpiApplied: false, assignedTo: 'Carlos R.' },
  { id: '5', accountNumber: 'ACA-555005', customerName: 'Rose Collins',      status: 'Lapsed',      insuranceProvider: 'Progressive',  expirationDate: '2026-01-15', cpiApplied: false, assignedTo: 'Jeff P.' },
  { id: '6', accountNumber: 'ACA-556006', customerName: 'Walter Stewart',    status: 'Active',      insuranceProvider: 'Nationwide',   expirationDate: '2026-12-31', cpiApplied: false, assignedTo: 'Maria S.' },
];

@Injectable({ providedIn: 'root' })
export class InsuranceService {
  private readonly _records = signal<InsuranceRecord[]>(MOCK_INSURANCE);

  readonly records = this._records.asReadonly();

  readonly stats = computed(() => {
    const all = this._records();
    return {
      active:     all.filter(i => i.status === 'Active').length,
      lapsed:     all.filter(i => i.status === 'Lapsed').length,
      cpiApplied: all.filter(i => i.cpiApplied === true).length,
      pending:    all.filter(i => i.status === 'Pending').length,
    };
  });

  updateStatus(id: string, status: InsuranceStatus): void {
    this._records.update(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }

  applyCpi(id: string): void {
    this._records.update(prev =>
      prev.map(i => i.id === id ? { ...i, status: 'CPI Applied' as InsuranceStatus, cpiApplied: true } : i)
    );
  }
}
