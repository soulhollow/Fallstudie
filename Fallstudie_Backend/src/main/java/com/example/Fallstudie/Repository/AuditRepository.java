package com.example.Fallstudie.Repository;

import com.example.Fallstudie.model.AuditEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditRepository extends JpaRepository<AuditEntity, Long> {
    List<Long> findByEntityNameAndEntityIdOrderByRevisionDateAsc(String entityName, Long entityId);
}
