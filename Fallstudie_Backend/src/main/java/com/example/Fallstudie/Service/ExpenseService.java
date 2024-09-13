package com.example.Fallstudie.Service;

import com.example.Fallstudie.Repository.ExpenseRepository;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByBudget(Budget budget) {
        return expenseRepository.findByBudget(budget);
    }

    // Weitere Methoden
}
