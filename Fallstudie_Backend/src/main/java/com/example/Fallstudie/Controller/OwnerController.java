package com.example.Fallstudie.Controller;

import com.example.Fallstudie.Service.BudgetService;
import com.example.Fallstudie.Service.ExpenseService;
import com.example.Fallstudie.Service.ForecastService;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Expense;
import com.example.Fallstudie.model.Forecast;
import com.example.Fallstudie.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    @Autowired
    private BudgetService budgetService;
    @Autowired
    private ExpenseService expenseService;
    @Autowired
    private ForecastService forecastService;

    // Eigene Budgets abrufen
    @GetMapping("/budgets")
    public ResponseEntity<List<Budget>> getOwnBudgets(Authentication authentication) {
        User owner = (User) authentication.getPrincipal();
        List<Budget> budgets = budgetService.getBudgetsByOwner(owner);
        return ResponseEntity.ok(budgets);
    }

    // Ist-Werte eingeben
    @PostMapping("/expenses")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense, Authentication authentication) {
        User owner = (User) authentication.getPrincipal();
        // Validierung: Überprüfen, ob der Benutzer berechtigt ist, Ausgaben für dieses Budget hinzuzufügen
        if (!expense.getBudget().getOwner().equals(owner)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Expense savedExpense = expenseService.addExpense(expense);
        return ResponseEntity.ok(savedExpense);
    }

    // Forecast-Werte eintragen
    @PostMapping("/forecasts")
    public ResponseEntity<Forecast> addForecast(@RequestBody Forecast forecast, Authentication authentication) {
        User owner = (User) authentication.getPrincipal();
        // Validierung: Überprüfen, ob der Benutzer berechtigt ist, Forecasts für dieses Budget hinzuzufügen
        if (!forecast.getBudget().getOwner().equals(owner)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Forecast savedForecast = forecastService.addForecast(forecast);
        return ResponseEntity.ok(savedForecast);
    }

    // Forecasts für ein Budget abrufen
    @GetMapping("/forecasts")
    public ResponseEntity<List<Forecast>> getForecastsByBudget(@RequestParam Long budgetId, Authentication authentication) {
        User owner = (User) authentication.getPrincipal();
        Budget budget = budgetService.getBudgetById(budgetId);
        // Validierung: Überprüfen, ob der Benutzer Zugriff auf dieses Budget hat
        if (!budget.getOwner().equals(owner)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Forecast> forecasts = forecastService.getForecastsByBudget(budget);
        return ResponseEntity.ok(forecasts);
    }

}

