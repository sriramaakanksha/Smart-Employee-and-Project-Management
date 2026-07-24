package com.semp.repository;

import com.semp.model.Task;
import com.semp.model.TaskPriority;
import com.semp.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByTaskCode(String taskCode);

    @Query("SELECT t FROM Task t WHERE " +
           "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.taskCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:projectId IS NULL OR t.project.id = :projectId) AND " +
           "(:assignedEmployeeId IS NULL OR t.assignedEmployee.id = :assignedEmployeeId) AND " +
           "(:departmentId IS NULL OR (t.assignedEmployee IS NOT NULL AND t.assignedEmployee.department.id = :departmentId)) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Task> searchTasks(
            @Param("keyword") String keyword,
            @Param("projectId") Long projectId,
            @Param("assignedEmployeeId") Long assignedEmployeeId,
            @Param("departmentId") Long departmentId,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority,
            Pageable pageable
    );

    List<Task> findByAssignedEmployeeId(Long assignedEmployeeId);
    List<Task> findByProjectId(Long projectId);

    long countByStatus(TaskStatus status);
    long countByAssignedEmployeeIdAndStatus(Long employeeId, TaskStatus status);
    long countByAssignedEmployeeId(Long employeeId);

    @Query("SELECT t FROM Task t WHERE t.assignedEmployee.id = :employeeId AND t.status != 'DONE' AND t.dueDate <= :dateThreshold ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasksForEmployee(@Param("employeeId") Long employeeId, @Param("dateThreshold") LocalDate dateThreshold);

    @Query("SELECT t FROM Task t WHERE t.status != 'DONE' AND t.dueDate < CURRENT_DATE")
    List<Task> findOverdueTasks();
}
