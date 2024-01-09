package com.coremap.demo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping(value="/home")
public class HomeController {
    @GetMapping(value="/homepage")
    public void getHomepage() {
        log.info("getHomepage()...");
    }
}
