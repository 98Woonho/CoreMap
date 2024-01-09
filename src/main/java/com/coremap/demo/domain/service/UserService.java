package com.coremap.demo.domain.service;


import com.coremap.demo.config.auth.jwt.JwtTokenProvider;
import com.coremap.demo.domain.dto.EmailAuthDto;
import com.coremap.demo.domain.dto.UserDto;
import com.coremap.demo.domain.entity.EmailAuth;
import com.coremap.demo.domain.entity.User;
import com.coremap.demo.domain.mapper.UserMapper;
import com.coremap.demo.domain.repository.UserRepository;
import com.coremap.demo.properties.EmailAuthProperties;
import com.coremap.demo.results.SendJoinEmailResult;
import com.coremap.demo.utils.CryptoUtil;
import io.jsonwebtoken.Claims;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Arrays;
import java.util.Date;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Transactional(rollbackFor = Exception.class)
    public boolean memberJoin(UserDto dto, Model model, HttpServletRequest request) throws Exception{

        //비지니스 Validation Check

        //password vs repassword 일치여부
        if(!dto.getPassword().equals(dto.getPasswordCheck()) ){
            model.addAttribute("password","패스워드 입력이 상이합니다 다시 입력하세요");
            return false;
        }

        //동일 계정이 있는지 여부 확인
        if(userRepository.existsById(dto.getUsername())){
            model.addAttribute("username","동일한 계정명이 존재합니다.");
            return false;
        }

        //이메일인증이 되었는지 확인(JWT EmailAuth쿠키 true확인)
        Cookie[] cookies =  request.getCookies();
        String jwtAccessToken = Arrays.stream(cookies).filter(co -> co.getName().equals("EmailAuth")).findFirst()
                .map(co -> co.getValue())
                .orElse(null);

        //---
        // JWT토큰의 만료여부 확인
        //---
        if( !jwtTokenProvider.validateToken(jwtAccessToken)){
            model.addAttribute("username","이메일 인증을 진행해 주세요.");
            return false;
        }
        else{
            //EmailAuth Claim Value값 꺼내서 true 확인
            Claims claims = jwtTokenProvider.parseClaims(jwtAccessToken);
            Boolean isEmailAuth = (Boolean)claims.get(EmailAuthProperties.EMAIL_JWT_COOKIE_NAME);
            String id = (String)claims.get("id");
            if(isEmailAuth==null && isEmailAuth!=true){
                //이메일인증실패!!
                model.addAttribute("username","해당 계정의 이메일 인증이 되어있지 않습니다.");
                return false;
            }
            if(!id.equals(dto.getUsername())){
                System.out.println("!!!!!!!!!!!!!!");
                model.addAttribute("username","해당 이메일 재인증이 필요합니다.");
                return false;
            }

        }

        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        //Dto->Entity
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setRole("ROLE_USER");
        user.setAddressPostal(dto.getAddressPostal());
        user.setAddressPrimary(dto.getAddressPrimary());
        user.setAddressSecondary(dto.getAddressSecondary());
        user.setNickname(dto.getNickname());
        user.setPassword(dto.getPassword());

        //Db Saved...
        userRepository.save(user);

        return userRepository.existsById(user.getUsername());
    }

    @Transactional(rollbackFor = Exception.class)
    public SendJoinEmailResult sendJoinEmail(EmailAuthDto emailAuthDto) throws MessagingException {
        String code = RandomStringUtils.randomNumeric(6);
        emailAuthDto.setCode(code);
        emailAuthDto.setCreatedAt(new Date()); // 이메일이 보내졌을 때의 시간
        emailAuthDto.setExpiresAt(DateUtils.addMinutes(emailAuthDto.getCreatedAt(), 5)); // 이메일을 보내고 난 뒤 5분 후의 시간
        emailAuthDto.setVerified(false);

        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                emailAuthDto.getEmail(),
                code,
                Math.random(),
                Math.random()));
        emailAuthDto.setSalt(salt);

        Context context = new Context(); // emailAuthDto에 있는 데이터를 registerEmail.html로 넘기기 위한 객체 생성
        context.setVariable("emailAuthDto", emailAuthDto);
        String textHtml = this.templateEngine.process("user/JoinEmail.html", context);
        MimeMessage message = this.mailSender.createMimeMessage();
        MimeMessageHelper mimemessageHelper = new MimeMessageHelper(message, false);
        mimemessageHelper.setTo(emailAuthDto.getEmail());
        mimemessageHelper.setSubject("[Coremap] 회원가입 인증번호");
        mimemessageHelper.setText(textHtml, true);

        EmailAuth emailAuth = new EmailAuth();
        emailAuth.setCode(emailAuthDto.getCode());
        emailAuth.setEmail(emailAuthDto.getEmail());
        emailAuth.setSalt(emailAuthDto.getSalt());
        emailAuth.setVerified(emailAuthDto.isVerified());
        emailAuth.setExpiresAt(emailAuthDto.getExpiresAt());
        emailAuth.setCreatedAt(emailAuthDto.getCreatedAt());

        return this.userMapper.insertEmailAuth(emailAuth) == 0 ? SendJoinEmailResult.FAILURE : SendJoinEmailResult.SUCCESS;

//        emailAuthRepository.save(emailAuth);
//
//        if(emailAuthRepository.existsById(emailAuthDto.getEmail())) {
//            this.mailSender.send(message);
//            return SendJoinEmailResult.SUCCESS;
//        } else {
//            return SendJoinEmailResult.FAILURE;
//        }
    }
}
