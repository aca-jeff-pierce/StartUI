export type ReinstatementStatus = 'Open' | 'Pending' | 'Completed' | 'Declined';

export interface Reinstatement {
  readonly id: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly policyType: string;
  readonly agentName: string;
  readonly status: ReinstatementStatus;
  readonly quoteAmount: number;
  readonly requestDate: string;
  readonly lapseDate: string;
  readonly dueDate: string;
  readonly assignedTo: string;
}
