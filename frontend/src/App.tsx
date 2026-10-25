import { useEffect, useState } from 'react';
import { addExpense, deleteExpense, getExpenses, getSummary } from './api';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SpendingSummary } from './components/SpendingSummary';
import type { Expense, NewExpense, Summary } from './types';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the list and the summary together, so they always match
  async function refresh() {
    try {
      const [latestExpenses, latestSummary] = await Promise.all([getExpenses(), getSummary()]);
      setExpenses(latestExpenses);
      setSummary(latestSummary);
      setError(null);
    } catch {
      setError('Could not reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleAdd(expense: NewExpense) {
    await addExpense(expense); // errors are shown by the form
    await refresh();
  }

  async function handleDelete(id: number) {
    try {
      await deleteExpense(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the expense.');
    }
  }

  return (
    <main className="app">
      <header>
        <h1>Expense Tracker</h1>
        <p className="subtitle">Record what you spend and see where your money goes.</p>
      </header>

      {error && (
        <p className="banner-error" role="alert">
          {error}
        </p>
      )}

      <div className="top-row">
        <ExpenseForm onAdd={handleAdd} />
        <SpendingSummary summary={summary} />
      </div>

      <ExpenseList expenses={expenses} loading={loading} onDelete={handleDelete} />
    </main>
  );
}
