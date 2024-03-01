package com.coremap.demo.domain.entity;

import com.coremap.demo.domain.dto.EmailAuthDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@IdClass(EmailAuthId.class)
@Table(name="email_auths")
public class EmailAuth {
    @Id
    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    private String email;
    @Id
    @Column(nullable = false, columnDefinition = "VARCHAR(6)")
    private String code;
    @Id
    @Column(nullable = false, columnDefinition = "VARCHAR(128)")
    private String salt;
    @Column(nullable = false, columnDefinition = "DATETIME(6) DEFAULT NOW(6)")
    private Date createdAt;
    @Column(nullable = false, columnDefinition = "DATETIME(6)")
    private Date expiresAt;
    @Column(nullable = false, name = "verified_flag", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isVerified;


    public static EmailAuthDto emailAuthEntityToDto(EmailAuth emailAuth) {
        return EmailAuthDto.builder()
                .email(emailAuth.getEmail())
                .code(emailAuth.getCode())
                .salt(emailAuth.getSalt())
                .createdAt(emailAuth.getCreatedAt())
                .expiresAt(emailAuth.getExpiresAt())
                .isVerified(emailAuth.getIsVerified())
                .build();
    }
}

