package com.example.Fallstudie.service;


import com.example.Fallstudie.DTO.AuditLogDTO;
import com.example.Fallstudie.exception.ResourceNotFoundException;
import com.example.Fallstudie.model.Soll;
import com.example.Fallstudie.repository.SollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SollService {

    @Autowired
    private SollRepository sollRepository;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Erstellt einen neuen Soll-Eintrag und fügt einen Audit-Log-Eintrag hinzu.
     *
     * @param soll Soll-Objekt
     * @param userId ID des Benutzers, der den Soll-Eintrag erstellt
     * @return Erstellteter Soll-Eintrag
     */
    public Soll createSoll(Soll soll, Long userId) {
        Soll createdSoll = sollRepository.save(soll);
        auditLogService.addAuditLog(userId, "CREATE", "Soll", createdSoll.getId());
        return createdSoll;
    }

    /**
     * Aktualisiert einen bestehenden Soll-Eintrag und fügt einen Audit-Log-Eintrag hinzu.
     *
     * @param id ID des zu aktualisierenden Soll-Eintrags
     * @param sollDetails Neue Soll-Daten
     * @param userId ID des Benutzers, der den Soll-Eintrag aktualisiert
     * @return Aktualisierter Soll-Eintrag
     */
    public Soll updateSoll(Long id, Soll sollDetails, Long userId) {
        Soll soll = sollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soll not found for this id :: " + id));

        soll.setName(sollDetails.getName());
        soll.setBetrag(sollDetails.getBetrag());
        // Weitere Felder nach Bedarf aktualisieren

        Soll updatedSoll = sollRepository.save(soll);
        auditLogService.addAuditLog(userId, "UPDATE", "Soll", updatedSoll.getId());
        return updatedSoll;
    }

    // Weitere Methoden ...
}
