package com.example.Fallstudie.controller;

import com.example.Fallstudie.DTO.SollDTO;
import com.example.Fallstudie.config.JwtTokenUtil;
import com.example.Fallstudie.service.SollService;
import com.example.Fallstudie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soll")
public class SollController {
    @Autowired
    private SollService sollService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * CREATE new Soll
     */
    @PostMapping
    public ResponseEntity<SollDTO> createSoll(@RequestBody SollDTO sollDTO, @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Token nach "Bearer " extrahieren
            String token = authorizationHeader.substring(7); // "Bearer " hat 7 Zeichen
            String userEmail = jwtTokenUtil.extractEmail(token); // Email aus dem Token extrahieren
            Long userId = userService.getUserByEmail(userEmail).getId();
            sollDTO.setUserId(userId);
            SollDTO createdSoll = sollService.createSoll(sollDTO);
            return ResponseEntity.ok(createdSoll);
        } else {
        // Falls der Header nicht das richtige Format hat, gib einen Fehler zurück
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * UPDATE Soll
     */
    @PutMapping("/{id}")
    public ResponseEntity<SollDTO> updateSoll(
            @PathVariable Long id,
            @RequestBody SollDTO sollDetails,
            Authentication authentication) {
        Long userId = userService.getUserIdFromAuthentication(authentication);
        SollDTO updatedSoll = sollService.updateSoll(id, sollDetails, userId);
        return ResponseEntity.ok(updatedSoll);
    }

    /**
     * GET Soll by Budget
     */
    @GetMapping("/budget/{budgetId}")
    public ResponseEntity<List<SollDTO>> getSollByBudget(@PathVariable Long budgetId) {
        List<SollDTO> sollList = sollService.getSollByBudget(budgetId);
        return ResponseEntity.ok(sollList);
    }
}
