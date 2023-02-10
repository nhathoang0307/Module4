package com.example.ungdungmaytinhcanhan;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class Caculator {

    @GetMapping("/caculator")
    public String caculator() {
        return "index";
    }

    @PostMapping(value = "/result")
    public String result(ModelMap model, @RequestParam("number1") double number1, @RequestParam("number2") double number2, @RequestParam("calculation") String calcu) {
        double result = 0;
        switch (calcu) {
            case "add":
                result = number1 + number2;
                break;
            case "sub":
                result = number1 - number2;
                break;
            case "mul":
                result = number1 * number2;
                break;
            case "div":
                result = number1 / number2;
                break;
        }

        model.addAttribute("number1", number1);
        model.addAttribute("number2", number2);
        model.addAttribute("result", result);
        return "index";

    }






}
