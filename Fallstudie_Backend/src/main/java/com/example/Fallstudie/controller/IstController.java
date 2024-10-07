package com.example.Fallstudie.controller;

import com.example.Fallstudie.DTO.IstDTO;
import com.example.Fallstudie.config.JwtTokenUtil;
import com.example.Fallstudie.service.IstService;
import com.example.Fallstudie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ist")
public class IstController {

    @Autowired
    private IstService istService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * CREATE new Ist
     */
    @PostMapping
    public ResponseEntity<IstDTO> createIst(@RequestBody IstDTO istDTO, @RequestHeader("Authorization") String authorizationHeader) {
        // Überprüfen, ob der Header mit "Bearer " beginnt
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Token nach "Bearer " extrahieren
            String token = authorizationHeader.substring(7); // "Bearer " hat 7 Zeichen
            String userEmail = jwtTokenUtil.extractEmail(token); // Email aus dem Token extrahieren
            Long userId = userService.getUserByEmail(userEmail).getId();
            istDTO.setUserId(userId);
            IstDTO createdIst = istService.createIst(istDTO);
            return ResponseEntity.ok(createdIst);
        } else {
            // Falls der Header nicht das richtige Format hat, gib einen Fehler zurück
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * UPDATE Ist
     */
    @PutMapping("/{id}")
    public ResponseEntity<IstDTO> updateIst(
            @PathVariable Long id,
            @RequestBody IstDTO istDetails,
            Authentication authentication) {
        Long userId = userService.getUserIdFromAuthentication(authentication);
        IstDTO updatedIst = istService.updateIst(id, istDetails, userId);
        return ResponseEntity.ok(updatedIst);
    }

    /**
     * GET Ist by Budget
     */
    @GetMapping("/budget/{budgetId}")
    public ResponseEntity<List<IstDTO>> getIstByBudget(@PathVariable Long budgetId) {
        System.out.println("budgetId: " + budgetId);
        List<IstDTO> istList = istService.getIstByBudget(budgetId);
        return ResponseEntity.ok(istList);
    }
}
