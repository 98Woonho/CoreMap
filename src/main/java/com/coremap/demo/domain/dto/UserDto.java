package com.coremap.demo.domain.dto;

import com.coremap.demo.domain.entity.User;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
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

    // 역직렬화 Annotation
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime registeredAt;

    //OAUTH2
    private String provider;
    private String providerId;
}
