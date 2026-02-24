import { Injectable, signal, computed } from '@angular/core';
import { AntRequest, AntStatus } from './ant.model';

const MOCK_ANT_REQUESTS: AntRequest[] = [
  { id: '1', accountNumber: 'ACA-112233', customerName: 'Robert Brown',  status: 'Pending',  requestType: 'Deferral',  requestDate: '2026-02-20', assignedTo: 'Jeff P.' },
  { id: '2', accountNumber: 'ACA-224455', customerName: 'Emily Wilson',  status: 'Approved', requestType: 'Extension', requestDate: '2026-02-18', assignedTo: 'Jeff P.' },
  { id: '3', accountNumber: 'ACA-336677', customerName: 'Carlos Rivera', status: 'Denied',   requestType: 'Deferral',  requestDate: '2026-02-15', assignedTo: 'Maria S.' },
  { id: '4', accountNumber: 'ACA-448899', customerName: 'Tanya Moore',   status: 'Expired',  requestType: 'Hardship',  requestDate: '2026-01-30', assignedTo: 'Carlos R.' },
  { id: '5', accountNumber: 'ACA-551122', customerName: 'Derek Wallace', status: 'Pending',  requestType: 'Extension', requestDate: '2026-02-22', assignedTo: 'Jeff P.' },
  { id: '6', accountNumber: 'ACA-663344', customerName: 'Nina Patel',    status: 'Approved', requestType: 'Deferral',  requestDate: '2026-02-19', assignedTo: 'Maria S.' },
];

@Injectable({ providedIn: 'root' })
export class AntService {
  private readonly _requests = signal<AntRequest[]>(MOCK_ANT_REQUESTS);

  readonly requests = this._requests.asReadonly();

  readonly stats = computed(() => {
    const all = this._requests();
    return {
      pending:  all.filter(i => i.status === 'Pending').length,
      approved: all.filter(i => i.status === 'Approved').length,
      denied:   all.filter(i => i.status === 'Denied').length,
      expired:  all.filter(i => i.status === 'Expired').length,
    };
  });

  updateStatus(id: string, status: AntStatus): void {
    this._requests.update(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }
}
