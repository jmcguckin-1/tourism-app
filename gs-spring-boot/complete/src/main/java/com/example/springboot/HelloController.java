package com.example.springboot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.WriteResult;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import java.util.*;

@RestController
public class HelloController {
private Firestore db;

public void setDb(Firestore db){
    this.db = db;
}

public Firestore getDb(){
    return this.db;
}

@GetMapping("/secureFlights")
@ResponseBody
    public void secureFlights(@RequestParam String departureAirport, @RequestParam String arrivalAirport, @RequestParam String startDate){
        HashMap<String, String> map = new HashMap<>();
        map.put("destination", arrivalAirport);
        map.put("start", departureAirport);
        map.put("date", startDate);
        System.out.println(Arrays.asList(map));
    }

//     @GetMapping("/getDetails")
//     @ResponseBody
//     public Map<String, String> returnDetails(){
//         HashMap<String, String> map = new HashMap<>();
//         map.put("name", "His name is " + "John");
//         return map;
//

    @GetMapping("/testDB")
    @ResponseBody
    public void returnDetails(){
    try{
	 FileInputStream serviceAccount = new FileInputStream("/Users/johnmcguckin/tourism-app/gs-spring-boot/complete/src/main/java/com/example/springboot/tourism-app-fd1ae-firebase-adminsdk-muvsn-8c79789f53.json");

   FirebaseOptions options = new FirebaseOptions.Builder()
  .setCredentials(GoogleCredentials.fromStream(serviceAccount))
  .build();
    FirebaseApp.initializeApp(options);
//     Firestore db = FirestoreClient.getFirestore();
//     setDb(db);

	 }
	 catch(Exception e){
	 System.out.println(e);
	 }
        try{
             HashMap<String, String> map = new HashMap<>();
        map.put("name", "His name is " + "John");
        if(getDb() != null){
         Firestore db = getDb();
         DocumentReference dr = db.collection("cities").document("LA");
         ApiFuture<WriteResult> future = dr.set(map);
         System.out.println("Update time : " + future.get().getUpdateTime());
        }
        }
        catch(Exception e){
        System.out.println(e);
        }


    }

}
