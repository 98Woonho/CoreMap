package com.coremap.demo.controller;

import com.coremap.demo.domain.dto.CertificationDto;
import com.coremap.demo.domain.dto.EmailAuthDto;
import com.coremap.demo.domain.dto.UserDto;
import com.coremap.demo.domain.entity.EmailAuth;
import com.coremap.demo.domain.service.UserService;
import com.coremap.demo.results.SendJoinEmailResult;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;

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
        log.info("getLogin()...");
    }

    @GetMapping("/join")
    public void getJoin(){
        log.info("GET /join");
    }

    @PostMapping("/join")
    // @Valid가 붙은 변수는 @NotBlank나 유효성 검사 Annotation을 자동으로 실행 및 수행해줌.
    public String postJoin(@Valid UserDto dto, BindingResult bindingResult, Model model, HttpServletRequest request) throws Exception {
        UserController.log.info("POST /join...dto " + dto);
        //파라미터 받기

        //입력값 검증(유효성체크)
        //System.out.println(bindingResult);
        if(bindingResult.hasFieldErrors()){
            for(FieldError error :bindingResult.getFieldErrors()){
                log.info(error.getField() +" : " + error.getDefaultMessage());
                model.addAttribute(error.getField(),error.getDefaultMessage());
            }
            return "/user/join";
        }

        //서비스 실행

        boolean isJoin = userService.memberJoin(dto,model,request);
        //View로 속성등등 전달
        if(isJoin)
            return "redirect:login?msg=MemberJoin Success!";
        else
            return "/user/join";
        //+a 예외처리

    }

    @GetMapping("/certification")
    public String certification(HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserController.log.info("GET /user/certification");

        if(request.getCookies() !=null) {
            boolean isExisted = Arrays.stream(request.getCookies()).filter(cookie -> cookie.getName().equals("importAuth")).findFirst()
                    .isEmpty();
            if (!isExisted) {
                response.sendRedirect("/user/join"); // return "user/join"을 하면 user/join의 페이지만 나오고 주소창은 user/certification으로 고정되어 있어서 sendRedirect 해야함.
                return null;
            }
        }
        return "user/certification";
    }

    @PostMapping(value = "/certification",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> certification_post(@RequestBody CertificationDto params, HttpServletResponse response) throws IOException {
        UserController.log.info("POST /user/certification.." + params);
        //쿠키로 본인인증 완료값을 전달!
        Cookie authCookie = new Cookie("importAuth","true");
        authCookie.setMaxAge(60*30000); //30분동안 유지
        authCookie.setPath("/"); // 쿠키가 적용되는 url
        response.addCookie(authCookie);

        JSONObject obj = new JSONObject();
        obj.put("success",true);

        return new ResponseEntity<JSONObject>(obj, HttpStatus.OK);
    }

    @PostMapping(value= "sendMail")
    @ResponseBody
    public String sendmailFunc(EmailAuthDto emailAuthDto) throws MessagingException {
        SendJoinEmailResult result = this.userService.sendJoinEmail(emailAuthDto);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        responseObject.put("salt", emailAuthDto.getSalt());
        return responseObject.toString();
    }
}
