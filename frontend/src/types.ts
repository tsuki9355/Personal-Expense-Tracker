// These match the JSON that the Spring Boot API sends and receives.

export interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  expenseDate: string; // "2026-10-05"
}

/** What the form sends to the API. The server assigns the id. */
export type NewExpense = Omit<Expense, 'id'>;

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface Summary {
  total: number;
  byCategory: CategoryTotal[];
}
