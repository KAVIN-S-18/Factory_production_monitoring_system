package com.project.factory.dto;

public class LoginRequest {

    private String username;
    private String password;

    // ===== GETTERS =====

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    // ===== SETTERS =====

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
