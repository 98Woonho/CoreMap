package com.coremap.demo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCommentDto {
    private Long id;
    private String username;
    private Long commentId;
    private String content;
    private Date writtenAt;
    private Date modifiedAt;
    private boolean isDeleted;
}
