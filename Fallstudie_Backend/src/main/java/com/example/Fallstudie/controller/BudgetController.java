package com.example.Fallstudie.controller;

import com.example.Fallstudie.DTO.BudgetDetailsDTO;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.service.BudgetService;
import com.example.Fallstudie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserService userService; // Annahme: UserService existiert

    // GET Budget by Finance
    @GetMapping("/finance/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByFinance(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if(userOpt.isPresent()) {
            List<Budget> budgets = budgetService.getBudgetByFinance(userOpt.get());
            return ResponseEntity.ok(budgets);
        }
        return ResponseEntity.notFound().build();
    }

    // SET Budget by Finance
    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @RequestBody Budget budgetDetails) {
        Optional<Budget> budgetOpt = budgetService.getBudgetById(id);
        if(budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            // Update fields
            budget.setName(budgetDetails.getName());
            budget.setBudgetBetrag(budgetDetails.getBudgetBetrag());
            // Weitere Felder nach Bedarf
            Budget updatedBudget = budgetService.updateBudget(id, budget, budget.getErsteller().getId());
            return ResponseEntity.ok(updatedBudget);
        }
        return ResponseEntity.notFound().build();
    }

    // CREATE new Budget
    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget, Authentication authentication) {
        // Angenommen, Sie können die Benutzer-ID aus dem Authentication-Objekt extrahieren
        Long userId = userService.getUserIdFromAuthentication(authentication);
        Budget createdBudget = budgetService.createNewBudget(budget, userId);
        return ResponseEntity.ok(createdBudget);
    }

    // GET Budget by Manager
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Budget>> getBudgetsByManager(@PathVariable Long managerId) {
        Optional<User> managerOpt = userService.getUserById(managerId);
        if(managerOpt.isPresent()) {
            List<Budget> budgets = budgetService.getBudgetByManager(managerOpt.get());
            return ResponseEntity.ok(budgets);
        }
        return ResponseEntity.notFound().build();
    }

    // GET Budget by Owner
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Budget>> getBudgetsByOwner(@PathVariable Long ownerId) {
        Optional<User> ownerOpt = userService.getUserById(ownerId);
        if(ownerOpt.isPresent()) {
            List<Budget> budgets = budgetService.getBudgetByOwner(ownerOpt.get());
            return ResponseEntity.ok(budgets);
        }
        return ResponseEntity.notFound().build();
    }



    // GET Budget by Name
    @GetMapping("/name/{name}")
    public ResponseEntity<Budget> getBudgetByName(@PathVariable String name) {
        Optional<Budget> budgetOpt = budgetService.getBudgetByName(name);
        return budgetOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET All Budgets
    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        List<Budget> budgets = budgetService.getAllBudgets();
        return ResponseEntity.ok(budgets);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Budget> approveBudget(@PathVariable Long id, @RequestParam Long managerId) {
        Optional<User> managerOpt = userService.getUserById(managerId);
        if(managerOpt.isPresent()) {
            Budget approvedBudget = budgetService.approveBudget(id, managerOpt.get());
            return ResponseEntity.ok(approvedBudget);
        }
        return ResponseEntity.notFound().build();
    }

}
