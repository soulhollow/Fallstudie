package com.example.Fallstudie.repository;

import com.example.Fallstudie.model.Soll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SollRepository extends JpaRepository<Soll, Long> {
    List<Soll> findByBudgetId(Long budgetId);
}
