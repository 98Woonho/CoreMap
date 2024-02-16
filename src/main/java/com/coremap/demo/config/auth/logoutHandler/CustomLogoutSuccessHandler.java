package com.coremap.demo.config.auth.logoutHandler;

import com.coremap.demo.config.auth.PrincipalDetails;
import com.coremap.demo.config.auth.jwt.JwtProperties;
import com.coremap.demo.config.auth.jwt.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import java.io.IOException;
import java.util.Arrays;


public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {


    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;


    private final String REDIRECT_URI="http://localhost:8080/";


    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth) throws IOException, ServletException {
        System.out.println("[CustomLogoutSuccessHandler] onLogoutSuccess()");

        //----------------------------------------
        //JWT
        //----------------------------------------
        // cookie 에서 JWT token을 가져옵니다.
        String token = Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(JwtProperties.COOKIE_NAME)).findFirst()
                .map(cookie -> cookie.getValue())
                .orElse(null);
        Authentication authentication =  jwtTokenProvider.getAuthentication(token);
        //----------------------------------------

        PrincipalDetails principalDetails = (PrincipalDetails)authentication.getPrincipal();
        String provider =  principalDetails.getUserDto().getProvider();

        if(provider!=null&&provider.equals("kakao")){
            String url = "https://kauth.kakao.com/oauth/logout?client_id="+kakaoClientId+"&logout_redirect_uri="+REDIRECT_URI;
            response.sendRedirect(url);
            return ;
        }
        response.sendRedirect("/"); // request.getContextPath() == "/";
    }
}
