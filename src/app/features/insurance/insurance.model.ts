export type InsuranceStatus = 'Active' | 'Lapsed' | 'Pending' | 'CPI Applied';

export interface InsuranceRecord {
  readonly id: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly status: InsuranceStatus;
  readonly insuranceProvider: string;
  readonly expirationDate: string;
  readonly cpiApplied: boolean;
  readonly assignedTo: string;
}
