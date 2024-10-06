package com.example.Fallstudie.controller;

import com.example.Fallstudie.DTO.BudgetDetailsDTO;
import com.example.Fallstudie.config.JwtTokenUtil;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.service.BudgetService;
import com.example.Fallstudie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserService userService; // Annahme: UserService existiert

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // GET Budget by Finance
    @GetMapping("/finance/{userId}")
    public ResponseEntity<List<BudgetDetailsDTO>> getBudgetsByFinance(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if(userOpt.isPresent()) {
            List<Budget> budgets = budgetService.getBudgetByFinance(userOpt.get());
            return getListResponseEntity(budgets);
        }
        return ResponseEntity.notFound().build();
    }

    // SET Budget by Finance
    @PutMapping("/{id}")
    public ResponseEntity<BudgetDetailsDTO> updateBudget(@PathVariable Long id, @RequestBody Budget budgetDetails) {
        Optional<Budget> budgetOpt = budgetService.getBudgetById(id);
        if(budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();

            // Aktualisiere Felder
            budget.setName(budgetDetails.getName());
            budget.setBudgetBetrag(budgetDetails.getBudgetBetrag());
            // Weitere Felder nach Bedarf

            // Aktualisiertes Budget speichern
            Budget updatedBudget = budgetService.updateBudget(id, budget, budget.getErsteller().getId());

            // Konvertiere das aktualisierte Budget in ein DTO
            BudgetDetailsDTO dto = new BudgetDetailsDTO();
            dto.setId(updatedBudget.getId());
            dto.setName(updatedBudget.getName());
            dto.setAvailableBudget(updatedBudget.getBudgetBetrag());

            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    // CREATE new Budget
    @PostMapping
    public ResponseEntity<BudgetDetailsDTO> createBudget(@RequestBody Budget budget, @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Authorization header");
        }
        String token = authorizationHeader.substring(7); // Entfernt das "Bearer " Präfix
        String userEmail = jwtTokenUtil.extractEmail(authorizationHeader);
        Long userId = userService.getUserByEmail(userEmail).getId();

        // Erstelle das Budget
        Budget createdBudget = budgetService.createNewBudget(budget, userId);

        // Konvertiere das erstellte Budget in ein DTO
        BudgetDetailsDTO dto = new BudgetDetailsDTO();
        dto.setId(createdBudget.getId());
        dto.setName(createdBudget.getName());
        dto.setAvailableBudget(createdBudget.getBudgetBetrag());

        return ResponseEntity.ok(dto);
    }


    // GET Budget by Manager
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<BudgetDetailsDTO>> getBudgetsByManager(@PathVariable Long managerId) {
        Optional<User> managerOpt = userService.getUserById(managerId);
        if(managerOpt.isPresent()) {
            List<Budget> budgets = budgetService.getBudgetByManager(managerOpt.get());
            return getListResponseEntity(budgets);
        }
        return ResponseEntity.notFound().build();
    }

    // GET Budget by Owner
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<BudgetDetailsDTO>> getBudgetsByOwner(@PathVariable Long ownerId) {
        Optional<User> ownerOpt = userService.getUserById(ownerId);
        if(ownerOpt.isPresent()) {
            List<Budget> budgets = budgetService.getBudgetByOwner(ownerOpt.get());
            return getListResponseEntity(budgets);
        }
        return ResponseEntity.notFound().build();
    }




    // GET Budget by Name
    @GetMapping("/name/{name}")
    public ResponseEntity<BudgetDetailsDTO> getBudgetByName(@PathVariable String name) {
        Optional<Budget> budgetOpt = budgetService.getBudgetByName(name);
        if(budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            BudgetDetailsDTO dto = new BudgetDetailsDTO();
            dto.setId(budget.getId());
            dto.setName(budget.getName());
            dto.setAvailableBudget(budget.getBudgetBetrag());
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    // GET All Budgets
    @GetMapping
    public ResponseEntity<List<BudgetDetailsDTO>> getAllBudgets() {
            return getListResponseEntity(budgetService.getAllBudgets());
    }


    @PutMapping("/{id}/approve")
    public ResponseEntity<BudgetDetailsDTO> approveBudget(@PathVariable Long id, @RequestParam Long managerId) {
        Optional<User> managerOpt = userService.getUserById(managerId);
        if(managerOpt.isPresent()) {
            Budget approvedBudget = budgetService.approveBudget(id, managerOpt.get());

            BudgetDetailsDTO dto = new BudgetDetailsDTO();
            dto.setId(approvedBudget.getId());
            dto.setName(approvedBudget.getName());
            dto.setAvailableBudget(approvedBudget.getBudgetBetrag());

            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }


    private ResponseEntity<List<BudgetDetailsDTO>> getListResponseEntity(List<Budget> budgets) {
        List<BudgetDetailsDTO> budgetDetailsDTOList = budgets.stream().map(budget -> {
            BudgetDetailsDTO dto = new BudgetDetailsDTO();
            dto.setId(budget.getId());
            dto.setName(budget.getName());
            dto.setAvailableBudget(budget.getBudgetBetrag());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(budgetDetailsDTOList);
    }

}
