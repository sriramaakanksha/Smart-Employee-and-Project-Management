package com.semp.service.impl;

import com.semp.dto.DepartmentRequestDto;
import com.semp.dto.DepartmentResponseDto;
import com.semp.dto.MessageResponse;
import com.semp.exception.BadRequestException;
import com.semp.exception.ResourceNotFoundException;
import com.semp.model.Department;
import com.semp.repository.DepartmentRepository;
import com.semp.repository.EmployeeRepository;
import com.semp.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<DepartmentResponseDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponseDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return mapToDto(department);
    }

    @Override
    @Transactional
    public DepartmentResponseDto createDepartment(DepartmentRequestDto requestDto) {
        if (departmentRepository.existsByName(requestDto.getName())) {
            throw new BadRequestException("Department with name '" + requestDto.getName() + "' already exists");
        }
        if (departmentRepository.existsByCode(requestDto.getCode())) {
            throw new BadRequestException("Department code '" + requestDto.getCode() + "' already exists");
        }

        Department department = Department.builder()
                .name(requestDto.getName())
                .code(requestDto.getCode().toUpperCase())
                .description(requestDto.getDescription())
                .build();

        Department saved = departmentRepository.save(department);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public DepartmentResponseDto updateDepartment(Long id, DepartmentRequestDto requestDto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        department.setName(requestDto.getName());
        department.setCode(requestDto.getCode().toUpperCase());
        department.setDescription(requestDto.getDescription());

        Department updated = departmentRepository.save(department);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public MessageResponse deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        long count = employeeRepository.countByDepartmentId(id);
        if (count > 0) {
            throw new BadRequestException("Cannot delete department with assigned employees. Reassign or remove employees first.");
        }

        departmentRepository.delete(department);
        return new MessageResponse("Department deleted successfully");
    }

    private DepartmentResponseDto mapToDto(Department department) {
        long empCount = employeeRepository.countByDepartmentId(department.getId());
        return DepartmentResponseDto.builder()
                .id(department.getId())
                .name(department.getName())
                .code(department.getCode())
                .description(department.getDescription())
                .employeeCount(empCount)
                .build();
    }
}
