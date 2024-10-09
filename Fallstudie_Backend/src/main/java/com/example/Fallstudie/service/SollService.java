package com.example.Fallstudie.service;

import com.example.Fallstudie.DTO.SollDTO;
import com.example.Fallstudie.DTO.UserDTO;
import com.example.Fallstudie.exception.ResourceNotFoundException;
import com.example.Fallstudie.exception.UserNotFoundException;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.Soll;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.repository.SollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SollService {

    @Autowired
    private SollRepository sollRepository;



    @Autowired
    private UserService userService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    @Autowired
    private BudgetService budgetService;

    // Mapper-Methode: Soll -> SollDTO
    private SollDTO convertToDTO(Soll soll) {
        SollDTO dto = new SollDTO();

        dto.setId(soll.getId());  // primitive long oder null-sicherer Typ
        dto.setName(soll.getName());  // String, kann null sein

        if (soll.getBetrag() != null) {
            dto.setBetrag(soll.getBetrag());
        } else {
            dto.setBetrag(null);
        }

        if (soll.getTimestamp() != null) {
            dto.setTimestamp(soll.getTimestamp().format(FORMATTER));  // LocalDateTime -> String
        } else {
            dto.setTimestamp(null);
        }

        if (soll.getUser() != null && soll.getUser().getId() != null) {
            dto.setUserId(soll.getUser().getId());
        } else {
            dto.setUserId(null);
        }

        if (soll.getBudget() != null && soll.getBudget().getId() != null) {
            dto.setBudgetId(soll.getBudget().getId());
        } else {
            dto.setBudgetId(null);
        }

        return dto;
    }


    // Mapper-Methode: SollDTO -> Soll
    private Soll convertToEntity(SollDTO sollDTO) {
        Soll soll = new Soll();
        soll.setId((long)1); //random nummer muss aber gesetzt werden
        soll.setName(sollDTO.getName());
        soll.setBetrag(sollDTO.getBetrag());
        soll.setTimestamp(LocalDateTime.parse(sollDTO.getTimestamp(), FORMATTER)); // String -> LocalDateTime
        Optional<UserDTO> optionalUser = userService.getUserById(sollDTO.getUserId());
        Optional<Budget> optionalBudget = budgetService.getBudgetById(sollDTO.getBudgetId());
        if (optionalUser.isPresent()) {
            soll.setUser(userService.convertToEntity(optionalUser.get()));
        } else {
            // Handle the case where the user is not found
            throw new UserNotFoundException("User not found with id: " + sollDTO.getUserId());
        }
        if (optionalBudget.isPresent()) {
            soll.setBudget(optionalBudget.get());
        } else {
            // Handle the case where the budget is not found
            throw new ResourceNotFoundException("Budget not found with id: " + sollDTO.getBudgetId());
        }
        return soll;
    }

    public SollDTO createSoll(SollDTO sollDTO) {
        Soll soll = convertToEntity(sollDTO);
        Soll savedSoll = sollRepository.save(soll);
        return convertToDTO(savedSoll);
    }

    public SollDTO updateSoll(Long id, SollDTO sollDetails, Long userId) {
        Soll soll = sollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soll nicht gefunden für diese ID :: " + id));

        soll.setName(sollDetails.getName());
        soll.setBetrag(sollDetails.getBetrag());
        // Weitere Felder nach Bedarf aktualisieren

        Soll updatedSoll = sollRepository.save(soll);
        return convertToDTO(updatedSoll);
    }

    public List<SollDTO> getSollByBudget(Long budgetId) {
        List<Soll> sollList = sollRepository.findByBudgetId(budgetId);
        return sollList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<SollDTO> getAllSollDTO() {
        List<Soll> sollList = sollRepository.findAll();
        return sollList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
}