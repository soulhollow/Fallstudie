package com.example.Fallstudie.DTO;

import java.time.LocalDateTime;


public class AuditLogDTO {
    private LocalDateTime timestamp;
    private Long userId;
    private String action;
    private String entity;
    private Long entityId;

    public AuditLogDTO(LocalDateTime timestamp, Long userId, String action, String entity, Long entityId) {
        this.timestamp = timestamp;
        this.userId = userId;
        this.action = action;
        this.entity = entity;
        this.entityId = entityId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
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

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }
}
