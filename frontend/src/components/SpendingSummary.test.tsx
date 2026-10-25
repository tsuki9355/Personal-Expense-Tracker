import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpendingSummary } from './SpendingSummary';

describe('SpendingSummary', () => {
  it('shows the total and each category amount', () => {
    render(
      <SpendingSummary
        summary={{
          total: 155.2,
          byCategory: [
            { category: 'Food', total: 125.2 },
            { category: 'Transport', total: 30 },
          ],
        }}
      />,
    );

    expect(screen.getByText('$155.20')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('$125.20')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('$30.00')).toBeInTheDocument();
  });

  it('shows $0.00 and a hint when there is no spending yet', () => {
    render(<SpendingSummary summary={{ total: 0, byCategory: [] }} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('Your category breakdown will appear here.')).toBeInTheDocument();
  });
});
