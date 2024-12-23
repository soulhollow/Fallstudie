package com.example.Fallstudie.DTO;

import com.example.Fallstudie.model.Ist;
import com.example.Fallstudie.model.Soll;
import com.example.Fallstudie.model.User;

import java.util.List;


public class BudgetDetailsDTO {
    private Long id;
    private String name;
    private Double availableBudget;
    private UserDTO owner;
    private UserDTO finance;
    private UserDTO manager;
    private String timestamp;
    private boolean approved;
    private boolean forecast;

    public boolean isForecast() {
        return forecast;
    }

    public void setForecast(boolean forecast) {
        this.forecast = forecast;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public UserDTO getFinance() {
        return finance;
    }

    public void setFinance(UserDTO finance) {
        this.finance = finance;
    }

    public UserDTO getManager() {
        return manager;
    }

    public void setManager(UserDTO manager) {
        this.manager = manager;
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
