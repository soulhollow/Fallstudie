package com.example.Fallstudie.config;

import com.example.Fallstudie.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    // Methode, um einen sicheren SecretKey aus der secretKeyString zu erzeugen
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes());
    }

    // Token generieren
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, user.getUsername());
    }

    // Token erstellen
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // Verwendet die konfigurierbare Expiration
                .signWith(getSigningKey()) // Signiert das Token mit dem SecretKey
                .compact();
    }

    // Token validieren
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Benutzernamen aus dem Token extrahieren (Hinzugefügt)
    public String getUsernameFromToken(String token) {
        return extractUsername(token);
    }

    // Benutzernamen aus dem Token extrahieren
    public String extractUsername(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    // Claims aus dem Token extrahieren
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Der SecretKey wird jetzt verwendet
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Token ist abgelaufen?
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Ablaufdatum aus dem Token extrahieren
    public Date extractExpiration(String token) {
        return getClaimsFromToken(token).getExpiration();
    }
}
