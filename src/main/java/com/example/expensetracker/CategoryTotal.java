package com.example.expensetracker;

import java.math.BigDecimal;

/** How much was spent in one category, e.g. Food = 125.20 */
public record CategoryTotal(String category, BigDecimal total) {
}
