package com.example.Fallstudie.repository;

import com.example.Fallstudie.model.Ist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IstRepository extends JpaRepository<Ist, Long> {
    List<Ist> findByBudgetId(Long budgetId);
}
