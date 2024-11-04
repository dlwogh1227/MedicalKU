package com.example.medicalku.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Log4j2
@RequiredArgsConstructor
public class DefaultController {

    @GetMapping("/")
    public String redirectToHome(){
        return "redirect:/medicalku/home";
    }

    @GetMapping("/result")
    public void result() {

    }

    @GetMapping("/fail")
    public void fail() {

    }
}
