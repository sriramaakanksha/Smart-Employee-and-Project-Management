package com.semp.service.impl;

import com.semp.dto.EmployeeRequestDto;
import com.semp.dto.EmployeeResponseDto;
import com.semp.dto.MessageResponse;
import com.semp.dto.PageResponseDto;
import com.semp.exception.BadRequestException;
import com.semp.exception.ResourceNotFoundException;
import com.semp.model.Department;
import com.semp.model.Employee;
import com.semp.model.Role;
import com.semp.model.User;
import com.semp.repository.DepartmentRepository;
import com.semp.repository.EmployeeRepository;
import com.semp.repository.UserRepository;
import com.semp.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public PageResponseDto<EmployeeResponseDto> searchEmployees(
            String keyword, Long departmentId, String status, int page, int size, String sortBy, String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Employee> employeePage = employeeRepository.searchEmployees(keyword, departmentId, status, pageable);

        List<EmployeeResponseDto> content = employeePage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PageResponseDto.<EmployeeResponseDto>builder()
                .content(content)
                .pageNo(employeePage.getNumber())
                .pageSize(employeePage.getSize())
                .totalElements(employeePage.getTotalElements())
                .totalPages(employeePage.getTotalPages())
                .last(employeePage.isLast())
                .build();
    }

    @Override
    public List<EmployeeResponseDto> getAllEmployeesList() {
        return employeeRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return mapToDto(employee);
    }

    @Override
    @Transactional
    public EmployeeResponseDto createEmployee(EmployeeRequestDto requestDto) {
        if (employeeRepository.existsByEmployeeCode(requestDto.getEmployeeCode())) {
            throw new BadRequestException("Employee code '" + requestDto.getEmployeeCode() + "' already exists");
        }
        if (employeeRepository.existsByEmail(requestDto.getEmail())) {
            throw new BadRequestException("Employee with email '" + requestDto.getEmail() + "' already exists");
        }

        Department department = departmentRepository.findById(requestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", requestDto.getDepartmentId()));

        User user = null;
        if (Boolean.TRUE.equals(requestDto.getCreateAccount())) {
            String username = requestDto.getEmail().split("@")[0];
            if (userRepository.existsByUsername(username)) {
                username = username + "_" + (System.currentTimeMillis() % 1000);
            }
            String password = (requestDto.getPassword() != null && !requestDto.getPassword().trim().isEmpty())
                    ? requestDto.getPassword() : "user123";

            user = User.builder()
                    .username(username)
                    .email(requestDto.getEmail())
                    .password(passwordEncoder.encode(password))
                    .role(Role.ROLE_EMPLOYEE)
                    .enabled(true)
                    .build();
            user = userRepository.save(user);
        }

        Employee employee = Employee.builder()
                .employeeCode(requestDto.getEmployeeCode())
                .firstName(requestDto.getFirstName())
                .lastName(requestDto.getLastName())
                .email(requestDto.getEmail())
                .phone(requestDto.getPhone())
                .designation(requestDto.getDesignation())
                .salary(requestDto.getSalary())
                .joinDate(requestDto.getJoinDate())
                .status(requestDto.getStatus() != null ? requestDto.getStatus() : "ACTIVE")
                .department(department)
                .user(user)
                .build();

        Employee saved = employeeRepository.save(employee);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto requestDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        Department department = departmentRepository.findById(requestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", requestDto.getDepartmentId()));

        employee.setFirstName(requestDto.getFirstName());
        employee.setLastName(requestDto.getLastName());
        employee.setEmail(requestDto.getEmail());
        employee.setPhone(requestDto.getPhone());
        employee.setDesignation(requestDto.getDesignation());
        employee.setSalary(requestDto.getSalary());
        employee.setJoinDate(requestDto.getJoinDate());
        employee.setStatus(requestDto.getStatus());
        employee.setDepartment(department);

        Employee updated = employeeRepository.save(employee);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public MessageResponse deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        employeeRepository.delete(employee);
        return new MessageResponse("Employee deleted successfully");
    }

    private EmployeeResponseDto mapToDto(Employee employee) {
        return EmployeeResponseDto.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .fullName(employee.getFirstName() + " " + employee.getLastName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .designation(employee.getDesignation())
                .salary(employee.getSalary())
                .joinDate(employee.getJoinDate())
                .status(employee.getStatus())
                .departmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null)
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null)
                .departmentCode(employee.getDepartment() != null ? employee.getDepartment().getCode() : null)
                .userId(employee.getUser() != null ? employee.getUser().getId() : null)
                .username(employee.getUser() != null ? employee.getUser().getUsername() : null)
                .build();
    }
}
