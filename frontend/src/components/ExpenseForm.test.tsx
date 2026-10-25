import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExpenseForm } from './ExpenseForm';

// These tests use the form the way a person would: find fields by their visible labels, type, click.
// Finding fields by label also proves every input has a proper, accessible label.
describe('ExpenseForm', () => {
  it('sends the entered expense to onAdd', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<ExpenseForm onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Description'), 'Lunch');
    await userEvent.type(screen.getByLabelText('Amount ($)'), '12.50');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Food');
    await userEvent.click(screen.getByRole('button', { name: 'Add expense' }));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Lunch', category: 'Food', amount: 12.5 }),
    );
  });

  it('shows an error and does not submit when the amount is zero', async () => {
    const onAdd = vi.fn();
    render(<ExpenseForm onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Description'), 'Free sample');
    await userEvent.type(screen.getByLabelText('Amount ($)'), '0');
    await userEvent.click(screen.getByRole('button', { name: 'Add expense' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Amount must be greater than 0.');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('shows an error when the description is empty', async () => {
    const onAdd = vi.fn();
    render(<ExpenseForm onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Amount ($)'), '5');
    await userEvent.click(screen.getByRole('button', { name: 'Add expense' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a description.');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('shows the error message from the server', async () => {
    const onAdd = vi.fn().mockRejectedValue(new Error('Category is required'));
    render(<ExpenseForm onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Description'), 'Bus');
    await userEvent.type(screen.getByLabelText('Amount ($)'), '3');
    await userEvent.click(screen.getByRole('button', { name: 'Add expense' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Category is required');
  });

  it('clears the description and amount after a successful save', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<ExpenseForm onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Description'), 'Coffee');
    await userEvent.type(screen.getByLabelText('Amount ($)'), '4.5');
    await userEvent.click(screen.getByRole('button', { name: 'Add expense' }));

    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.getByLabelText('Amount ($)')).toHaveValue(null);
  });
});
