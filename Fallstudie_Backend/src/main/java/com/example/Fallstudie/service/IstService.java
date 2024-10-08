package com.example.Fallstudie.service;

import com.example.Fallstudie.DTO.IstDTO;
import com.example.Fallstudie.DTO.UserDTO;
import com.example.Fallstudie.exception.ResourceNotFoundException;
import com.example.Fallstudie.exception.UserNotFoundException;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Ist;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.repository.IstRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IstService {

    @Autowired
    private IstRepository istRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private UserService userService;

    @Autowired
    private BudgetService budgetService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Mapper-Methode: Ist -> IstDTO
    private IstDTO convertToDTO(Ist ist) {
        IstDTO dto = new IstDTO();
        dto.setId(ist.getId());
        dto.setName(ist.getName());
        dto.setBetrag(ist.getBetrag());
        dto.setTimestamp(ist.getTimestamp().format(FORMATTER)); // LocalDateTime -> String
        dto.setUserId(ist.getUser().getId());
        dto.setBudgetId(ist.getBudget().getId());
        return dto;
    }

    // Mapper-Methode: IstDTO -> Ist
    private Ist convertToEntity(IstDTO istDTO) {
        Ist ist = new Ist();
        ist.setId(istDTO.getId());
        ist.setName(istDTO.getName());
        ist.setBetrag(istDTO.getBetrag());
        ist.setTimestamp(LocalDateTime.parse(istDTO.getTimestamp(), FORMATTER)); // String -> LocalDateTime
        Optional<UserDTO> optionalUser = userService.getUserById(istDTO.getUserId());
        Optional<Budget> optionalBudget = budgetService.getBudgetById(istDTO.getBudgetId());
        if (optionalUser.isPresent()) {
            ist.setUser(userService.convertToEntity(optionalUser.get()));
        } else {
            // Handle the case where the user is not found
            throw new UserNotFoundException("User not found with id: " + istDTO.getUserId());
        }
        if (optionalBudget.isPresent()) {
            ist.setBudget(optionalBudget.get());
        } else {
            // Handle the case where the budget is not found
            throw new ResourceNotFoundException("Budget not found with id: " + istDTO.getBudgetId());
        }
        return ist;
    }

    public IstDTO createIst(IstDTO istDTO) {
        Ist ist = convertToEntity(istDTO);
        Ist savedIst = istRepository.save(ist);
        return convertToDTO(savedIst);
    }

    public IstDTO updateIst(Long id, IstDTO istDetails, Long userId) {
        Ist ist = istRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ist nicht gefunden für diese ID :: " + id));

        ist.setName(istDetails.getName());
        ist.setBetrag(istDetails.getBetrag());
        // Weitere Felder nach Bedarf aktualisieren

        Ist updatedIst = istRepository.save(ist);
        auditLogService.addAuditLog(userId, "UPDATE", "Ist", updatedIst.getId());
        return convertToDTO(updatedIst);
    }

    public List<IstDTO> getIstByBudget(Long budgetId) {
        List<Ist> istList = istRepository.findByBudgetId(budgetId);
        return istList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
}