

package com.example.Fallstudie.Service;

import com.example.Fallstudie.Repository.BudgetRepository;
import com.example.Fallstudie.Repository.ExpenseRepository;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuditService {

    @Autowired
    private BudgetRepository budgetRepository;
    @Autowired
    private ExpenseRepository expenseRepository;

    // Überschreiten von Budgets erkennen
    public List<Budget> findOverBudget() {
        List<Budget> overBudgetList = new ArrayList<>();
        List<Budget> budgets = budgetRepository.findAll();

        for (Budget budget : budgets) {
            BigDecimal totalExpenses = expenseRepository.findByBudget(budget)
                    .stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (totalExpenses.compareTo(budget.getAmount()) > 0) {
                overBudgetList.add(budget);
            }
        }
        return overBudgetList;
    }

    // Weitere Regeln implementieren
}