package com.example.Fallstudie.Controller;

import com.example.Fallstudie.Repository.AuditRepository;
import com.example.Fallstudie.model.AuditEntity;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.Service.AuditQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class TimeTravelController {

    @Autowired
    private AuditQueryService auditQueryService;

    @Autowired
    private AuditRepository auditRepository;

    @GetMapping("/budgets/{id}/revisions")
    public ResponseEntity<List<Long>> getBudgetRevisions(@PathVariable Long id) {
        List<Long> revisions = auditQueryService.getRevisions(Budget.class.getName(), id);
        return ResponseEntity.ok(revisions);
    }


    @GetMapping("/budgets/{id}/revisions/{revision}")
    public Budget getBudgetAtRevision(Long entityId, Long revisionId) {
        AuditEntity auditEntity = auditRepository.findById(revisionId)
                .orElseThrow(() -> new RuntimeException("Revision not found"));

        Budget budget = new Budget();
        budget.setId(auditEntity.getEntityId());
        budget.setName(auditEntity.getBudgetName());
        budget.setAmount(auditEntity.getBudgetAmount());

        return budget;
    }

}