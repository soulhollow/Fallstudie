package com.example.Fallstudie.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class IstDTO {

    private Long id;
    private String name;
    private Double betrag;
    private String timestamp;
    private Long userId; // ID des Users, der die Änderung vorgenommen hat

    // Getter und Setter

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

    public Double getBetrag() {
        return betrag;
    }

    public void setBetrag(Double betrag) {
        this.betrag = betrag;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
