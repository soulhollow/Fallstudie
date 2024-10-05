package com.example.Fallstudie.service;


import com.example.Fallstudie.DTO.AuditLogDTO;
import com.example.Fallstudie.exception.ResourceNotFoundException;
import com.example.Fallstudie.model.Ist;
import com.example.Fallstudie.repository.IstRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IstService {

    @Autowired
    private IstRepository istRepository;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Erstellt einen neuen Ist-Eintrag und fügt einen Audit-Log-Eintrag hinzu.
     *
     * @param ist Ist-Objekt
     * @param userId ID des Benutzers, der den Ist-Eintrag erstellt
     * @return Erstellteter Ist-Eintrag
     */
    public Ist createIst(Ist ist, Long userId) {
        Ist createdIst = istRepository.save(ist);
        auditLogService.addAuditLog(userId, "CREATE", "Ist", createdIst.getId());
        return createdIst;
    }

    /**
     * Aktualisiert einen bestehenden Ist-Eintrag und fügt einen Audit-Log-Eintrag hinzu.
     *
     * @param id ID des zu aktualisierenden Ist-Eintrags
     * @param istDetails Neue Ist-Daten
     * @param userId ID des Benutzers, der den Ist-Eintrag aktualisiert
     * @return Aktualisierter Ist-Eintrag
     */
    public Ist updateIst(Long id, Ist istDetails, Long userId) {
        Ist ist = istRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ist not found for this id :: " + id));

        ist.setName(istDetails.getName());
        ist.setBetrag(istDetails.getBetrag());
        // Weitere Felder nach Bedarf aktualisieren

        Ist updatedIst = istRepository.save(ist);
        auditLogService.addAuditLog(userId, "UPDATE", "Ist", updatedIst.getId());
        return updatedIst;
    }

    // Weitere Methoden ...
}
