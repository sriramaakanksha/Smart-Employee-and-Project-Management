package com.semp.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class EmployeeResponseDto {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String designation;
    private BigDecimal salary;
    private LocalDate joinDate;
    private String status;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private Long userId;
    private String username;
}
