package com.example.expensetracker;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One expense = one row in the "expenses" table.
 * A record is a short way to write a class that just holds data.
 */
public record Expense(
        Long id,
        String description,
        String category,
        BigDecimal amount,
        LocalDate expenseDate) {
}
