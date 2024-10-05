package com.example.Fallstudie.controller;

import com.example.Fallstudie.config.JwtTokenUtil;
import com.example.Fallstudie.model.Soll;
import com.example.Fallstudie.service.SollService;
import com.example.Fallstudie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Soll> createSoll(@RequestBody Soll soll, @RequestHeader("Authorization") String authorizationHeader) {
        String userEmail = jwtTokenUtil.extractEmail(authorizationHeader);
        Long userId = userService.getUserByEmail(userEmail).getId();
        Soll createdSoll = sollService.createSoll(soll, userId);
        return ResponseEntity.ok(createdSoll);
    }


    /**
     * UPDATE Soll
     */
    @PutMapping("/{id}")
    public ResponseEntity<Soll> updateSoll(
            @PathVariable Long id,
            @RequestBody Soll sollDetails,
            Authentication authentication) {
        Long userId = userService.getUserIdFromAuthentication(authentication);
        Soll updatedSoll = sollService.updateSoll(id, sollDetails, userId);
        return ResponseEntity.ok(updatedSoll);
    }

}
