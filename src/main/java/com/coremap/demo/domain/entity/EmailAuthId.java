package com.coremap.demo.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
// 복합 PK를 사용하기 위한 EmailAuthId 클래스
public class EmailAuthId implements Serializable {
    private String email;
    private String code;
    private String salt;
}
