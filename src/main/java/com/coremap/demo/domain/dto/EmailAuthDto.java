package com.coremap.demo.domain.dto;

import com.coremap.demo.domain.entity.EmailAuth;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailAuthDto {
    private String email;
    private String code;
    private String salt;
    private Date createdAt;
    private Date expiresAt;
    private boolean isVerified;

    public static EmailAuth emailAuthDtoToEntity(EmailAuthDto emailAuthDto) {
        return EmailAuth.builder()
                .email(emailAuthDto.getEmail())
                .code(emailAuthDto.getCode())
                .salt(emailAuthDto.getSalt())
                .createdAt(emailAuthDto.getCreatedAt())
                .expiresAt(emailAuthDto.getExpiresAt())
                .isVerified(emailAuthDto.isVerified())
                .build();
    }
}
