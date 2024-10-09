package com.example.Fallstudie.DTO;

import java.time.LocalDateTime;


public class AuditLogDTO {
    private String timestamp;
    private Long userId;
    private String action;
    private String entity;

    public AuditLogDTO(String timestamp, Long userId, String action, String entity) {
        this.timestamp = timestamp;
        this.userId = userId;
        this.action = action;
        this.entity = entity;
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

}
