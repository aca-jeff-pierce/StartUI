export type SettlementStatus = 'Offer Out' | 'Counter Offer' | 'Accepted' | 'Expired' | 'Voided';

export interface Settlement {
  readonly id: string;
  readonly accountNumber: string;
  readonly customerName: string;
  readonly status: SettlementStatus;
  readonly offerAmount: number;
  readonly balanceOwed: number;
  readonly expirationDate: string;
  readonly assignedTo: string;
}
