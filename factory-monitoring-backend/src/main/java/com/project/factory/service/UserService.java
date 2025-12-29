package com.project.factory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.factory.model.Role;
import com.project.factory.model.User;
import com.project.factory.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Constructor injection (recommended)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /* =====================================================
       USER MANAGEMENT (ADMIN)
       ===================================================== */

    // Create a new user
    public User createUser(User user) {
        // You can add duplicate username check later
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Delete user by ID
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /* =====================================================
       UPDATE PASSWORD (ADMIN)
       ===================================================== */

    public void updatePassword(Long id, String newPassword) {

        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(newPassword); // 🔐 plain text (BCrypt later)
        userRepository.save(user);
    }

    /* =====================================================
       LOGIN LOGIC
       ===================================================== */

    public Optional<User> login(String username, String password, Role role) {

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();

        // Check user is active
        if (!user.isActive()) {
            return Optional.empty();
        }

        // Check password (plain text for now)
        if (!user.getPassword().equals(password)) {
            return Optional.empty();
        }

        // Check role matches selected role
        if (user.getRole() != role) {
            return Optional.empty();
        }

        return Optional.of(user);
    }
}
