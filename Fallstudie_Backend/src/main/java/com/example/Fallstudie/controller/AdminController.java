package com.example.Fallstudie.controller;

import com.example.Fallstudie.DTO.UserDTO;
import com.example.Fallstudie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    // Benutzer erstellen
    @PostMapping("/users")
    public ResponseEntity<UserDTO> createNewUser(@RequestBody UserDTO userDTO) {
        UserDTO savedUserDTO = userService.createNewUser(userDTO);
        return ResponseEntity.ok(savedUserDTO);
    }

    // Alle Benutzer abrufen
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> userDTOs = userService.getAllUsers();
        return ResponseEntity.ok(userDTOs);
    }

    // Benutzer per ID abrufen
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Benutzer aktualisieren
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return userService.updateUser(id, userDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Benutzer per Authentifizierung abrufen (z.B. aktueller User)
    @GetMapping("/users/current")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            UserDTO userDTO = userService.getCurrentUserByToken(authorizationHeader);
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Benutzer per E-Mail abrufen
    @GetMapping("/users/email")
    public ResponseEntity<UserDTO> getUserByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }
}
