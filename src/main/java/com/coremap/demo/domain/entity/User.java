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
    private String username;
    private String password;
    private String nickname;
    private String name;
    @ManyToOne
    @JoinColumn(name="contact_company_code", foreignKey = @ForeignKey(name="fk_user_contact_company_code", foreignKeyDefinition = "FOREIGN KEY(contact_company_code) REFERENCES contact_company(code) ON DELETE CASCADE ON UPDATE CASCADE"))
    private ContactCompany contactCompany;
    private String contactFirst;
    private String contactSecond;
    private String contactThird;
    private String addressPostal;
    private String addressPrimary;
    private String addressSecondary;
    private String role;
    private String provider;
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
                .contactCompanyCode(user.getContactCompany().getCode())
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