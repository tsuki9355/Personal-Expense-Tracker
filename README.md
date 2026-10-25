# Expense Tracker

**Live demo:** http://expense-tracker-env.eba-j6zncmqi.us-east-2.elasticbeanstalk.com
*(may be offline to save hosting costs)*

A full-stack app for recording expenses and seeing where your money goes: a React + TypeScript
frontend on top of a Spring Boot REST API, backed by MySQL.

**Frontend:** React · TypeScript · Vite · Vitest + React Testing Library
**Backend:** Java 17 · Spring Boot · SQL / JDBC · JUnit 5 + Mockito
**Cloud:** AWS Elastic Beanstalk · Amazon RDS (MySQL)

## Features

- Add expenses with a description, amount, category, and date
- View expense history and delete entries
- See total spending and a per-category breakdown
- Responsive layout (desktop and mobile) with automatic dark mode
- Accessible: labelled form fields, screen-reader announcements for errors, keyboard focus styles

## Architecture

```
React frontend (frontend/)       →  forms, history table, spending summary
      ↓  fetch /api/expenses (JSON)
ExpenseController                →  REST endpoints
      ↓
ExpenseService                   →  business rules (validation, totals)
      ↓
ExpenseRepository                →  SQL queries through JDBC (JdbcTemplate)
      ↓
Database                         →  H2 locally · MySQL on AWS RDS in production
```

The React app is built into Spring Boot's `static` folder, so the frontend and API ship together as a
single `.jar` and are served from the same address. Deployed on **AWS Elastic Beanstalk** with an
**Amazon RDS MySQL** database; credentials are supplied as environment variables, never stored in code.

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

| Layer | Tests | What they check |
|-------|-------|-----------------|
| Frontend | `ExpenseForm.test.tsx`, `SpendingSummary.test.tsx` | Form validation, submitting, server errors, summary display |
| Backend | `ExpenseServiceTest` | Business rules, using Mockito instead of a real database |
| Backend | `ExpenseRepositoryTest` | SQL queries against an in-memory database |

## Run locally

Requires JDK 17 and Node.js. On Windows, use `.\mvnw` instead of `./mvnw`.

**Development** (two terminals, with live reload for the frontend):

```bash
./mvnw spring-boot:run                    # terminal 1: API at http://localhost:8080
cd frontend && npm install && npm run dev  # terminal 2: app at http://localhost:5173
```

**Tests:**

```bash
./mvnw test                  # backend
cd frontend && npm test      # frontend
```

**Production build** (one `.jar` containing the frontend and the API):

```bash
cd frontend && npm install && npm run build && cd ..
./mvnw clean package         # creates target/expense-tracker.jar
```
