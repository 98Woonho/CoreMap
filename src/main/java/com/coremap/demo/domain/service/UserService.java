package com.coremap.demo.domain.service;


import com.coremap.demo.domain.dto.EmailAuthDto;
import com.coremap.demo.domain.dto.UserDto;
import com.coremap.demo.domain.entity.ContactCompany;
import com.coremap.demo.domain.entity.EmailAuth;
import com.coremap.demo.domain.entity.User;
import com.coremap.demo.domain.repository.ContactCompanyRepository;
import com.coremap.demo.domain.repository.EmailAuthRepository;
import com.coremap.demo.domain.repository.UserRepository;
import com.coremap.demo.regexes.EmailAuthRegex;
import com.coremap.demo.regexes.UserRegex;
import com.coremap.demo.utils.CryptoUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class UserService {
    @Autowired
    private EmailAuthRepository emailAuthRepository;

    @Autowired
    private ContactCompanyRepository contactCompanyRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private UserRepository userRepository;

    public List<ContactCompany> getAllContactCompanyList() {
        return contactCompanyRepository.findAll();
    }

    @Transactional(rollbackFor = Exception.class)
    public String sendJoinEmail(EmailAuthDto emailAuthDto) throws MessagingException {
//        List<User> getAllUserList = userRepository.findAll();
//
//        for(User user : getAllUserList) {
//            if(Objects.equals(user.getUsername(), emailAuthDto.getEmail())) {
//                return "FAILURE_DUPLICATE_EMAIL";
//            }
//        }
        if(userRepository.existsById(emailAuthDto.getEmail())) {
            return "FAILURE_DUPLICATE_EMAIL";
        }

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
        this.mailSender.send(message);

        EmailAuth emailAuth = EmailAuthDto.emailAuthDtoToEntity(emailAuthDto);

        emailAuthRepository.save(emailAuth);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String verifyJoinEmail(EmailAuthDto emailAuthDto) {
        if (!EmailAuthRegex.EMAIL.matches(emailAuthDto.getEmail()) ||
                !EmailAuthRegex.CODE.matches(emailAuthDto.getCode()) ||
                !EmailAuthRegex.SALT.matches(emailAuthDto.getSalt())) {
            return "FAILURE";
        }

        emailAuthDto = EmailAuth.emailAuthEntityToDto(emailAuthRepository.findByEmailAndCodeAndSalt(emailAuthDto.getEmail(), emailAuthDto.getCode(), emailAuthDto.getSalt()));


        if (emailAuthDto == null) {
            return "FAILURE_INVALID_CODE";
        }

        if (new Date().compareTo(emailAuthDto.getExpiresAt()) > 0) {
            return "FAILURE_EXPIRED";
        }

        emailAuthDto.setVerified(true);

        EmailAuth emailAuth = EmailAuthDto.emailAuthDtoToEntity(emailAuthDto);

        emailAuthRepository.save(emailAuth);

        return "SUCCESS";
    }

    public String confirmDuplication(String nickname) {
        List<User> userList = userRepository.findAll();

        for (User user : userList) {
            if(Objects.equals(user.getNickname(), nickname)) {
                return "FAILURE_DUPLICATED_NICKNAME";
            }
        }

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String join(UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        ContactCompany contactCompany = contactCompanyRepository.findById(userDto.getContactCompanyCode()).get();

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setNickname(userDto.getNickname());
        user.setName(userDto.getName());
        user.setContactCompany(contactCompany);
        user.setContactFirst(userDto.getContactFirst());
        user.setContactSecond(userDto.getContactSecond());
        user.setContactThird(userDto.getContactThird());
        user.setAddressPostal(userDto.getAddressPostal());
        user.setAddressPrimary(userDto.getAddressPrimary());
        user.setAddressSecondary(userDto.getAddressSecondary());
        user.setRole("ROLE_USER");
        user.setSuspended(false);
        user.setRegisteredAt(new Date());

        userRepository.save(user);

        return "SUCCESS";
    }
}
