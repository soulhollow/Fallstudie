package com.example.Fallstudie;

import com.example.Fallstudie.Service.BudgetService;
import com.example.Fallstudie.Service.ExpenseService;
import com.example.Fallstudie.Service.UserService;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Expense;
import com.example.Fallstudie.model.Role;
import com.example.Fallstudie.model.User;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.context.SpringBootTest;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@Transactional
public class ExpenseServiceTest {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserService userService;

    @Test
    public void testAddExpense() {
        User owner = new User();
        owner.setUsername("expenseowner");
        owner.setPassword("password");
        owner.setEmail("expenseowner@example.com");

        Role role = new Role();
        role.setName("OWNER");
        owner.getRoles().add(role);

        userService.save(owner);

        Budget budget = new Budget();
        budget.setName("ExpenseBudget");
        budget.setAmount(BigDecimal.valueOf(20000));
        budget.setExpiryDate(LocalDate.now().plusMonths(12));
        budget.setOwner(owner);
        budgetService.createBudget(budget);

        Expense expense = new Expense();
        expense.setAmount(BigDecimal.valueOf(3000));
        expense.setDate(LocalDate.now());
        expense.setDescription("Erste Ausgabe");
        expense.setBudget(budget);

        Expense savedExpense = expenseService.addExpense(expense);
        assertNotNull(savedExpense.getId());
    }

    @Test
    public void testGetExpensesByBudget() {
        User owner = new User();
        owner.setUsername("expenseowner");
        owner.setPassword("password");
        owner.setEmail("expenseowner@example.com");

        Role role = new Role();
        role.setName("OWNER");
        owner.getRoles().add(role);

        userService.save(owner);

        Budget budget = new Budget();
        budget.setName("ExpenseBudget");
        budget.setAmount(BigDecimal.valueOf(20000));
        budget.setExpiryDate(LocalDate.now().plusMonths(12));
        budget.setOwner(owner);
        budgetService.createBudget(budget);

        Expense expense = new Expense();
        expense.setAmount(BigDecimal.valueOf(3000));
        expense.setDate(LocalDate.now());
        expense.setDescription("Erste Ausgabe");
        expense.setBudget(budget);

        Expense savedExpense = expenseService.addExpense(expense);
        assertNotNull(savedExpense.getId());

        // Abrufen der Ausgaben
        List<Expense> expenses = expenseService.getExpensesByBudget(budget);
        assertEquals(1, expenses.size());
    }
}
