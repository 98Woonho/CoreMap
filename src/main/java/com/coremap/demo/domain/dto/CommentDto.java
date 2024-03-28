package com.coremap.demo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {
    private Long id;
    private Long articleId;
    private Long commentId;
    private String username;
    private String content;
    private LocalDateTime writtenAt;
    private LocalDateTime  modifiedAt;
    private Boolean isDeleted;
}
