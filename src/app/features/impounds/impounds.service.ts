import { Injectable, signal, computed } from '@angular/core';
import { Impound, ImpoundStatus } from './impound.model';

const MOCK_IMPOUNDS: Impound[] = [
  { id: '1', accountNumber: 'ACA-889231', customerName: 'Marcus Johnson',  status: 'Active',    location: 'Atlanta, GA',    daysInImpound: 5,  assignedTo: 'Jeff P.' },
  { id: '2', accountNumber: 'ACA-774102', customerName: 'Sarah Williams',  status: 'Critical',  location: 'Charlotte, NC',  daysInImpound: 18, assignedTo: 'Jeff P.' },
  { id: '3', accountNumber: 'ACA-554812', customerName: 'David Chen',      status: 'Pending',   location: 'Dallas, TX',     daysInImpound: 2,  assignedTo: 'Maria S.' },
  { id: '4', accountNumber: 'ACA-321004', customerName: 'Lisa Martinez',   status: 'Released',  location: 'Tampa, FL',      daysInImpound: 0,  assignedTo: 'Maria S.' },
  { id: '5', accountNumber: 'ACA-998127', customerName: 'James Thompson',  status: 'Escalated', location: 'Memphis, TN',    daysInImpound: 22, assignedTo: 'Jeff P.' },
  { id: '6', accountNumber: 'ACA-410055', customerName: 'Angela Davis',    status: 'Active',    location: 'Birmingham, AL', daysInImpound: 7,  assignedTo: 'Carlos R.' },
];

@Injectable({ providedIn: 'root' })
export class ImpoundsService {
  private readonly _impounds = signal<Impound[]>(MOCK_IMPOUNDS);

  readonly impounds = this._impounds.asReadonly();

  readonly stats = computed(() => {
    const all = this._impounds();
    return {
      active:   all.filter(i => i.status === 'Active').length,
      released: all.filter(i => i.status === 'Released').length,
      pending:  all.filter(i => i.status === 'Pending').length,
      critical: all.filter(i => i.status === 'Critical' || i.status === 'Escalated').length,
    };
  });

  updateStatus(id: string, status: ImpoundStatus): void {
    this._impounds.update(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }
}
