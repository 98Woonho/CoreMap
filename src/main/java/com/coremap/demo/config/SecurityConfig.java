package com.coremap.demo.config;


import com.coremap.demo.config.auth.exceptionHandler.CustomAccessDeniedHandler;
import com.coremap.demo.config.auth.exceptionHandler.CustomAuthenticationEntryPoint;
import com.coremap.demo.config.auth.jwt.JwtAuthorizationFilter;
import com.coremap.demo.config.auth.jwt.JwtProperties;
import com.coremap.demo.config.auth.jwt.JwtTokenProvider;
import com.coremap.demo.config.auth.loginHandler.CustomAuthenticationFailureHandler;
import com.coremap.demo.config.auth.loginHandler.CustomLoginSuccessHandler;
import com.coremap.demo.config.auth.loginHandler.Oauth2JwtLoginSuccessHandler;
import com.coremap.demo.config.auth.logoutHandler.CustomLogoutHandler;
import com.coremap.demo.config.auth.logoutHandler.CustomLogoutSuccessHandler;
import com.coremap.demo.domain.repository.UserRepository;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private HikariDataSource dataSource;


    //JWT ADDED..
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;


    @Bean
    public SecurityFilterChain config(HttpSecurity http) throws Exception {

        //CSRF 비활성화
        http.csrf(
                (config)->{ config.disable(); }
        );


        //요청 URL별 접근 제한
        http.authorizeHttpRequests(
                authorize->{
//                    authorize.requestMatchers("/js/**","/css/**","/image/**","/templates","/productimage/**").permitAll();
//                    authorize.requestMatchers("/login","/user/**").permitAll();
//                    authorize.requestMatchers("/join").hasRole("ANONYMOUS");
//                    authorize.requestMatchers("/").hasAnyRole("USER", "SELLER", "ADMIN");
//                    authorize.requestMatchers("/imageboard/add").hasRole("SELLER");
//                    authorize.requestMatchers("/imageboard/list", "/imageboard/read").permitAll();
//                    authorize.requestMatchers("/cart/**").permitAll();

                    authorize.requestMatchers("/**").permitAll();
                    authorize.anyRequest().authenticated();
                }
        );
        //로그인
        http.formLogin(login->{
            login.permitAll();
            login.loginPage("/user/login");
            login.successHandler(customLoginSuccessHandler());
            login.failureHandler(new CustomAuthenticationFailureHandler());

        });

        //로그아웃
        http.logout(
                (logout)->{
                    logout.permitAll();
                    logout.logoutUrl("/logout");
                    logout.addLogoutHandler(customLogoutHandler());
                    logout.logoutSuccessHandler( customLogoutSuccessHandler() );
                    //JWT Added
                    logout.deleteCookies("JSESSIONID", JwtProperties.COOKIE_NAME);
                    logout.invalidateHttpSession(true);
                }
        );
        //Session

        //예외처리
        http.exceptionHandling(
                ex->{
                    ex.authenticationEntryPoint(new CustomAuthenticationEntryPoint());
                    ex.accessDeniedHandler(new CustomAccessDeniedHandler());
                }
        );

        //RememberMe
        http.rememberMe(
                rm->{
                    rm.key("rememberMeKey");
                    rm.rememberMeParameter("remember-me");
                    rm.alwaysRemember(false);
                    rm.tokenValiditySeconds(3600);  //60*60
                    rm.tokenRepository(tokenRepository());
                }
        );

        //Oauth2
        http.oauth2Login(
                oauth2->{
                    oauth2.loginPage("/user/login");
                    oauth2.successHandler(oauth2JwtLoginSuccessHandler());
                }
        );

        //SESSION INVALIDATE..
        http.sessionManagement(
                httpSecuritySessionManagementConfigurer ->
                        httpSecuritySessionManagementConfigurer.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
        );

        //JWT ADDED
        http.addFilterBefore(
                new JwtAuthorizationFilter(userRepository,jwtTokenProvider),
                BasicAuthenticationFilter.class

        );

        return http.build();
}

    //REMEMBER ME 처리 BEAN
    @Bean
    public PersistentTokenRepository tokenRepository(){
        JdbcTokenRepositoryImpl repo = new JdbcTokenRepositoryImpl();
        //repo.setCreateTableOnStartup(true);
        repo.setDataSource(dataSource);
        return repo;
    }


    //CUSTOMLOGOUTSUCCESS BEAN
    @Bean
    public CustomLogoutSuccessHandler customLogoutSuccessHandler(){
        return new CustomLogoutSuccessHandler();
    }
    //CUSTOMLOGOUTHANDLER BEAN
    @Bean
    public CustomLogoutHandler customLogoutHandler(){
        return new CustomLogoutHandler();
    }

    //CUSTOMLOGINSUCCESSHANDLER BEAN

    @Bean
    public CustomLoginSuccessHandler customLoginSuccessHandler(){
        return new CustomLoginSuccessHandler();
    }

    //Oauth2JwtLoginSuccessHandler BEAN

    @Bean
    public Oauth2JwtLoginSuccessHandler oauth2JwtLoginSuccessHandler(){
        return new Oauth2JwtLoginSuccessHandler();
    }

//    @Bean
//    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
//        InMemoryUserDetailsManager userDetailsManager = new InMemoryUserDetailsManager();
//
//        userDetailsManager.createUser(User.withUsername("user")
//                .password(passwordEncoder.encode("1234"))
//                .roles("USER")
//                .build());
//
//        userDetailsManager.createUser(User.withUsername("member")
//                .password(passwordEncoder.encode("1234"))
//                .roles("MEMBER")
//                .build());
//
//        userDetailsManager.createUser(User.withUsername("admin")
//                .password(passwordEncoder.encode("1234"))
//                .roles("ADMIN")
//                .build());
//
//        return userDetailsManager;
//    }

    // BCryptPasswordEncoder Bean 등록 - 패스워드 검증에 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
