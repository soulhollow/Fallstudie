package com.example.Fallstudie.controller;

import com.example.Fallstudie.config.JwtTokenUtil;
import com.example.Fallstudie.model.Ist;
import com.example.Fallstudie.service.IstService;
import com.example.Fallstudie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Ist> createIst(@RequestBody Ist ist, @RequestHeader("Authorization") String authorizationHeader) {
        String userEmail = jwtTokenUtil.extractEmail(authorizationHeader);
        Long userId = userService.getUserByEmail(userEmail).getId();
        Ist createdIst = istService.createIst(ist);
        return ResponseEntity.ok(createdIst);
    }


    /**
     * UPDATE Ist
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ist> updateIst(
            @PathVariable Long id,
            @RequestBody Ist istDetails,
            Authentication authentication) {
        Long userId = userService.getUserIdFromAuthentication(authentication);
        Ist updatedIst = istService.updateIst(id, istDetails, userId);
        return ResponseEntity.ok(updatedIst);
    }

}
