package com.coremap.demo.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
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
    @Column(nullable = false, columnDefinition = "DATETIME")
    private Date expiresAt;
    @Column(nullable = false, name = "verified_flag", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isVerified;
}

