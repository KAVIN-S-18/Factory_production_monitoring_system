package com.project.factory.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.factory.model.UserLoginLog;

public interface UserLoginLogRepository
        extends JpaRepository<UserLoginLog, Long> {

    // ✅ FIND ACTIVE SESSION
    Optional<UserLoginLog>
        findTopByUsernameAndActiveTrueOrderByLoginTimeDesc(String username);
}
