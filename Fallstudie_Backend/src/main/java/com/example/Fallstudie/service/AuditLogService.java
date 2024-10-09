package com.example.Fallstudie.service;

import com.example.Fallstudie.DTO.AuditLogDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AuditLogService {

    @Autowired
    private BudgetService budgetService;

    private final List<AuditLogDTO> auditLogs = new CopyOnWriteArrayList<>();
    @Autowired
    private SollService sollService;

    @Autowired
    private IstService istService;

    /**
     * Fügt einen neuen Audit-Log-Eintrag hinzu.
     *
     * @param userId ID des Benutzers, der die Änderung vorgenommen hat
     * @param action Beschreibung der Aktion
     * @param entity Name der betroffenen Entität (z.B. Budget, Soll, Ist)
     * @param timestamp Zeit der erstellung
     */
    public void addAuditLog(Long userId, String action, String entity, String timestamp) {
        AuditLogDTO log = new AuditLogDTO(
                LocalDateTime.parse(timestamp),
                userId,
                action,
                entity,
        );
        auditLogs.add(log);
    }

    /**
     * Gibt alle Audit-Logs zurück.
     *
     * @return Liste der Audit-Logs
     */
    public List<AuditLogDTO> getAllAuditLogs() {
        budgetService.getAllBudgetsDTO().forEach(budget -> {
            addAuditLog(budget.getFinance().getId(), "Budget created", "Budget", budget.getTimestamp());
        });
        sollService.getAllSollDTO().forEach(sollDTO -> {
            addAuditLog(sollDTO.getUserId(), "Soll created", "Soll", sollDTO.getTimestamp());
        });
        istService.getAllIstDTO().forEach(istDTO -> {
            addAuditLog(istDTO.getUserId(), "Ist created", "Ist", istDTO.getTimestamp());
        });

        return auditLogs;
    }
}
