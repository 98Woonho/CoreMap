package com.coremap.demo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping(value = "policy")
public class PolicyContainer {
    @GetMapping("terms")
    public void getTerms() {

    }

    @GetMapping("privacyPolicy")
    public void getPrivacyPolicy() {

    }
}
