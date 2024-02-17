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
        System.out.println("[PrincipalDetailsService] loadUserByUsername() username :" + username);
        Optional<User> userOptional = userRepository.findById(username);
        if(userOptional.isEmpty())
            return null;

        //Entity -> Dto
        UserDto dto = new UserDto();
        dto.setUsername(userOptional.get().getUsername());
        dto.setPassword(userOptional.get().getPassword());
        dto.setNickname(userOptional.get().getNickname());
        dto.setName(userOptional.get().getName());
        dto.setContactCompanyCode(userOptional.get().getContactCompany().getCode());
        dto.setContact(userOptional.get().getContact());
        dto.setAddressPostal(userOptional.get().getAddressPostal());
        dto.setAddressPrimary(userOptional.get().getAddressPrimary());
        dto.setAddressSecondary(userOptional.get().getAddressSecondary());
        dto.setRole(userOptional.get().getRole());
        dto.setSuspended(userOptional.get().isSuspended());
        dto.setRegisteredAt(userOptional.get().getRegisteredAt());

        return new PrincipalDetails(dto);
    }

}
