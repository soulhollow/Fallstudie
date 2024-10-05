package com.example.Fallstudie.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "budget")

public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "ersteller_id")
    private User ersteller; // "Finance"

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    private LocalDateTime start;
    private LocalDateTime ende;

    @OneToMany
    @JoinColumn(name = "soll_id")
    private List<Soll> sollList;

    @OneToMany
    @JoinColumn(name = "ist_id")
    private List<Ist> istList;

    private Boolean approved;
    private LocalDateTime timestamp;
    private Boolean booleanForecast;
    private double budgetBetrag;

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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public User getErsteller() {
        return ersteller;
    }

    public void setErsteller(User ersteller) {
        this.ersteller = ersteller;
    }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnde() {
        return ende;
    }

    public void setEnde(LocalDateTime ende) {
        this.ende = ende;
    }

    public List<Soll> getSollList() {
        return sollList;
    }

    public void setSollList(List<Soll> sollList) {
        this.sollList = sollList;
    }

    public List<Ist> getIstList() {
        return istList;
    }

    public void setIstList(List<Ist> istList) {
        this.istList = istList;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getBooleanForecast() {
        return booleanForecast;
    }

    public void setBooleanForecast(Boolean booleanForecast) {
        this.booleanForecast = booleanForecast;
    }

    public double getBudgetBetrag() {
        return budgetBetrag;
    }

    public void setBudgetBetrag(double budgetBetrag) {
        this.budgetBetrag = budgetBetrag;
    }
}
