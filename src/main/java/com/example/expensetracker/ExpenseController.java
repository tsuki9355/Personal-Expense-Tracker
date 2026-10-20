package com.example.expensetracker;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * The REST API. Each method handles one URL.
 * Spring turns the JSON request body into Java objects, and the returned objects back into JSON.
 */
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // GET /api/expenses -> list every expense
    @GetMapping
    public List<Expense> getAll() {
        return service.getAllExpenses();
    }

    // POST /api/expenses -> add an expense (JSON in the request body)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void add(@RequestBody Expense expense) {
        service.addExpense(expense);
    }

    // DELETE /api/expenses/3 -> delete the expense with id 3
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        if (service.deleteExpense(id)) {
            return ResponseEntity.noContent().build();   // 204: deleted
        }
        return ResponseEntity.notFound().build();         // 404: no such expense
    }

    // GET /api/expenses/summary -> total spent, and total per category
    @GetMapping("/summary")
    public Summary summary() {
        return service.getSummary();
    }

    // If the service rejects the input, reply with 400 Bad Request and the reason
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadInput(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
