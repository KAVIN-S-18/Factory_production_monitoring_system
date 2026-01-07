package com.project.factory.config;

import com.project.factory.model.Role;
import com.project.factory.model.User;
import com.project.factory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TempUserLoader {

    @Bean
    CommandLineRunner loadTempUser(UserRepository userRepository) {
        return args -> {

            boolean adminExists = userRepository.existsByUsername("admin@gmail.com");

            if (!adminExists) {

                User user = new User();
                user.setUsername("admin@gmail.com");
                user.setPassword("admin123"); // TEMP ONLY
                user.setRole(Role.ADMIN);
                user.setActive(true);

                userRepository.save(user);

                System.out.println("✅ TEMP ADMIN CREATED: admin / admin123");
            } else {
                System.out.println("ℹ️ TEMP ADMIN ALREADY EXISTS");
            }
        };
    }
}
