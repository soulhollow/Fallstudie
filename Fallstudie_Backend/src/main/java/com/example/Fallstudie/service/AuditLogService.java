package com.example.Fallstudie.service;

import com.example.Fallstudie.DTO.AuditLogDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AuditLogService {

    private final List<AuditLogDTO> auditLogs = new CopyOnWriteArrayList<>();

    /**
     * Fügt einen neuen Audit-Log-Eintrag hinzu.
     *
     * @param userId ID des Benutzers, der die Änderung vorgenommen hat
     * @param action Beschreibung der Aktion
     * @param entity Name der betroffenen Entität (z.B. Budget, Soll, Ist)
     * @param entityId ID der betroffenen Entität
     */
    public void addAuditLog(Long userId, String action, String entity, Long entityId) {
        AuditLogDTO log = new AuditLogDTO(
                LocalDateTime.now(),
                userId,
                action,
                entity,
                entityId
        );
        auditLogs.add(log);
    }

    /**
     * Gibt alle Audit-Logs zurück.
     *
     * @return Liste der Audit-Logs
     */
    public List<AuditLogDTO> getAllAuditLogs() {
        return auditLogs;
    }
}
