package com.example.Fallstudie.Repository;

import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByBudget(Budget budget);
}
