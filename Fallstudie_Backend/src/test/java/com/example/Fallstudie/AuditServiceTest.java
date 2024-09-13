package com.example.Fallstudie;

import com.example.Fallstudie.Service.AuditService;
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
public class AuditServiceTest {

    @Autowired
    private AuditService auditService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @Test
    public void testFindOverBudget() {
        // Benutzer und Budget erstellen
        User owner = new User();
        owner.setUsername("auditowner");
        owner.setPassword("password");
        owner.setEmail("auditowner@example.com");

        Role role = new Role();
        role.setName("OWNER");
        owner.getRoles().add(role);

        userService.save(owner);

        Budget budget = new Budget();
        budget.setName("AuditBudget");
        budget.setAmount(BigDecimal.valueOf(10000));
        budget.setExpiryDate(LocalDate.now().plusMonths(6));
        budget.setOwner(owner);
        budgetService.createBudget(budget);

        // Ausgaben hinzufügen, um das Budget zu überschreiten
        Expense expense1 = new Expense();
        expense1.setAmount(BigDecimal.valueOf(6000));
        expense1.setDate(LocalDate.now());
        expense1.setDescription("Ausgabe 1");
        expense1.setBudget(budget);
        expenseService.addExpense(expense1);

        Expense expense2 = new Expense();
        expense2.setAmount(BigDecimal.valueOf(5000));
        expense2.setDate(LocalDate.now());
        expense2.setDescription("Ausgabe 2");
        expense2.setBudget(budget);
        expenseService.addExpense(expense2);

        // Prüfung auf Budgetüberschreitung
        List<Budget> overBudgetList = auditService.findOverBudget();
        assertTrue(overBudgetList.contains(budget));
    }
}
