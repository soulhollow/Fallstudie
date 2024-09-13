package com.example.Fallstudie;


import com.example.Fallstudie.Service.BudgetService;
import com.example.Fallstudie.Service.UserService;
import com.example.Fallstudie.model.Budget;
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
public class BudgetServiceTest {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserService userService;

    @Test
    public void testCreateAndApproveBudget() {
        User owner = new User();
        owner.setUsername("budgetowner");
        owner.setPassword("password");
        owner.setEmail("owner@example.com");

        Role role = new Role();
        role.setName("OWNER");
        owner.getRoles().add(role);

        userService.save(owner);

        Budget budget = new Budget();
        budget.setName("Testbudget");
        budget.setAmount(BigDecimal.valueOf(10000));
        budget.setExpiryDate(LocalDate.now().plusMonths(6));
        budget.setOwner(owner);

        Budget createdBudget = budgetService.createBudget(budget);
        assertNotNull(createdBudget.getId());
        assertFalse(createdBudget.isApproved());

        // Budget genehmigen
        Budget approvedBudget = budgetService.approveBudget(createdBudget.getId());
        assertTrue(approvedBudget.isApproved());
    }

    @Test
    public void testGetBudgetsByOwner() {
        User owner = new User();
        owner.setUsername("owner2");
        owner.setPassword("password");
        owner.setEmail("owner2@example.com");

        Role role = new Role();
        role.setName("OWNER");
        owner.getRoles().add(role);

        userService.save(owner);

        Budget budget1 = new Budget();
        budget1.setName("Budget1");
        budget1.setAmount(BigDecimal.valueOf(5000));
        budget1.setExpiryDate(LocalDate.now().plusMonths(3));
        budget1.setOwner(owner);
        budgetService.createBudget(budget1);

        Budget budget2 = new Budget();
        budget2.setName("Budget2");
        budget2.setAmount(BigDecimal.valueOf(8000));
        budget2.setExpiryDate(LocalDate.now().plusMonths(6));
        budget2.setOwner(owner);
        budgetService.createBudget(budget2);

        List<Budget> budgets = budgetService.getBudgetsByOwner(owner);
        assertEquals(2, budgets.size());
    }
}
