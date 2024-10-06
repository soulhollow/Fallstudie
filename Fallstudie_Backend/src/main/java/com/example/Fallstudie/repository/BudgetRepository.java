package com.example.Fallstudie.repository;

import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByErsteller(User ersteller);
    List<Budget> findByManager(User manager);
    List<Budget> findByOwner(User owner);
    Optional<Budget> findByName(String name);
    List<Budget> findByManagerAndApprovedFalse(User manager);
    List<Budget> findByManagerAndBooleanForecastTrue(User manager);
}
