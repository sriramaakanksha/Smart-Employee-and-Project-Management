package com.semp.service;

import com.semp.dto.EmployeeRequestDto;
import com.semp.dto.EmployeeResponseDto;
import com.semp.dto.MessageResponse;
import com.semp.dto.PageResponseDto;

import java.util.List;

public interface EmployeeService {
    PageResponseDto<EmployeeResponseDto> searchEmployees(String keyword, Long departmentId, String status, int page, int size, String sortBy, String sortDir);
    List<EmployeeResponseDto> getAllEmployeesList();
    EmployeeResponseDto getEmployeeById(Long id);
    EmployeeResponseDto createEmployee(EmployeeRequestDto requestDto);
    EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto requestDto);
    MessageResponse deleteEmployee(Long id);
}
