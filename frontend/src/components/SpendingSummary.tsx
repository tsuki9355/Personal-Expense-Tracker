import { formatMoney } from '../format';
import type { Summary } from '../types';

interface Props {
  summary: Summary | null;
}

export function SpendingSummary({ summary }: Props) {
  const categories = summary?.byCategory ?? [];
  // The biggest category gets a full-width bar; the others are sized relative to it
  const largest = Math.max(...categories.map((c) => c.total), 0);

  return (
    <section className="card" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Spending by category</h2>

      <p className="total">
        <span className="muted">Total spent</span>
        <strong>{formatMoney(summary?.total ?? 0)}</strong>
      </p>

      {categories.length === 0 ? (
        <p className="muted">Your category breakdown will appear here.</p>
      ) : (
        <ul className="bars">
          {categories.map(({ category, total }) => (
            <li key={category}>
              <div className="bar-label">
                <span>{category}</span>
                <span>{formatMoney(total)}</span>
              </div>
              {/* The bar is decorative: the amount above already gives the same information */}
              <div className="bar-track" aria-hidden="true">
                <div className="bar-fill" style={{ width: `${(total / largest) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
