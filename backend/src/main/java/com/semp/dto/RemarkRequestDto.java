package com.semp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RemarkRequestDto {

    @NotBlank(message = "Remark content is required")
    private String content;
}
