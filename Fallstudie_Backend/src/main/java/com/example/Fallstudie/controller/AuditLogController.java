package com.example.Fallstudie.controller;



import com.example.Fallstudie.DTO.AuditLogDTO;
import com.example.Fallstudie.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Gibt alle Audit-Logs zurück.
     *
     * @return Liste der Audit-Logs
     */
    @GetMapping
    public ResponseEntity<List<AuditLogDTO>> getAllAuditLogs() {
        List<AuditLogDTO> logs = auditLogService.getAllAuditLogs();

        return ResponseEntity.ok(logs);
    }
}
