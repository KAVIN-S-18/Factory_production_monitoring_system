package com.project.factory.dto;

import com.project.factory.model.Role;

public class CreateUserRequest {

    private String username;
    private String password;
    private Role role;
    private boolean active = true;

    /* ================= GETTERS ================= */

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    /* ================= SETTERS ================= */

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    /* ================= HELPER (OPTIONAL) ================= */

    // ✅ Can be used later if validation is moved here
    public boolean isGmailUsername() {
        return username != null && username.toLowerCase().endsWith("@gmail.com");
    }
}
