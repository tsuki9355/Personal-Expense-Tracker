import { formatMoney } from '../format';
import type { Expense } from '../types';

interface Props {
  expenses: Expense[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export function ExpenseList({ expenses, loading, onDelete }: Props) {
  return (
    <section className="card" aria-labelledby="history-heading">
      <h2 id="history-heading">History</h2>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : expenses.length === 0 ? (
        <p className="muted">No expenses yet. Add your first one above.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col" className="number">Amount</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.expenseDate}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td className="number">{formatMoney(expense.amount)}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => onDelete(expense.id)}
                      aria-label={`Delete ${expense.description}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
