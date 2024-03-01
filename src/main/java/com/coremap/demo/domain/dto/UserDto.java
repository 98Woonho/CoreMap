package com.coremap.demo.domain.dto;

import com.coremap.demo.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String username;
    private String password;
    private String passwordCheck;
    private String nickname;
    private String name;
    private String contactCompanyCode;
    private String contact;
    private String addressPostal;
    private String addressPrimary;
    private String addressSecondary;
    private String role;
    private boolean isSuspended;
    private Date registeredAt;

    //OAUTH2
    private String provider;
    private String providerId;
}
