package com.example.Fallstudie;

import com.example.Fallstudie.Service.BudgetService;
import com.example.Fallstudie.Service.ForecastService;
import com.example.Fallstudie.Service.UserService;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Forecast;
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
public class ForecastServiceTest {

    @Autowired
    private ForecastService forecastService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserService userService;

    @Test
    public void testAddForecast() {
        User owner = new User();
        owner.setUsername("forecastowner");
        owner.setPassword("password");
        owner.setEmail("forecastowner@example.com");

        Role role = new Role();
        role.setName("OWNER");
        owner.getRoles().add(role);

        userService.save(owner);

        Budget budget = new Budget();
        budget.setName("ForecastBudget");
        budget.setAmount(BigDecimal.valueOf(15000));
        budget.setExpiryDate(LocalDate.now().plusMonths(12));
        budget.setOwner(owner);
        budgetService.createBudget(budget);

        Forecast forecast = new Forecast();
        forecast.setAmount(BigDecimal.valueOf(5000));
        forecast.setDate(LocalDate.now().plusMonths(1));
        forecast.setDescription("Erster Forecast");
        forecast.setBudget(budget);

        Forecast savedForecast = forecastService.addForecast(forecast);
        assertNotNull(savedForecast.getId());
    }

    @Test
    public void testGetForecastsByBudget() {
        User owner = new User();
        owner.setUsername("forecastowner");
        owner.setPassword("password");
        owner.setEmail("forecastowner@example.com");

        Role role = new Role();
        role.setName("OWNER");
        owner.getRoles().add(role);

        userService.save(owner);

        Budget budget = new Budget();
        budget.setName("ForecastBudget");
        budget.setAmount(BigDecimal.valueOf(15000));
        budget.setExpiryDate(LocalDate.now().plusMonths(12));
        budget.setOwner(owner);
        budgetService.createBudget(budget);

        Forecast forecast = new Forecast();
        forecast.setAmount(BigDecimal.valueOf(5000));
        forecast.setDate(LocalDate.now().plusMonths(1));
        forecast.setDescription("Erster Forecast");
        forecast.setBudget(budget);

        // Speichere den Forecast in der Datenbank
        forecastService.addForecast(forecast);

        // Abrufen der Forecasts
        List<Forecast> forecasts = forecastService.getForecastsByBudget(budget);
        assertEquals(1, forecasts.size());
    }
}
