package com.example.Fallstudie.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ist")

public class Ist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id")
    private Budget budget;

    private Double betrag;
    private LocalDateTime timestamp;

    @ManyToOne (cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Person, die es verändert hat

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

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }

    public Double getBetrag() {
        return betrag;
    }

    public void setBetrag(Double betrag) {
        this.betrag = betrag;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


}
