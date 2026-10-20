package com.example.expensetracker;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for the business rules. No database, no web server: they run in milliseconds.
 * The repository is replaced by a Mockito "mock" (a fake object we control).
 */
class ExpenseServiceTest {

    private ExpenseRepository repository;
    private ExpenseService service;

    @BeforeEach
    void setUp() {
        repository = mock(ExpenseRepository.class);
        service = new ExpenseService(repository);
    }

    @Test
    void validExpenseIsSaved() {
        Expense lunch = new Expense(null, "Lunch", "Food", new BigDecimal("12.50"), LocalDate.of(2026, 10, 1));

        service.addExpense(lunch);

        verify(repository).save(lunch);
    }

    @Test
    void expenseWithoutDateGetsTodaysDate() {
        service.addExpense(new Expense(null, "Bus", "Transport", new BigDecimal("2.75"), null));

        verify(repository).save(new Expense(null, "Bus", "Transport", new BigDecimal("2.75"), LocalDate.now()));
    }

    @Test
    void zeroAmountIsRejected() {
        Expense free = new Expense(null, "Free sample", "Food", BigDecimal.ZERO, null);

        assertThatThrownBy(() -> service.addExpense(free))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Amount must be greater than 0");
        verify(repository, never()).save(any());
    }

    @Test
    void negativeAmountIsRejected() {
        Expense negative = new Expense(null, "Refund", "Food", new BigDecimal("-5"), null);

        assertThatThrownBy(() -> service.addExpense(negative))
                .hasMessage("Amount must be greater than 0");
    }

    @Test
    void blankDescriptionIsRejected() {
        Expense noName = new Expense(null, "  ", "Food", new BigDecimal("5"), null);

        assertThatThrownBy(() -> service.addExpense(noName))
                .hasMessage("Description is required");
    }

    @Test
    void summaryTotalAddsUpEveryCategory() {
        when(repository.totalsByCategory()).thenReturn(List.of(
                new CategoryTotal("Rent", new BigDecimal("1200.00")),
                new CategoryTotal("Food", new BigDecimal("310.50"))));

        Summary summary = service.getSummary();

        assertThat(summary.total()).isEqualByComparingTo("1510.50");
        assertThat(summary.byCategory()).hasSize(2);
    }

    @Test
    void summaryIsZeroWhenThereAreNoExpenses() {
        when(repository.totalsByCategory()).thenReturn(List.of());

        assertThat(service.getSummary().total()).isEqualByComparingTo("0");
    }
}
