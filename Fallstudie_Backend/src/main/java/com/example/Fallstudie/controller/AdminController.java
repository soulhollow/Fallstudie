package com.example.Fallstudie.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.Fallstudie.DTO.UserDTO;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    // Benutzer erstellen
    @PostMapping("/users")
    public ResponseEntity<UserDTO> createNewUser(@RequestBody UserDTO userDTO) {
        User user = convertToEntity(userDTO);
        User savedUser = userService.createNewUser(user);
        UserDTO savedUserDTO = convertToDTO(savedUser);
        return ResponseEntity.ok(savedUserDTO);
    }

    // Alle Benutzer abrufen
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    // Benutzer per ID abrufen
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(u -> ResponseEntity.ok(convertToDTO(u))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Benutzer aktualisieren
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isPresent()) {
            User user = convertToEntity(userDTO);
            user.setId(id);  // Setze die ID auf den bestehenden User
            User updatedUser = userService.updateUser(user);
            UserDTO updatedUserDTO = convertToDTO(updatedUser);
            return ResponseEntity.ok(updatedUserDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Benutzer per Authentifizierung abrufen (z.B. aktueller User)
    @GetMapping("/users/current")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        Long userId = userService.getUserIdFromAuthentication(authentication);
        Optional<User> user = userService.getUserById(userId);
        return user.map(u -> ResponseEntity.ok(convertToDTO(u))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Benutzer per E-Mail abrufen
    @GetMapping("/users/email")
    public ResponseEntity<UserDTO> getUserByEmail(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(convertToDTO(user));
    }

    // Konvertierungsmethoden zwischen User und UserDTO
    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getVorname(), user.getNachname());
    }

    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setVorname(userDTO.getFirstName());
        user.setNachname(userDTO.getLastName());

        // Ensure that the password is set from the DTO
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(userDTO.getPassword());
        }

        return user;
    }

}
