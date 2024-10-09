package com.example.Fallstudie.controller;

import com.example.Fallstudie.DTO.BudgetDetailsDTO;
import com.example.Fallstudie.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // GET Budget by Finance //Fertig
    @GetMapping("/finance/{userId}")
    public ResponseEntity<List<BudgetDetailsDTO>> getBudgetsByFinance(@PathVariable Long userId) {
        List<BudgetDetailsDTO> budgetDTOs = budgetService.getBudgetByFinanceDTO(userId);
        return ResponseEntity.ok(budgetDTOs);
    }

    // UPDATE Budget by Finance //fertig
    @PutMapping("/{id}")
    public ResponseEntity<BudgetDetailsDTO> updateBudget(@PathVariable Long id, @RequestBody BudgetDetailsDTO budgetDetailsDTO) {
        BudgetDetailsDTO updatedBudgetDTO = budgetService.updateBudgetDTO(id, budgetDetailsDTO);
        return ResponseEntity.ok(updatedBudgetDTO);
    }

    // CREATE new Budget //Fertig
    /*
     Mögliche JSON: Es müssen Email und Id für Owner, Finance und Manager angegeben werden.
     {
  "id": 12345,
  "name": "Beispiel Budget",
  "availableBudget": 10000.50,
  "owner": {
    "id": 11,
    "email": "test@test"
  },
  "finance": {
    "id": 12,
    "email": "test2@test"
  },
  "manager": {
    "id": 13,
    "email": "test3@test"
  }
}
     */
    @PostMapping
    public ResponseEntity<BudgetDetailsDTO> createBudget(@RequestBody BudgetDetailsDTO budgetDetailsDTO) {
        BudgetDetailsDTO createdBudgetDTO = budgetService.createNewBudgetDTO(budgetDetailsDTO);
        return ResponseEntity.ok(createdBudgetDTO);
    }

    // GET Budget by Manager //Fertig
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<BudgetDetailsDTO>> getBudgetsByManager(@PathVariable Long managerId) {
        List<BudgetDetailsDTO> budgetDTOs = budgetService.getBudgetByManagerDTO(managerId);
        return ResponseEntity.ok(budgetDTOs);
    }

    // GET Budget by Owner //Fertig
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<BudgetDetailsDTO>> getBudgetsByOwner(@PathVariable Long ownerId) {
        List<BudgetDetailsDTO> budgetDTOs = budgetService.getBudgetByOwnerDTO(ownerId);
        return ResponseEntity.ok(budgetDTOs);
    }

    // GET Budget by Name //Fertig
    @GetMapping("/name/{name}")
    public ResponseEntity<BudgetDetailsDTO> getBudgetByName(@PathVariable String name) {
        BudgetDetailsDTO budgetDTO = budgetService.getBudgetByNameDTO(name);
        return ResponseEntity.ok(budgetDTO);
    }

    // GET All Budgets //Fertig
    @GetMapping
    public ResponseEntity<List<BudgetDetailsDTO>> getAllBudgets() {
        List<BudgetDetailsDTO> budgetDTOs = budgetService.getAllBudgetsDTO();
        return ResponseEntity.ok(budgetDTOs);
    }

    // APPROVE Budget //Fertig
    @PutMapping("/{id}/approve")
    public ResponseEntity<BudgetDetailsDTO> approveBudget(@PathVariable Long id) {
        BudgetDetailsDTO approvedBudgetDTO = budgetService.approveBudgetDTO(id);
        return ResponseEntity.ok(approvedBudgetDTO);
    }
}
