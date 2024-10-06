package com.example.Fallstudie.service;


import com.example.Fallstudie.exception.ResourceNotFoundException;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Ist;
import com.example.Fallstudie.model.Soll;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.repository.BudgetRepository;
import jakarta.persistence.EntityGraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private SollService sollService;

    @Autowired
    private IstService istService;

    public List<Budget> getBudgetByFinance(User financeUser) {
        return budgetRepository.findByErsteller(financeUser);
    }

    public Budget createNewBudget(Budget budget, Long userId) {
        Budget createdBudget = budgetRepository.save(budget);
        auditLogService.addAuditLog(userId, "CREATE", "Budget", createdBudget.getId());
        return createdBudget;
    }

    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }

    public List<Budget> getAllBudgets() {

        return budgetRepository.findAll();
    }




    public List<Budget> getBudgetByManager(User manager) {
        return budgetRepository.findByManager(manager);
    }

    public List<Budget> getBudgetByOwner(User owner) {
        return budgetRepository.findByOwner(owner);
    }

    public Optional<Budget> getBudgetByName(String name) {
        return budgetRepository.findByName(name);
    }

    public List<Budget> getBudgetsAwaitingApproval(User manager) {
        return budgetRepository.findByManagerAndApprovedFalse(manager);
    }

    public List<Budget> getForecastBudgets(User manager) {
        return budgetRepository.findByManagerAndBooleanForecastTrue(manager);
    }

    public Budget updateBudget(Long id, Budget budgetDetails, Long userId) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found for this id :: " + id));

        budget.setName(budgetDetails.getName());
        budget.setStart(budgetDetails.getStart());
        budget.setEnde(budgetDetails.getEnde());
        budget.setApproved(budgetDetails.getApproved());
        budget.setBooleanForecast(budgetDetails.getBooleanForecast());
        // Weitere Felder nach Bedarf aktualisieren

        Budget updatedBudget = budgetRepository.save(budget);
        auditLogService.addAuditLog(userId, "UPDATE", "Budget", updatedBudget.getId());
        return updatedBudget;
    }

    // In BudgetService
    public Budget approveBudget(Long budgetId, User manager) {
        Optional<Budget> budgetOpt = budgetRepository.findById(budgetId);
        if(budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            budget.setApproved(true);
            budget.setTimestamp(LocalDateTime.now());
            // Auditlog hinzufügen
            // ...
            return budgetRepository.save(budget);
        }
        throw new ResourceNotFoundException("Budget not found");
    }

    public boolean isWarningNeeded(Long budgetId) {
        Optional<Budget> budgetOpt = budgetRepository.findById(budgetId);
        if(budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            double sollSum = budget.getSollList().stream().mapToDouble(Soll::getBetrag).sum();
            double istSum = budget.getIstList().stream().mapToDouble(Ist::getBetrag).sum();
            return istSum > 1.5 * sollSum;
        }
        return false;
    }



}
