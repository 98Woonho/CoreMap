package com.coremap.demo.controller;

import com.coremap.demo.domain.dto.CertificationDto;
import com.coremap.demo.domain.dto.EmailAuthDto;
import com.coremap.demo.domain.dto.UserDto;
import com.coremap.demo.domain.entity.ContactCompany;
import com.coremap.demo.domain.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Controller
@Slf4j
@RequestMapping(value="/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping(value="/login")
    public void getLogin() {

    }

    @GetMapping("/join")
    public void getJoin(Model model){
        List<ContactCompany> contactCompanyList = userService.getAllContactCompanyList();

        model.addAttribute("contactCompanyList", contactCompanyList);
    }

    @PostMapping("/join")
    public String postJoin(UserDto dto) throws Exception {
        return null;
    }

    @PostMapping(value= "sendMail")
    @ResponseBody
    public String postSendMail(EmailAuthDto emailAuthDto) throws MessagingException {
        String result = this.userService.sendJoinEmail(emailAuthDto);

        return result;
    }

    @PatchMapping(value="sendMail")
    @ResponseBody
    public String patchSendMail(EmailAuthDto emailAuthDto) {
        String result = this.userService.verifyJoinEmail(emailAuthDto);

        return result;
    }
}
