package com.semp.config;

import com.semp.model.*;
import com.semp.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private RemarkRepository remarkRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            logger.info("Initializing SEMP seed data...");

            // 1. Create Users
            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@semp.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(adminUser);

            User empUser1 = User.builder()
                    .username("john.doe")
                    .email("john.doe@semp.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.ROLE_EMPLOYEE)
                    .enabled(true)
                    .build();
            userRepository.save(empUser1);

            User empUser2 = User.builder()
                    .username("jane.smith")
                    .email("jane.smith@semp.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.ROLE_EMPLOYEE)
                    .enabled(true)
                    .build();
            userRepository.save(empUser2);

            // 2. Create Departments
            Department deptEng = Department.builder()
                    .name("Engineering")
                    .code("ENG")
                    .description("Software Development and Core Technical Architecture")
                    .build();
            departmentRepository.save(deptEng);

            Department deptHr = Department.builder()
                    .name("Human Resources")
                    .code("HR")
                    .description("Talent Acquisition, Employee Relations, and Welfare")
                    .build();
            departmentRepository.save(deptHr);

            Department deptProd = Department.builder()
                    .name("Product & Design")
                    .code("PRD")
                    .description("Product Strategy, UI/UX Design, and Customer Experience")
                    .build();
            departmentRepository.save(deptProd);

            // 3. Create Employees
            Employee emp1 = Employee.builder()
                    .employeeCode("EMP-1001")
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@semp.com")
                    .phone("+1 555-0192")
                    .designation("Senior Full Stack Engineer")
                    .salary(new BigDecimal("95000.00"))
                    .joinDate(LocalDate.now().minusMonths(14))
                    .status("ACTIVE")
                    .department(deptEng)
                    .user(empUser1)
                    .build();
            employeeRepository.save(emp1);

            Employee emp2 = Employee.builder()
                    .employeeCode("EMP-1002")
                    .firstName("Jane")
                    .lastName("Smith")
                    .email("jane.smith@semp.com")
                    .phone("+1 555-0143")
                    .designation("Lead UI/UX Designer")
                    .salary(new BigDecimal("88000.00"))
                    .joinDate(LocalDate.now().minusMonths(8))
                    .status("ACTIVE")
                    .department(deptProd)
                    .user(empUser2)
                    .build();
            employeeRepository.save(emp2);

            Employee emp3 = Employee.builder()
                    .employeeCode("EMP-1003")
                    .firstName("Robert")
                    .lastName("Johnson")
                    .email("robert.j@semp.com")
                    .phone("+1 555-0188")
                    .designation("Backend Specialist")
                    .salary(new BigDecimal("92000.00"))
                    .joinDate(LocalDate.now().minusMonths(5))
                    .status("ACTIVE")
                    .department(deptEng)
                    .build();
            employeeRepository.save(emp3);

            // 4. Create Projects
            Set<Employee> proj1Team = new HashSet<>();
            proj1Team.add(emp1);
            proj1Team.add(emp2);

            Project proj1 = Project.builder()
                    .projectCode("PRJ-101")
                    .name("Smart Employee & Project System")
                    .description("Enterprise platform for tracking employees, projects, tasks, and automated reports.")
                    .startDate(LocalDate.now().minusMonths(1))
                    .endDate(LocalDate.now().plusMonths(3))
                    .status(ProjectStatus.IN_PROGRESS)
                    .priority(ProjectPriority.HIGH)
                    .budget(new BigDecimal("150000.00"))
                    .assignedEmployees(proj1Team)
                    .build();
            projectRepository.save(proj1);

            Set<Employee> proj2Team = new HashSet<>();
            proj2Team.add(emp1);
            proj2Team.add(emp3);

            Project proj2 = Project.builder()
                    .projectCode("PRJ-102")
                    .name("Cloud Infrastructure Migration")
                    .description("Migrating legacy microservices to AWS Elastic Kubernetes Service with CI/CD.")
                    .startDate(LocalDate.now().minusWeeks(2))
                    .endDate(LocalDate.now().plusMonths(5))
                    .status(ProjectStatus.IN_PROGRESS)
                    .priority(ProjectPriority.URGENT)
                    .budget(new BigDecimal("220000.00"))
                    .assignedEmployees(proj2Team)
                    .build();
            projectRepository.save(proj2);

            // 5. Create Tasks
            Task task1 = Task.builder()
                    .taskCode("TSK-5001")
                    .title("Implement Spring Security JWT Layer")
                    .description("Set up JwtTokenProvider, CustomUserDetailsService, and stateless SecurityFilterChain.")
                    .project(proj1)
                    .assignedEmployee(emp1)
                    .status(TaskStatus.DONE)
                    .priority(TaskPriority.HIGH)
                    .progressPercentage(100)
                    .dueDate(LocalDate.now().minusDays(2))
                    .build();
            taskRepository.save(task1);

            Task task2 = Task.builder()
                    .taskCode("TSK-5002")
                    .title("Design Responsive React Dashboard UI")
                    .description("Build glassmorphic statistics cards, chart metrics, and dark/light theme support.")
                    .project(proj1)
                    .assignedEmployee(emp2)
                    .status(TaskStatus.IN_PROGRESS)
                    .priority(TaskPriority.HIGH)
                    .progressPercentage(75)
                    .dueDate(LocalDate.now().plusDays(4))
                    .build();
            taskRepository.save(task2);

            Task task3 = Task.builder()
                    .taskCode("TSK-5003")
                    .title("Setup PDF and Excel Report Export")
                    .description("Integrate Apache POI and OpenPDF to generate formatted downloadable reports.")
                    .project(proj1)
                    .assignedEmployee(emp1)
                    .status(TaskStatus.TODO)
                    .priority(TaskPriority.MEDIUM)
                    .progressPercentage(0)
                    .dueDate(LocalDate.now().plusDays(10))
                    .build();
            taskRepository.save(task3);

            // 6. Create Remarks
            Remark remark1 = Remark.builder()
                    .task(task1)
                    .user(adminUser)
                    .content("JWT Security implementation verified. Standard Bearer header authentication is working seamlessly.")
                    .build();
            remarkRepository.save(remark1);

            Remark remark2 = Remark.builder()
                    .task(task2)
                    .user(empUser2)
                    .content("UI mockup finalized. Progress sliders and modal dialogs are integrated into the React state.")
                    .build();
            remarkRepository.save(remark2);

            logger.info("SEMP seed data initialized successfully!");
        }
    }
}
