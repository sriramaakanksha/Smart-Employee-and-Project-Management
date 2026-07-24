package com.semp.repository;

import com.semp.model.Remark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemarkRepository extends JpaRepository<Remark, Long> {
    List<Remark> findByTaskIdOrderByCreatedAtDesc(Long taskId);
}
