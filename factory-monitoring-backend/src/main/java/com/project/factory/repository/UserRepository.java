package com.project.factory.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.factory.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username (used during login)
    Optional<User> findByUsername(String username);

    // Check if username already exists (used by TempUserLoader)
    boolean existsByUsername(String username);
}
