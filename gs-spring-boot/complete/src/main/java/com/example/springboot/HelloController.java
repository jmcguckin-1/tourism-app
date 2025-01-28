package com.example.springboot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.FileNotFoundException;
import com.google.cloud.firestore.WriteResult;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.FileInputStream;
import java.util.Map;
import java.util.List;
import java.util.Arrays;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;

@RestController
public class HelloController {

public TestService ts = new TestService();
public Utils utils = new Utils();

@GetMapping("/findFlights")
@ResponseBody
    public String findFlights(@RequestParam String departureAirport, @RequestParam String arrivalAirport, @RequestParam String startDate, @RequestParam String endDate, @RequestParam boolean direct,
    @RequestParam boolean oneWay, @RequestParam boolean returnFlight) throws Exception{
       return ts.getFlights(departureAirport, arrivalAirport, startDate, endDate,
       direct, oneWay, returnFlight);
    }

@GetMapping("/findHotels")
@ResponseBody
    public String findHotels(@RequestParam String destination, @RequestParam String startDate,
    @RequestParam String endDate, @RequestParam int numAdults, @RequestParam int numChildren){
    return ts.getHotels(destination, startDate, endDate, numAdults, numChildren);
}

@GetMapping("/getCartItems")
@ResponseBody
    public String getCartItems(@RequestParam String user, @RequestParam String type){
    return ts.getCartItems(user, type);
}

@PostMapping("/payment")
@ResponseBody
    public String payments(@RequestParam int value, @RequestParam String user) throws StripeException{
    return ts.payments(value, user);
}


@PostMapping("/addToBasket")
@ResponseBody
    public String addToBasket(@RequestBody List<Map<String,Object>> ma, @RequestParam String user){
    return ts.addToBasket(ma, user);
}

@GetMapping("/sendEmail")
@ResponseBody
    public String sendEmail(@RequestParam String recipient){
        utils.sendEmail(recipient);
        return "";
    }

@PostMapping("/confirmBooking")
@ResponseBody
    public String saveBooking (@RequestParam String user){
        return ts.saveBooking(user);
    }

}
