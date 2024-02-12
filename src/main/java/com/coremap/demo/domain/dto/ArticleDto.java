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
public class ArticleDto {
    private Long id;
    private String username;
    private String title;
    private String content;
    private int view;
    private Date writtenAt;
    private Date modifiedAt;
    private boolean isDeleted;
}
