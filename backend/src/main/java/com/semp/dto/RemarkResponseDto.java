package com.semp.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class RemarkResponseDto {
    private Long id;
    private Long taskId;
    private Long userId;
    private String authorName;
    private String authorRole;
    private String content;
    private LocalDateTime createdAt;
}
