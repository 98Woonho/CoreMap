package com.coremap.demo.controller;

import com.coremap.demo.domain.entity.Exercise;
import com.coremap.demo.domain.service.HomeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Slf4j
public class HomeController {
    @Autowired
    private HomeService homeService;

    @GetMapping(value="/")
    public String getHomepage() {
        return "index";
    }

    @GetMapping("exerciseGuide")
    public void getExerciseGuide(@RequestParam(value="name", required = false) String name, Model model) {
        model.addAttribute("name", name);

        if(name != null) {
            Exercise exercise = homeService.getExercise(name);
            model.addAttribute("exercise", exercise);
        }
    }
}
