package com.semp.service.impl;

import com.semp.dto.JwtAuthResponse;
import com.semp.dto.LoginRequest;
import com.semp.dto.MessageResponse;
import com.semp.dto.RegisterRequest;
import com.semp.exception.BadRequestException;
import com.semp.exception.ResourceNotFoundException;
import com.semp.model.Department;
import com.semp.model.Employee;
import com.semp.model.Role;
import com.semp.model.User;
import com.semp.repository.DepartmentRepository;
import com.semp.repository.EmployeeRepository;
import com.semp.repository.UserRepository;
import com.semp.security.JwtTokenProvider;
import com.semp.security.UserPrincipal;
import com.semp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public JwtAuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        Long employeeId = null;
        String fullName = user.getUsername();
        Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());
        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            employeeId = emp.getId();
            fullName = emp.getFirstName() + " " + emp.getLastName();
        }

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .employeeId(employeeId)
                .fullName(fullName)
                .build();
    }

    @Override
    @Transactional
    public MessageResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username '" + registerRequest.getUsername() + "' is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email '" + registerRequest.getEmail() + "' is already in use!");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole() != null ? registerRequest.getRole() : Role.ROLE_EMPLOYEE)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        // If employee details are provided, create linked Employee profile
        if (registerRequest.getFirstName() != null && !registerRequest.getFirstName().trim().isEmpty()) {
            Department department = null;
            if (registerRequest.getDepartmentId() != null) {
                department = departmentRepository.findById(registerRequest.getDepartmentId())
                        .orElse(null);
            }

            Employee employee = Employee.builder()
                    .employeeCode("EMP-" + (System.currentTimeMillis() % 100000))
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName() != null ? registerRequest.getLastName() : "")
                    .email(registerRequest.getEmail())
                    .designation(registerRequest.getDesignation() != null ? registerRequest.getDesignation() : "Employee")
                    .department(department)
                    .joinDate(LocalDate.now())
                    .status("ACTIVE")
                    .user(savedUser)
                    .build();

            employeeRepository.save(employee);
        }

        return new MessageResponse("User registered successfully");
    }
}
