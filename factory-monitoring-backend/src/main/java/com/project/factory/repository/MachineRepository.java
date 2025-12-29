package com.project.factory.repository;

import com.project.factory.model.Machine;
import com.project.factory.model.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MachineRepository extends JpaRepository<Machine, Long> {

    Optional<Machine> findByName(String name);

    boolean existsByStatus(MachineStatus status);
}
