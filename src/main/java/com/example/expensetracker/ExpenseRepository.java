package com.example.expensetracker;

import java.util.List;

import org.springframework.jdbc.core.DataClassRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * The only class that talks to the database. Every method is one SQL statement.
 * The "?" placeholders are filled in safely by JDBC, which prevents SQL injection.
 */
@Repository
public class ExpenseRepository {

    private final JdbcTemplate jdbc;

    public ExpenseRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(Expense expense) {
        jdbc.update(
                "INSERT INTO expenses (description, category, amount, expense_date) VALUES (?, ?, ?, ?)",
                expense.description(), expense.category(), expense.amount(), expense.expenseDate());
    }

    public List<Expense> findAll() {
        // DataClassRowMapper copies each column into the record field with the matching name
        // (expense_date -> expenseDate).
        return jdbc.query(
                "SELECT id, description, category, amount, expense_date FROM expenses ORDER BY expense_date DESC",
                new DataClassRowMapper<>(Expense.class));
    }

    /** Returns true if a row was deleted, false if no expense had that id. */
    public boolean deleteById(long id) {
        int rowsDeleted = jdbc.update("DELETE FROM expenses WHERE id = ?", id);
        return rowsDeleted > 0;
    }

    public List<CategoryTotal> totalsByCategory() {
        return jdbc.query(
                "SELECT category, SUM(amount) AS total FROM expenses GROUP BY category ORDER BY total DESC",
                new DataClassRowMapper<>(CategoryTotal.class));
    }
}
