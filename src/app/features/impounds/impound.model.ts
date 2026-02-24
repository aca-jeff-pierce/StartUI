export type ImpoundStatus = 'Active' | 'Released' | 'Pending' | 'Critical' | 'Escalated';

export interface Impound {
  readonly id: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly status: ImpoundStatus;
  readonly location: string;
  readonly daysInImpound: number;
  readonly assignedTo: string;
}
