package com.example.Fallstudie.DTO;

import com.example.Fallstudie.model.Ist;
import com.example.Fallstudie.model.Soll;

import java.util.List;


public class BudgetDetailsDTO {
    private Long id;
    private String name;
    private Double availableBudget;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getAvailableBudget() {
        return availableBudget;
    }

    public void setAvailableBudget(Double availableBudget) {
        this.availableBudget = availableBudget;
    }
}
