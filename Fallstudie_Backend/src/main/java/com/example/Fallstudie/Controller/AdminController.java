package com.example.Fallstudie.Controller;

import com.example.Fallstudie.Repository.RoleRepository;
import com.example.Fallstudie.Repository.UserRepository;
import com.example.Fallstudie.Service.UserService;
import com.example.Fallstudie.model.Role;
import com.example.Fallstudie.model.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;

    // Benutzer erstellen
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Rolle zuweisen
        Role role = roleRepository.findByName("OWNER")
                .orElseThrow(() -> new EntityNotFoundException("Rolle nicht gefunden"));
        user.getRoles().add(role);
        User savedUser = userService.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // Rollen zuweisen
    @PostMapping("/users/{userId}/roles")
    public ResponseEntity<?> assignRole(@PathVariable Long userId, @RequestBody String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Benutzer nicht gefunden"));
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new EntityNotFoundException("Rolle nicht gefunden"));
        user.getRoles().add(role);
        userService.save(user);
        return ResponseEntity.ok("Rolle zugewiesen");
    }

    // Weitere Admin-Funktionen
}
