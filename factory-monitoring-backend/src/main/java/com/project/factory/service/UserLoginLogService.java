package com.project.factory.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.factory.model.UserLoginLog;
import com.project.factory.repository.UserLoginLogRepository;

@Service
public class UserLoginLogService {

    private final UserLoginLogRepository repository;

    public UserLoginLogService(UserLoginLogRepository repository) {
        this.repository = repository;
    }

    /* =====================================================
       RECORD LOGIN
       ===================================================== */
    public void recordLogin(String username, String role) {
        UserLoginLog log = new UserLoginLog();
        log.setUsername(username);
        log.setRole(role);
        log.setLoginTime(LocalDateTime.now());
        log.setActive(true);

        repository.save(log);
    }

    /* =====================================================
       RECORD LOGOUT
       ===================================================== */
    public void recordLogout(String username) {
        Optional<UserLoginLog> logOpt =
                repository.findTopByUsernameAndActiveTrueOrderByLoginTimeDesc(username);

        if (logOpt.isPresent()) {
            UserLoginLog log = logOpt.get();
            log.setLogoutTime(LocalDateTime.now());
            log.setActive(false);
            repository.save(log);
        }
    }

    /* =====================================================
       FETCH ALL LOGIN LOGS (ADMIN)
       ===================================================== */
    public List<UserLoginLog> getAllLogs() {
        return repository.findAll();
    }

    /* =====================================================
       CLEAR ALL LOGIN LOGS (ADMIN – ONE TIME)
       ===================================================== */
    public void clearAllLogs() {
        repository.deleteAll();
    }
}
