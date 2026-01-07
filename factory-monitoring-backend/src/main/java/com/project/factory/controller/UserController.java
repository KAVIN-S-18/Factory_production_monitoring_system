package com.project.factory.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.project.factory.dto.CreateUserRequest;
import com.project.factory.dto.LoginRequest;
import com.project.factory.dto.LoginResponse;
import com.project.factory.dto.UpdatePasswordRequest;
import com.project.factory.model.User;
import com.project.factory.model.UserLoginLog;
import com.project.factory.service.UserService;
import com.project.factory.service.UserLoginLogService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserLoginLogService userLoginLogService;

    public UserController(
            UserService userService,
            UserLoginLogService userLoginLogService
    ) {
        this.userService = userService;
        this.userLoginLogService = userLoginLogService;
    }

    /* =====================================================
       ADMIN – USER MANAGEMENT
       ===================================================== */

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/users")
    public User createUser(@RequestBody CreateUserRequest request) {

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Password is required"
            );
        }

        if (
            request.getUsername() == null ||
            !request.getUsername().toLowerCase().endsWith("@gmail.com")
        ) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Username must be a valid Gmail address"
            );
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setActive(request.isActive());

        return userService.createUser(user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    /* =====================================================
       UPDATE PASSWORD (ADMIN)
       ===================================================== */

    @PutMapping("/users/{id}/password")
    public void updatePassword(
            @PathVariable Long id,
            @RequestBody UpdatePasswordRequest request
    ) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Password cannot be empty"
            );
        }

        userService.updatePassword(id, request.getPassword());
    }

    /* =====================================================
       LOGIN
       ===================================================== */

    @PostMapping("/auth/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Optional<User> user = userService.login(
                request.getUsername(),
                request.getPassword()
        );

        if (user.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid username or password"
            );
        }

        // ✅ RECORD LOGIN
        userLoginLogService.recordLogin(
                user.get().getUsername(),
                user.get().getRole().name()
        );

        return new LoginResponse(
                user.get().getId(),
                user.get().getUsername(),
                user.get().getRole().name()
        );
    }

    /* =====================================================
       LOGOUT
       ===================================================== */

    @PostMapping("/auth/logout")
    public void logout(@RequestParam String username) {
        userLoginLogService.recordLogout(username);
    }

    /* =====================================================
       LOGIN LOGS (ADMIN)
       ===================================================== */

    @GetMapping("/login-logs")
    public List<UserLoginLog> getAllLoginLogs() {
        return userLoginLogService.getAllLogs();
    }

    @DeleteMapping("/login-logs")
    public void deleteAllLoginLogs() {
        userLoginLogService.clearAllLogs();
    }
}
