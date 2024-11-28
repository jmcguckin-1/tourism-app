package com.example.springboot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.*;

@RestController
public class HelloController {

    @GetMapping("/getDetails")
    @ResponseBody
    public Map<String, String> returnDetails(){
        HashMap<String, String> map = new HashMap<>();
        map.put("name", "His name is " + "John");
        return map;
    }

}
