package com.example.Fallstudie.Service;

import com.example.Fallstudie.Repository.ForecastRepository;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Forecast;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForecastService {

    @Autowired
    private ForecastRepository forecastRepository;

    public Forecast addForecast(Forecast forecast) {
        return forecastRepository.save(forecast);
    }

    public List<Forecast> getForecastsByBudget(Budget budget) {
        return forecastRepository.findByBudget(budget);
    }

    public List<Forecast> getAllForecasts() {
        return forecastRepository.findAll();
    }

}
