package com.example.Fallstudie.service;

import com.example.Fallstudie.DTO.LoginRequest;
import com.example.Fallstudie.DTO.UserDTO;
import com.example.Fallstudie.DTO.CustomUserDetails;
import com.example.Fallstudie.config.JwtTokenUtil;
import com.example.Fallstudie.model.Role;
import com.example.Fallstudie.model.User;
import com.example.Fallstudie.repository.RoleRepository;
import com.example.Fallstudie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Benutzer erstellen
    public UserDTO createNewUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + userDTO.getEmail() + " already exists.");
        }

        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // Alle Benutzer abrufen
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Benutzer per ID abrufen
    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Benutzer aktualisieren
    public Optional<UserDTO> updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    // Nur aktualisieren, wenn das Vorname-Feld gesetzt ist
                    if (userDTO.getFirstName() != null && !userDTO.getFirstName().isEmpty()) {
                        existingUser.setVorname(userDTO.getFirstName());
                    }

                    // Nur aktualisieren, wenn das Nachname-Feld gesetzt ist
                    if (userDTO.getLastName() != null && !userDTO.getLastName().isEmpty()) {
                        existingUser.setNachname(userDTO.getLastName());
                    }

                    // Nur aktualisieren, wenn die E-Mail gesetzt ist
                    if (userDTO.getEmail() != null && !userDTO.getEmail().isEmpty()) {
                        existingUser.setEmail(userDTO.getEmail());
                    }

                    // Rolle nur aktualisieren, wenn eine Role-ID im DTO vorhanden ist
                    if (userDTO.getRoleID() != 0) {
                        Optional<Role> role = roleRepository.findById(userDTO.getRoleID());
                        if (role.isEmpty()) {
                            throw new RuntimeException("Role not found with id: " + userDTO.getRoleID());
                        } else {
                            existingUser.setRole(role.get());
                        }
                    }

                    // Passwort nur aktualisieren, wenn es gesetzt ist und nicht leer ist
                    if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                        existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
                    }

                    // Speichere den aktualisierten Benutzer
                    User updatedUser = userRepository.save(existingUser);
                    return convertToDTO(updatedUser);
                });
    }


    // Aktueller Benutzer aus JWT-Token
    public UserDTO getCurrentUserByToken(String authorizationHeader) {
        String email = jwtTokenUtil.extractEmail(authorizationHeader);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return convertToDTO(user);
    }

    // Benutzer per E-Mail abrufen
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return convertToDTO(user);
    }

    // Konvertierungsmethoden zwischen User und UserDTO
    public UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getVorname(), user.getNachname(), user.getPassword(), user.getRole().getId());
    }

    public User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setVorname(userDTO.getFirstName());
        user.setNachname(userDTO.getLastName());
        user.setPassword(userDTO.getPassword());
        user.setId(userDTO.getId());
        if (userDTO.getRoleID() != 0) {
            Optional<Role> role = roleRepository.findById(userDTO.getRoleID());
            if (role.isEmpty()) {
                throw new RuntimeException("Role not found with id: " + userDTO.getRoleID());
            } else {
                user.setRole(role.get());
            }
        }
        return user;
    }

    public Long getUserIdFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getId();
    }


    public String authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // Generate and return the JWT token
                return jwtTokenUtil.generateToken(user);
            }
        }
        return null; // Invalid credentials
    }

    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new CustomUserDetails(user.get());  // Gib die CustomUserDetails zurück
    }
}
