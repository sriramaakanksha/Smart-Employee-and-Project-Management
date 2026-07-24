package com.semp.repository;

import com.semp.model.Project;
import com.semp.model.ProjectPriority;
import com.semp.model.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByProjectCode(String projectCode);
    Boolean existsByProjectCode(String projectCode);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.assignedEmployees e WHERE " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.projectCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:priority IS NULL OR p.priority = :priority) AND " +
           "(:employeeId IS NULL OR e.id = :employeeId)")
    Page<Project> searchProjects(
            @Param("keyword") String keyword,
            @Param("status") ProjectStatus status,
            @Param("priority") ProjectPriority priority,
            @Param("employeeId") Long employeeId,
            Pageable pageable
    );

    List<Project> findByAssignedEmployeesId(Long employeeId);
    long countByStatus(ProjectStatus status);
}
