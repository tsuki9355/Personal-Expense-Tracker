package com.example.expensetracker;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

/** The business rules: what counts as a valid expense, and how totals are calculated. */
@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public void addExpense(Expense expense) {
        if (expense.description() == null || expense.description().isBlank()) {
            throw new IllegalArgumentException("Description is required");
        }
        if (expense.category() == null || expense.category().isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }
        if (expense.amount() == null || expense.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        // If no date was sent, use today's date
        LocalDate date = expense.expenseDate() != null ? expense.expenseDate() : LocalDate.now();

        repository.save(new Expense(null, expense.description(), expense.category(), expense.amount(), date));
    }

    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    public boolean deleteExpense(long id) {
        return repository.deleteById(id);
    }

    public Summary getSummary() {
        List<CategoryTotal> byCategory = repository.totalsByCategory();

        BigDecimal total = BigDecimal.ZERO;
        for (CategoryTotal categoryTotal : byCategory) {
            total = total.add(categoryTotal.total());
        }
        return new Summary(total, byCategory);
    }
}
