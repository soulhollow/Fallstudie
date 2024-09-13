package com.example.Fallstudie;

import com.example.Fallstudie.Service.UserService;
import com.example.Fallstudie.model.Role;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.Repository.RoleRepository;  // Füge das RoleRepository hinzu

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;  // Stelle sicher, dass das RoleRepository vorhanden ist

    @Test
    public void testLoadUserByUsername() {
        // Erstelle und speichere die Rolle
        Role role = new Role();
        role.setName("OWNER");
        roleRepository.save(role);  // Speichere die Rolle zuerst

        // Erstelle und speichere den Benutzer
        User user = new User();
        user.setUsername("serviceuser");
        user.setPassword("password");
        user.setEmail("serviceuser@example.com");
        user.getRoles().add(role);  // Füge die gespeicherte Rolle hinzu

        userService.save(user);

        UserDetails userDetails = userService.loadUserByUsername("serviceuser");
        assertNotNull(userDetails);
        assertEquals("serviceuser", userDetails.getUsername());
    }

    @Test
    public void testSaveUser() {
        // Erstelle und speichere die Rolle
        Role role = new Role();
        role.setName("OWNER");
        roleRepository.save(role);  // Speichere die Rolle zuerst

        // Erstelle und speichere den Benutzer
        User user = new User();
        user.setUsername("newuser");
        user.setPassword("password");
        user.setEmail("newuser@example.com");
        user.getRoles().add(role);  // Füge die gespeicherte Rolle hinzu

        User savedUser = userService.save(user);
        assertNotNull(savedUser.getId());
        assertNotEquals("password", savedUser.getPassword()); // Passwort sollte verschlüsselt sein
    }
}
