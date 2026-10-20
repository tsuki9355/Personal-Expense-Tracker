package com.example.expensetracker;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.context.annotation.Import;

/**
 * Tests the real SQL against the in-memory H2 database.
 * Each test's changes are rolled back afterwards, so every test starts with an empty table.
 */
@JdbcTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ExpenseRepository.class)
class ExpenseRepositoryTest {

    @Autowired
    private ExpenseRepository repository;

    @Test
    void savedExpenseCanBeFoundAgain() {
        repository.save(new Expense(null, "Lunch", "Food", new BigDecimal("12.50"), LocalDate.of(2026, 10, 1)));

        List<Expense> all = repository.findAll();

        assertThat(all).hasSize(1);
        assertThat(all.get(0).id()).isNotNull();
        assertThat(all.get(0).description()).isEqualTo("Lunch");
        assertThat(all.get(0).amount()).isEqualByComparingTo("12.50");
        assertThat(all.get(0).expenseDate()).isEqualTo(LocalDate.of(2026, 10, 1));
    }

    @Test
    void totalsByCategoryAddsUpEachCategory() {
        repository.save(new Expense(null, "Groceries", "Food", new BigDecimal("40.00"), LocalDate.of(2026, 10, 1)));
        repository.save(new Expense(null, "Dinner", "Food", new BigDecimal("60.00"), LocalDate.of(2026, 10, 2)));
        repository.save(new Expense(null, "Bus pass", "Transport", new BigDecimal("30.00"), LocalDate.of(2026, 10, 3)));

        List<CategoryTotal> totals = repository.totalsByCategory();

        // Biggest category first
        assertThat(totals).hasSize(2);
        assertThat(totals.get(0).category()).isEqualTo("Food");
        assertThat(totals.get(0).total()).isEqualByComparingTo("100.00");
        assertThat(totals.get(1).category()).isEqualTo("Transport");
        assertThat(totals.get(1).total()).isEqualByComparingTo("30.00");
    }

    @Test
    void deleteRemovesTheExpense() {
        repository.save(new Expense(null, "Movie", "Fun", new BigDecimal("15.00"), LocalDate.of(2026, 10, 5)));
        long id = repository.findAll().get(0).id();

        assertThat(repository.deleteById(id)).isTrue();
        assertThat(repository.findAll()).isEmpty();
    }

    @Test
    void deletingAnUnknownIdReturnsFalse() {
        assertThat(repository.deleteById(999)).isFalse();
    }
}
