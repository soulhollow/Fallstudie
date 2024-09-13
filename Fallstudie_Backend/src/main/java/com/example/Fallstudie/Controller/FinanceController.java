package com.example.Fallstudie.Controller;

import com.example.Fallstudie.Service.BudgetService;
import com.example.Fallstudie.model.Budget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/finance")
public class FinanceController {

    @Autowired
    private BudgetService budgetService;

    // Budget anlegen
    @PostMapping("/budgets")
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        Budget createdBudget = budgetService.createBudget(budget);
        return ResponseEntity.ok(createdBudget);
    }

    // Budgets genehmigen
    @PostMapping("/budgets/{id}/approve")
    public ResponseEntity<Budget> approveBudget(@PathVariable Long id) {
        Budget approvedBudget = budgetService.approveBudget(id);
        return ResponseEntity.ok(approvedBudget);
    }

    // Soll-Ist-Vergleich anzeigen
    @GetMapping("/budgets/compare")
    public ResponseEntity<?> getBudgetComparison() {
        // Implementierung der Auswertung
        return ResponseEntity.ok("Budgetvergleich");
    }

    // Weitere Finance-Funktionen
}
