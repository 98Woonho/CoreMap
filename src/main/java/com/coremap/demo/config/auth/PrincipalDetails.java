package com.coremap.demo.config.auth;


import com.coremap.demo.domain.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
// UserDetails : 사용자의 정보를 담는 인터페이스
// 로그인 인증 완료 후, 사용자 정보를 return 해주는 메서드를 작성하면 @AuthenticationPrincipal PrincipalDetails principalDetails 을 이용하여 로그인 한 사용자의 정보를 가져올 수 있음.
// html에서도 #authentication.principal.role 방식으로 사용 가능.
public class PrincipalDetails implements UserDetails, OAuth2User {

    private boolean isEmailAuth;
    private UserDto userDto;

    public PrincipalDetails(UserDto dto) {
        this.userDto = dto;
    }

    //OAUTH2---------------------------------------
    private String accessToken;
    private Map<String,Object> attributes;



    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }
    //OAUTH2---------------------------------------

    // 유저의 권한 목록
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return userDto.getRole();
            }
        });
        return collection;
    }

    // username
    @Override
    public String getUsername() {
        return userDto.getUsername();
    }

    // password
    @Override
    public String getPassword() {
        return userDto.getPassword();
    }

    public String getNickname() {
        return userDto.getNickname();
    }

    public String getName() {
        return userDto.getName();
    }

    public String getContactCompanyCode() {
        return userDto.getContactCompanyCode();
    }

    public String getContact() {
        return userDto.getContact();
    }

    public String getAddressPostal() {
        return userDto.getAddressPostal();
    }

    public String getAddressPrimary() {
        return userDto.getAddressPrimary();
    }

    public String getAddressSecondary() {
        return userDto.getAddressSecondary();
    }

    public String getRole() {
        return userDto.getRole();
    }

    // 계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠김 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 비밀번호 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 사용자 활성화 여부
    @Override
    public boolean isEnabled() {
        return true;
    }
}
