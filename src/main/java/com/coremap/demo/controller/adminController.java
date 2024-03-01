package com.coremap.demo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Slf4j
@RequestMapping("admin")
public class adminController {
    @GetMapping("adminPage")
    public void getAdminPage(@RequestParam("function") String function,
                             Model model) {
        model.addAttribute("function", function);
    }
}
