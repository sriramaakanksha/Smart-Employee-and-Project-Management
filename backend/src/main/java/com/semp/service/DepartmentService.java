package com.semp.service;

import com.semp.dto.DepartmentRequestDto;
import com.semp.dto.DepartmentResponseDto;
import com.semp.dto.MessageResponse;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponseDto> getAllDepartments();
    DepartmentResponseDto getDepartmentById(Long id);
    DepartmentResponseDto createDepartment(DepartmentRequestDto requestDto);
    DepartmentResponseDto updateDepartment(Long id, DepartmentRequestDto requestDto);
    MessageResponse deleteDepartment(Long id);
}
