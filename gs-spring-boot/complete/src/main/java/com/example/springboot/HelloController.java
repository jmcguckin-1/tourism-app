package com.example.springboot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
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

@RestController
public class HelloController {

public TestService ts = new TestService();

@GetMapping("/findFlights")
@ResponseBody
    public String findFlights(@RequestParam String departureAirport, @RequestParam String arrivalAirport, @RequestParam String startDate, @RequestParam String endDate, @RequestParam boolean direct,
    @RequestParam boolean oneWay, @RequestParam boolean returnFlight) throws Exception{
       return ts.getFlights(departureAirport, arrivalAirport, startDate, endDate,
       direct, oneWay, returnFlight);
    }

    @PostMapping("/testDB")
    public String returnDetails(){
    try{
       return ts.testDB();
	 }
	 catch(Exception e){
	 System.out.println(e);
	 }

	 return "";

    }

}
