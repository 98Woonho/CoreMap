package com.coremap.demo.domain.entity;

import com.coremap.demo.domain.dto.UserDto;
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
@Table(name="user")
public class User {
    @Id
    @Column(columnDefinition = "VARCHAR(50)")
    private String username;
    @Column(columnDefinition = "VARCHAR(128)")
    private String password;
    @Column(columnDefinition = "VARCHAR(10)")
    private String nickname;
    @Column(columnDefinition = "VARCHAR(10)")
    private String name;
    @Column(columnDefinition = "VARCHAR(5)")
    private String contactCompanyCode;
    @Column(columnDefinition = "VARCHAR(4)")
    private String contactFirst;
    @Column(columnDefinition = "VARCHAR(4)")
    private String contactSecond;
    @Column(columnDefinition = "VARCHAR(4)")
    private String contactThird;
    @Column(columnDefinition = "VARCHAR(5)")
    private String addressPostal;
    @Column(columnDefinition = "VARCHAR(100)")
    private String addressPrimary;
    @Column(columnDefinition = "VARCHAR(100)")
    private String addressSecondary;
    @Column(columnDefinition = "VARCHAR(20)")
    private String role;
    @Column(columnDefinition = "VARCHAR(20)")
    private String provider;
    @Column(columnDefinition = "VARCHAR(100)")
    private String providerId;
    @Column(name = "suspended_flag", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isSuspended;
    @Column(columnDefinition = "DATETIME DEFAULT NOW()")
    private Date registeredAt;

    public static UserDto entityToDto(User user){
        UserDto dto = UserDto.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .nickname(user.getNickname())
                .name(user.getName())
                .contactCompanyCode(user.getContactCompanyCode())
                .contactFirst(user.getContactFirst())
                .contactSecond(user.getContactSecond())
                .contactThird(user.getContactThird())
                .addressPostal(user.getAddressPostal())
                .addressPrimary(user.getAddressPrimary())
                .addressSecondary(user.getAddressSecondary())
                .role(user.getRole())
                .provider(user.getProvider())
                .providerId(user.getProviderId())
                .isSuspended(user.isSuspended())
                .registeredAt(user.getRegisteredAt())
                .build();
        return dto;
    }
}