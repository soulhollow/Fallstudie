package com.example.Fallstudie.DTO;

import com.example.Fallstudie.model.User;
import com.example.Fallstudie.model.Role;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;

public class UserResponse {

    private String username;
    private Set<String> roles;

    // Konstruktor für UserDetails
    public UserResponse(UserDetails userDetails) {
        this.username = userDetails.getUsername();
        this.roles = userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toSet());
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}

