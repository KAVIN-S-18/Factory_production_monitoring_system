package com.project.factory.repository;

import com.project.factory.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByResolvedFalseOrderByTimeDesc();

    boolean existsByTypeAndMachineAndResolvedFalse(
            String type,
            String machine
    );
}
