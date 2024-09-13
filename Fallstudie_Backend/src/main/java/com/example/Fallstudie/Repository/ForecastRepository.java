package com.example.Fallstudie.Repository;

import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Forecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, Long> {
    List<Forecast> findByBudget(Budget budget);
}
