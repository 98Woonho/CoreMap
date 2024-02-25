package com.coremap.demo.config.auth;

import com.coremap.demo.config.auth.provider.GoogleUserInfo;
import com.coremap.demo.config.auth.provider.KakaoUserInfo;
import com.coremap.demo.config.auth.provider.NaverUserInfo;
import com.coremap.demo.config.auth.provider.OAuth2UserInfo;
import com.coremap.demo.domain.dto.UserDto;
import com.coremap.demo.domain.entity.User;
import com.coremap.demo.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class PrincipalDetailsOAuth2Service extends DefaultOAuth2UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        //Attribute확인
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("[PrincipalDetailsOAuth2Service] loadUser() oAuth2User : " + oAuth2User);
        System.out.println("[PrincipalDetailsOAuth2Service] loadUser() oAuth2User.getAttributes() : " + oAuth2User.getAttributes());

        //OAuth Server Provider 구별
        String provider = userRequest.getClientRegistration().getRegistrationId();
        System.out.println("[PrincipalDetailsOAuth2Service] loadUser() provider : " + provider);

        OAuth2UserInfo oAuth2UserInfo = null;
        if (provider != null && provider.equals("kakao")) {
            String id = oAuth2User.getAttributes().get("id").toString();
            KakaoUserInfo kakaoUserInfo = new KakaoUserInfo(id, (Map<String, Object>) oAuth2User.getAttributes().get("properties"));
            System.out.println("[PrincipalDetailsOAuth2Service] loadUser() kakaUserInfo : " + kakaoUserInfo);
            oAuth2UserInfo = kakaoUserInfo;
        } else if (provider != null && provider.equals("naver")) {
            Map<String, Object> resp = (Map<String, Object>) oAuth2User.getAttributes().get("response");
            String id = (String) resp.get("id");
            NaverUserInfo naverUserInfo = new NaverUserInfo(id, resp);
            System.out.println("[PrincipalDetailsOAuth2Service] loadUser() naverUserInfo : " + naverUserInfo);
            oAuth2UserInfo = naverUserInfo;

        } else if (provider != null && provider.equals("google")) {
            String id = (String) oAuth2User.getAttributes().get("sub");
            GoogleUserInfo googleUserInfo = new GoogleUserInfo(id, oAuth2User.getAttributes());
            oAuth2UserInfo = googleUserInfo;
        }

        System.out.println("[PrincipalDetailsOAuth2Service] loadUser() oAuth2UserInfo : " + oAuth2UserInfo);


        //Db조회
        String username = oAuth2UserInfo.getProvider() + "_" + oAuth2UserInfo.getProviderId();
        String password = passwordEncoder.encode("1234");

        Optional<User> optional = userRepository.findById(username);
        UserDto dto = null;
        if (optional.isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .password(password)
                    .role("ROLE_USER")
                    .provider(oAuth2UserInfo.getProvider())
                    .providerId(oAuth2UserInfo.getProviderId())
                    .build();
            userRepository.save(user);
            dto = UserDto.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .role(user.getRole())
                    .provider(user.getProvider())
                    .providerId(user.getProviderId())
                    .build();
            System.out.println("[PrincipalDetailsOAuth2Service] loadUser() " + oAuth2UserInfo.getProvider() + " 최초 로그인!");
        } else {
            User user = optional.get();
            if(user.getContactCompany() != null) {
                dto = UserDto.builder()
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .name(user.getName())
                        .nickname(user.getNickname())
                        .contact(user.getContact())
                        .contactCompanyCode(user.getContactCompany().getCode())
                        .addressPostal(user.getAddressPostal())
                        .addressPrimary(user.getAddressPrimary())
                        .addressSecondary(user.getAddressSecondary())
                        .role(user.getRole())
                        .provider(user.getProvider())
                        .providerId(user.getProviderId())
                        .build();
            } else {
                dto = UserDto.builder()
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .role(user.getRole())
                        .provider(user.getProvider())
                        .providerId(user.getProviderId())
                        .build();
            }
            System.out.println("[PrincipalDetailsOAuth2Service] loadUser() " + oAuth2UserInfo.getProvider() + " 기존계정 로그인!");

        }

        //PrincipalDetails생성
        PrincipalDetails principalDetails = new PrincipalDetails();
        principalDetails.setAttributes(oAuth2UserInfo.getAttributes());
        principalDetails.setAccessToken(userRequest.getAccessToken().getTokenValue());
        principalDetails.setUserDto(dto);
        return principalDetails;
    }
}
