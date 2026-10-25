import { useState, type FormEvent } from 'react';
import { todayIso } from '../format';
import type { NewExpense } from '../types';

export const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'];

interface Props {
  onAdd: (expense: NewExpense) => Promise<void>;
}

export function ExpenseForm({ onAdd }: Props) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayIso());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Quick checks for instant feedback. The API checks the same rules, so it stays the source of truth.
    const value = Number(amount);
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }
    if (!(value > 0)) {
      setError('Amount must be greater than 0.');
      return;
    }

    setSaving(true);
    try {
      await onAdd({ description: description.trim(), category, amount: value, expenseDate: date });
      setDescription('');
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the expense.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card" aria-labelledby="add-heading">
      <h2 id="add-heading">Add an expense</h2>

      {/* noValidate: show our own clear messages instead of the browser's pop-ups */}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Groceries"
          maxLength={255}
        />

        <div className="form-row">
          <div>
            <label htmlFor="amount">Amount ($)</label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Add expense'}
        </button>
      </form>
    </section>
  );
}
