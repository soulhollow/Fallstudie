package com.example.Fallstudie.Repository;

import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByOwner(User owner);
}
