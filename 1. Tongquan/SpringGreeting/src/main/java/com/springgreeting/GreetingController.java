package com.springgreeting;

import java.io.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class GreetingController {
    @GetMapping("/great")
    public String greeting(@RequestParam String name, Model model) {
        model.addAttribute("name", name);
        return "index";
    }

//    @RequestMapping("/great")
//    public String greeting(Model model) {
//        model.addAttribute("name", "Nhat Hoang");
//        return "index";
//    }
}