package com.example.Fallstudie.service;

import com.example.Fallstudie.DTO.BudgetDetailsDTO;
import com.example.Fallstudie.DTO.UserDTO;
import com.example.Fallstudie.exception.ResourceNotFoundException;
import com.example.Fallstudie.exception.UserNotFoundException;
import com.example.Fallstudie.model.Budget;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;


    @Autowired
    private UserService userService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    // Methode zur Umwandlung eines Budget-Models in ein DTO
    private BudgetDetailsDTO convertToDTO(Budget budget) {
        BudgetDetailsDTO dto = new BudgetDetailsDTO();
        dto.setId(budget.getId());
        dto.setName(budget.getName());
        dto.setAvailableBudget(budget.getBudgetBetrag());

        // Owner und Manager können null sein
        dto.setOwner(budget.getOwner() != null ? userService.convertToDTO(budget.getOwner()) : null);
        dto.setManager(budget.getManager() != null ? userService.convertToDTO(budget.getManager()) : null);

        // Finance (Ersteller) kann null sein
        dto.setFinance(budget.getErsteller() != null ? userService.convertToDTO(budget.getErsteller()) : null);

        // Timestamp kann null sein
        dto.setTimestamp(budget.getTimestamp() != null ? budget.getTimestamp().format(FORMATTER) : null);

        // Approved kann null sein
        dto.setApproved(budget.getApproved() != null ? budget.getApproved() : false);

        return dto;
    }


    // Methode zur Umwandlung eines DTOs in ein Budget-Model
    private Budget convertToEntity(BudgetDetailsDTO dto) {
        Budget budget = new Budget();
        budget.setName(dto.getName());
        budget.setBudgetBetrag(dto.getAvailableBudget());
        budget.setTimestamp(LocalDateTime.parse(dto.getTimestamp(), FORMATTER)); // String -> LocalDateTime
        budget.setApproved(dto.isApproved());
        // Überprüfe, ob der Owner existiert und lade ihn aus der Datenbank
        Optional<UserDTO> optionalOwner = userService.getUserById(dto.getOwner().getId());
        if (optionalOwner.isPresent()) {
            User owner = userService.convertToEntity(optionalOwner.get());  // Laden statt neu persistieren
            budget.setOwner(owner);
        } else {
            throw new UserNotFoundException("Owner not found with id: " + dto.getOwner().getId());
        }

        // Ähnlicher Ansatz für Manager und Finance
        Optional<UserDTO> optionalManager = userService.getUserById(dto.getManager().getId());
        if (optionalManager.isPresent()) {
            User manager = userService.convertToEntity(optionalManager.get());
            budget.setManager(manager);
        } else {
            throw new UserNotFoundException("Manager not found with id: " + dto.getManager().getId());
        }

        Optional<UserDTO> optionalFinance = userService.getUserById(dto.getFinance().getId());
        if (optionalFinance.isPresent()) {
            User finance = userService.convertToEntity(optionalFinance.get());
            budget.setErsteller(finance);
        } else {
            throw new UserNotFoundException("Finance not found with id: " + dto.getFinance().getId());
        }

        return budget;
    }


    public List<BudgetDetailsDTO> getBudgetByFinanceDTO(Long userId) {
        Optional<UserDTO> optionalUser = userService.getUserById(userId);
        if (optionalUser.isPresent()) {
            List<Budget> budgets = budgetRepository.findByErsteller(userService.convertToEntity(optionalUser.get()));
            return budgets.stream().map(this::convertToDTO).collect(Collectors.toList());
        } else {
            // Handle the case where the finance user is not found
            throw new UserNotFoundException("Finance user not found with id: " + userId);
        }
    }

    public BudgetDetailsDTO updateBudgetDTO(Long id, BudgetDetailsDTO budgetDetailsDTO) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found for this id :: " + id));

        // Name nur aktualisieren, wenn er nicht null ist
        if (budgetDetailsDTO.getName() != null) {
            budget.setName(budgetDetailsDTO.getName());
        }

        // BudgetBetrag nur aktualisieren, wenn er nicht null ist
        if (budgetDetailsDTO.getAvailableBudget() != null) {
            budget.setBudgetBetrag(budgetDetailsDTO.getAvailableBudget());
        }

        // Owner nur aktualisieren, wenn er nicht null ist
        if (budgetDetailsDTO.getOwner() != null && budgetDetailsDTO.getOwner().getId() != null) {
            Optional<UserDTO> optionalOwner = userService.getUserById(budgetDetailsDTO.getOwner().getId());
            if (optionalOwner.isPresent()) {
                budget.setOwner(userService.convertToEntity(optionalOwner.get()));
            } else {
                throw new UserNotFoundException("Owner not found with id: " + budgetDetailsDTO.getOwner().getId());
            }
        }

        // Manager nur aktualisieren, wenn er nicht null ist
        if (budgetDetailsDTO.getManager() != null && budgetDetailsDTO.getManager().getId() != null) {
            Optional<UserDTO> optionalManager = userService.getUserById(budgetDetailsDTO.getManager().getId());
            if (optionalManager.isPresent()) {
                budget.setManager(userService.convertToEntity(optionalManager.get()));
            } else {
                throw new UserNotFoundException("Manager not found with id: " + budgetDetailsDTO.getManager().getId());
            }
        }

        // Finance (Ersteller) nur aktualisieren, wenn er nicht null ist
        if (budgetDetailsDTO.getFinance() != null && budgetDetailsDTO.getFinance().getId() != null) {
            Optional<UserDTO> optionalFinance = userService.getUserById(budgetDetailsDTO.getFinance().getId());
            if (optionalFinance.isPresent()) {
                budget.setErsteller(userService.convertToEntity(optionalFinance.get()));
            } else {
                throw new UserNotFoundException("Finance not found with id: " + budgetDetailsDTO.getFinance().getId());
            }
        }

        // Aktualisiertes Budget speichern
        Budget updatedBudget = budgetRepository.save(budget);

        // Aktualisiertes DTO zurückgeben
        return convertToDTO(updatedBudget);
    }


    public BudgetDetailsDTO createNewBudgetDTO(BudgetDetailsDTO budgetDetailsDTO) {
        Budget budget = convertToEntity(budgetDetailsDTO);
        Budget createdBudget = budgetRepository.save(budget);
        return convertToDTO(createdBudget);
    }

    public List<BudgetDetailsDTO> getBudgetByManagerDTO(Long managerId) {
        Optional<UserDTO> optionalManager = userService.getUserById(managerId);
        if (optionalManager.isPresent()) {
            List<Budget> budgets = budgetRepository.findByManager(userService.convertToEntity(optionalManager.get()));
            return budgets.stream().map(this::convertToDTO).collect(Collectors.toList());
        } else {
            // Handle the case where the manager is not found
            throw new UserNotFoundException("Manager not found with id: " + managerId);
        }
    }

    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }

    public List<BudgetDetailsDTO> getBudgetByOwnerDTO(Long ownerId) {
        Optional<UserDTO> optionalOwner = userService.getUserById(ownerId);
        if (optionalOwner.isPresent()) {
            List<Budget> budgets = budgetRepository.findByOwner(userService.convertToEntity(optionalOwner.get()));
            return budgets.stream().map(this::convertToDTO).collect(Collectors.toList());
        } else {
            // Handle the case where the owner is not found
            throw new UserNotFoundException("Owner not found with id: " + ownerId);
        }
    }

    public BudgetDetailsDTO getBudgetByNameDTO(String name) {
        Budget budget = budgetRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with name: " + name));

        return convertToDTO(budget);
    }

    public List<BudgetDetailsDTO> getAllBudgetsDTO() {
        List<Budget> budgets = budgetRepository.findAll();
        return budgets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public BudgetDetailsDTO approveBudgetDTO(Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found for this id :: " + budgetId));
        budget.setApproved(true);
        Budget approvedBudget = budgetRepository.save(budget);

        return convertToDTO(approvedBudget);
    }
}
