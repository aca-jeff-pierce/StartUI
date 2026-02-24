import { Injectable, signal, computed } from '@angular/core';
import { SvcSupportTicket, SvcSupportStatus } from './svc-support.model';

const MOCK_TICKETS: SvcSupportTicket[] = [
  { id: '1', ticketNumber: 'TKT-4501', accountNumber: 'ACA-881001', customerName: 'Barbara Lewis',   status: 'Open',      category: 'Payment Issue',   slaBreach: true,  assignedTo: 'Jeff P.' },
  { id: '2', ticketNumber: 'TKT-4502', accountNumber: 'ACA-882002', customerName: 'Steven Young',    status: 'Pending',   category: 'Title Request',   slaBreach: false, assignedTo: 'Jeff P.' },
  { id: '3', ticketNumber: 'TKT-4503', accountNumber: 'ACA-883003', customerName: 'Rachel King',     status: 'Resolved',  category: 'Account Inquiry', slaBreach: false, assignedTo: 'Maria S.' },
  { id: '4', ticketNumber: 'TKT-4504', accountNumber: 'ACA-884004', customerName: 'Howard Green',    status: 'Escalated', category: 'Dispute',         slaBreach: true,  assignedTo: 'Carlos R.' },
  { id: '5', ticketNumber: 'TKT-4505', accountNumber: 'ACA-885005', customerName: 'Dorothy Hall',    status: 'Open',      category: 'Payment Issue',   slaBreach: true,  assignedTo: 'Jeff P.' },
  { id: '6', ticketNumber: 'TKT-4506', accountNumber: 'ACA-886006', customerName: 'Kenneth Wright',  status: 'Pending',   category: 'Address Update',  slaBreach: false, assignedTo: 'Maria S.' },
];

@Injectable({ providedIn: 'root' })
export class SvcSupportService {
  private readonly _tickets = signal<SvcSupportTicket[]>(MOCK_TICKETS);

  readonly tickets = this._tickets.asReadonly();

  readonly stats = computed(() => {
    const all = this._tickets();
    return {
      open:      all.filter(i => i.status === 'Open').length,
      slaBreach: all.filter(i => i.slaBreach === true).length,
      resolved:  all.filter(i => i.status === 'Resolved').length,
      escalated: all.filter(i => i.status === 'Escalated').length,
    };
  });

  updateStatus(id: string, status: SvcSupportStatus): void {
    this._tickets.update(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  }
}
