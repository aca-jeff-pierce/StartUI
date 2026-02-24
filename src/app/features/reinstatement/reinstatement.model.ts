export type ReinstatementStatus = 'Open' | 'Pending' | 'Completed' | 'Declined';

export interface Reinstatement {
  readonly id: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly status: ReinstatementStatus;
  readonly quoteAmount: number;
  readonly dueDate: string;
  readonly assignedTo: string;
}
