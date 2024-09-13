package com.example.Fallstudie.Service;

import com.example.Fallstudie.Repository.BudgetRepository;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public Budget createBudget(Budget budget) {
        budget.setApproved(false); // Muss genehmigt werden
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgetsByOwner(User owner) {
        return budgetRepository.findByOwner(owner);
    }

    public Budget approveBudget(Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new EntityNotFoundException("Budget nicht gefunden"));
        budget.setApproved(true);
        return budgetRepository.save(budget);
    }
    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget nicht gefunden"));
    }

}
