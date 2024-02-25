package com.coremap.demo.config.auth;

import com.coremap.demo.domain.dto.UserDto;
import com.coremap.demo.domain.entity.User;
import com.coremap.demo.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
// UserDetailsService : 유저의 정보를 가져오는 인터페이스
public class PrincipalDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 로그인 버튼을 누르면, post로 동작하게 되고 SpringSecurity에서 username을 넘겨주고 이 메서드가 실행이 됨.
        Optional<User> userOptional = userRepository.findById(username);

        //Entity -> Dto
        UserDto dto = new UserDto();
        dto = UserDto.builder()
                .username(userOptional.get().getUsername())
                .password(userOptional.get().getPassword())
                .nickname(userOptional.get().getNickname())
                .name(userOptional.get().getName())
                .contact(userOptional.get().getContact())
                .addressPostal(userOptional.get().getAddressPostal())
                .addressPrimary(userOptional.get().getAddressPrimary())
                .addressSecondary(userOptional.get().getAddressSecondary())
                .role(userOptional.get().getRole())
                .isSuspended(userOptional.get().isSuspended())
                .registeredAt(userOptional.get().getRegisteredAt())
                .build();

        if(userOptional.get().getContactCompany() != null) {
            dto.setContactCompanyCode(userOptional.get().getContactCompany().getCode());
        }

        return new PrincipalDetails(dto);
    }

}
