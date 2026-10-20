package com.example.expensetracker;

import java.math.BigDecimal;
import java.util.List;

/** Total spending, plus the breakdown per category. */
public record Summary(BigDecimal total, List<CategoryTotal> byCategory) {
}
