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
    private String contactFirst;
    private String contactSecond;
    private String contactThird;
    private String addressPostal;
    private String addressPrimary;
    private String addressSecondary;
    private String role;
    private boolean isSuspended;
    private Date registeredAt;

    //OAUTH2
    private String provider;
    private String providerId;
    
    public static User userDtoToEntity(UserDto userDto) {
        return User.builder()
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .nickname(userDto.getNickname())
                .name(userDto.getName())
                .contactCompanyCode(userDto.getContactCompanyCode())
                .contactFirst(userDto.getContactFirst())
                .contactSecond(userDto.getContactSecond())
                .contactThird(userDto.getContactThird())
                .addressPostal(userDto.getAddressPostal())
                .addressPrimary(userDto.getAddressPrimary())
                .addressSecondary(userDto.getAddressSecondary())
                .role(userDto.getRole())
                .provider(userDto.getProvider())
                .providerId(userDto.getProviderId())
                .isSuspended(userDto.isSuspended())
                .registeredAt(userDto.getRegisteredAt())
                .build();
    }
}
