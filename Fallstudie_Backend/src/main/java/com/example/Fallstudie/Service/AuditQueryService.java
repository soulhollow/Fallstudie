package com.example.Fallstudie.Service;

import com.example.Fallstudie.Repository.AuditRepository;
import com.example.Fallstudie.model.AuditEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditQueryService {

    @Autowired
    private AuditRepository auditRepository;

    public List<Long> getRevisions(String entityName, Long entityId) {
        return auditRepository.findByEntityNameAndEntityIdOrderByRevisionDateAsc(entityName, entityId);
    }

    public AuditEntity getEntityAtRevision(String entityName, Long entityId, Long revisionId) {
        return auditRepository.findById(revisionId)
                .orElseThrow(() -> new RuntimeException("Revision not found"));
    }
}
