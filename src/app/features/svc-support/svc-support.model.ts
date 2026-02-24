export type SvcSupportStatus = 'Open' | 'Pending' | 'Resolved' | 'Escalated';

export interface SvcSupportTicket {
  readonly id: string;
  readonly ticketNumber: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly status: SvcSupportStatus;
  readonly category: string;
  readonly slaBreach: boolean;
  readonly assignedTo: string;
}
