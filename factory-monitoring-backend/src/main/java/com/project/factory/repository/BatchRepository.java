package com.project.factory.repository;

import com.project.factory.model.Batch;
import com.project.factory.model.BatchStatus;
import com.project.factory.model.Machine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {

    List<Batch> findByMachineAndStatusIn(
        Machine machine,
        List<BatchStatus> statuses
    );

    List<Batch> findByOperator_Id(Long operatorId);
}
