export type AntStatus = 'Pending' | 'Approved' | 'Denied' | 'Expired';

export interface AntRequest {
  readonly id: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly status: AntStatus;
  readonly requestType: string;
  readonly requestDate: string;
  readonly assignedTo: string;
}
