# Expense Tracker API

A simple REST API for recording expenses and seeing how much you spend per category.

**Built with:** Java 17 · Spring Boot · REST API · SQL with JDBC · JUnit + Mockito (TDD) · AWS Elastic Beanstalk + RDS

## How it works

```
ExpenseController   →  receives HTTP requests, sends back JSON
      ↓
ExpenseService      →  business rules (amount must be > 0, totals)
      ↓
ExpenseRepository   →  runs SQL on the database using JDBC
      ↓
Database            →  H2 on your computer, MySQL on AWS
```

## Files

| File | What it does |
|------|--------------|
| `schema.sql` | Creates the `expenses` table |
| `Expense.java` | One expense (matches one row in the table) |
| `ExpenseRepository.java` | The SQL: INSERT, SELECT, DELETE, SUM + GROUP BY |
| `ExpenseService.java` | Validation rules and the summary total |
| `ExpenseController.java` | The REST API endpoints |
| `ExpenseServiceTest.java` | Unit tests for the rules (fast, no database) |
| `ExpenseRepositoryTest.java` | Tests that the SQL really works |

## Run it

Needs JDK 17 (`JAVA_HOME` must point to it). In PowerShell:

```powershell
.\mvnw test               # run the tests
.\mvnw spring-boot:run    # start the app on http://localhost:8080
```

## API

| Method | URL | What it does |
|--------|-----|--------------|
| GET    | `/api/expenses` | List all expenses |
| POST   | `/api/expenses` | Add an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |
| GET    | `/api/expenses/summary` | Total spent + total per category |

Try it (PowerShell):

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/expenses -ContentType "application/json" -Body '{"description": "Groceries", "category": "Food", "amount": 45.20}'
Invoke-RestMethod http://localhost:8080/api/expenses
Invoke-RestMethod http://localhost:8080/api/expenses/summary
```

`expenseDate` is optional (`"2026-10-05"`); it defaults to today.

To see the database, open http://localhost:8080/h2-console and use JDBC URL `jdbc:h2:mem:expenses`, user `sa`, no password.

## Deploy to AWS

1. Build the app: `.\mvnw package` → creates `target/expense-tracker.jar`
2. In **Elastic Beanstalk**, create an application with platform **Java (Corretto 17)** and upload the jar.
3. Under *Configuration → Database*, add an **RDS MySQL** database. AWS gives the app the connection
   details automatically (`RDS_HOSTNAME`, `RDS_USERNAME`, ...), see `application-prod.properties`.
4. Under *Configuration → Environment properties*, add `SPRING_PROFILES_ACTIVE` = `prod`.
5. Set the health check path to `/api/expenses`.

Use the free-tier database size, and terminate the environment when you're done so you aren't charged.
