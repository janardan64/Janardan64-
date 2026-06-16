export interface Transaction {
  id: string;
  amount: number;
  note: string;
  date: string; // ISO format string
  category?: string;
}

export type MonthGroup = {
  month: string; // "YYYY-MM"
  transactions: Transaction[];
  total: number;
}
