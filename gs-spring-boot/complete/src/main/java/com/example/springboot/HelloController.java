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
@PostMapping("/findFlights")
@ResponseBody
    public String findFlights(@RequestParam String departureAirport, @RequestParam String arrivalAirport, @RequestParam String startDate, @RequestParam String endDate, @RequestBody List<Map<String,Object>> list) throws Exception{
       return ts.getFlights(departureAirport, arrivalAirport, startDate, endDate, list);
    }

@PostMapping("/findHotels")
@ResponseBody
    public String findHotels(@RequestParam String destination, @RequestParam String startDate,
    @RequestParam String endDate, @RequestParam int numAdults, @RequestParam int numChildren, @RequestBody List<Map<String,Object>> list){
    return ts.getHotels(destination, startDate, endDate, numAdults, numChildren, list);
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


@PostMapping("/confirmBooking")
@ResponseBody
    public String saveBooking(@RequestParam String user){
        return ts.saveBooking(user);
    }

@GetMapping("/getUserDetails")
@ResponseBody
    public String getDetails(@RequestParam String user){
        return ts.getDetails(user);
    }

@GetMapping("/getBookings")
@ResponseBody
    public String getBookings(@RequestParam String user){
        return ts.getBookings(user);
    }

@GetMapping("/getSavedBookings")
@ResponseBody
    public String getSavedBookings(@RequestParam String user){
        return ts.getSavedBookings(user);
    }

@GetMapping("/getReviews")
@ResponseBody
    public String getReviews(@RequestParam String holiday){
        return ts.getReviews(holiday);
    }

@PostMapping("/leaveReview")
@ResponseBody
    public String leaveReview(@RequestParam String user, @RequestParam String review, @RequestParam int stars, @RequestParam String holiday){
        ts.leaveReview(user, review, stars, holiday);
        return "";
    }

@PostMapping("/saveForLater")
@ResponseBody
     public String saveForLater(@RequestBody List<Map<String,Object>> li, @RequestParam String user){
        ts.saveForLater(li, user);
        return "";
    }
}
