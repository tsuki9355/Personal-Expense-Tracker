# Expense Tracker API

**Live demo:** http://expense-tracker-env.eba-j6zncmqi.us-east-2.elasticbeanstalk.com/api/expenses
*(may be offline to save hosting costs)*

A REST API for recording expenses and seeing how much is spent per category.

**Built with:** Java 17 · Spring Boot · SQL / JDBC · JUnit 5 + Mockito · AWS Elastic Beanstalk + RDS (MySQL)

## Architecture

```
ExpenseController   →  REST endpoints (JSON in, JSON out)
      ↓
ExpenseService      →  business rules (validation, totals)
      ↓
ExpenseRepository   →  SQL queries through JDBC (JdbcTemplate)
      ↓
Database            →  H2 locally · MySQL on AWS RDS in production
```

Deployed on **AWS Elastic Beanstalk** with an **Amazon RDS MySQL** database. Database credentials are
supplied as environment variables, so none are stored in the code.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/expenses` | List all expenses |
| POST   | `/api/expenses` | Add an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |
| GET    | `/api/expenses/summary` | Total spent, and total per category |

**Add an expense** (`POST /api/expenses`); `expenseDate` is optional and defaults to today:

```json
{ "description": "Groceries", "category": "Food", "amount": 45.20, "expenseDate": "2026-10-05" }
```

**Summary** (`GET /api/expenses/summary`):

```json
{
  "total": 155.20,
  "byCategory": [
    { "category": "Food", "total": 125.20 },
    { "category": "Transport", "total": 30.00 }
  ]
}
```

Invalid input, such as a negative amount, returns `400 Bad Request` with the reason.

## Tests

- **`ExpenseServiceTest`**: unit tests for the business rules, using Mockito instead of a real database
- **`ExpenseRepositoryTest`**: integration tests that run the SQL queries against an in-memory database

## Run locally

Requires JDK 17.

```bash
./mvnw test               # run the tests
./mvnw spring-boot:run    # start at http://localhost:8080
```

On Windows, use `.\mvnw` instead of `./mvnw`.
