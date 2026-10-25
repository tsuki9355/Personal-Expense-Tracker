import type { Expense, NewExpense, Summary } from './types';

// The only file that talks to the backend. Components call these functions instead of using fetch directly.
const BASE_URL = '/api/expenses';

export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Could not load expenses.');
  return response.json();
}

export async function getSummary(): Promise<Summary> {
  const response = await fetch(`${BASE_URL}/summary`);
  if (!response.ok) throw new Error('Could not load the summary.');
  return response.json();
}

export async function addExpense(expense: NewExpense): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!response.ok) {
    // The API explains what was wrong, e.g. "Amount must be greater than 0"
    const message = await response.text();
    throw new Error(message || 'Could not save the expense.');
  }
}

export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Could not delete the expense.');
}
