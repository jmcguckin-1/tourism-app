package com.example.springboot;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.WriteResult;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.List;
import java.util.HashMap;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Date;
import com.google.gson.Gson;

@Service
public class TestService{

    public TestService(){
         try{
      FileInputStream serviceAccount = new FileInputStream("/Users/johnmcguckin/tourism-app/gs-spring-boot/complete/src/main/java/com/example/springboot/tourism-app-fd1ae-firebase-adminsdk-muvsn-8c79789f53.json");
   FirebaseOptions options = new FirebaseOptions.Builder()
  .setCredentials(GoogleCredentials.fromStream(serviceAccount))
  .build();
   if(FirebaseApp.getApps().isEmpty()) {
   FirebaseApp.initializeApp(options);
   }

    } catch(Exception e){
        System.out.println(e);
    }

    }
    public String testDB() throws Exception{
         Firestore db = FirestoreClient.getFirestore();
         HashMap<String, String> map = new HashMap<>();
         map.put("name", "His name is " + "John");
         DocumentReference dr = db.collection("cities").document("LA");
         ApiFuture<WriteResult> future = dr.set(map);
         return future.get().getUpdateTime().toString();
    }

    public String getFlights(String start, String end, String startDate, String endDate, boolean direct,
    boolean oneWay, boolean returnFlight){
       ArrayList<Map<String,Object>> li = new ArrayList<>();
       Gson gson = new Gson();
       try{
             Firestore db = FirestoreClient.getFirestore();
       ApiFuture<QuerySnapshot> future = db.collection("flights").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (DocumentSnapshot ds: documents){
            if (ds.getString("start").equals(start) && ds.getString("end").equals(end)) {
                 // need to filter dates, more important
                 ArrayList<Timestamp> al = (ArrayList<Timestamp>) ds.get("first_flight");
                 ArrayList<Timestamp> al1 = (ArrayList<Timestamp>) ds.get("return_flight");
                 String flightTimeZero = al.get(0).toDate().toString();
                 System.out.println(startDate);
                 System.out.println();
                 System.out.println(flightTimeZero);
                 String flightTimeOne = al.get(1).toDate().toString();
                 String secondOne = al1.get(0).toDate().toString();
                 String secondTwo = al1.get(1).toDate().toString();

                 if (ds.getBoolean("direct") == direct){
                        // todo filtering for type of flight.
                 }

                 // do two substrings
                 // check if one contains the other

                 Map<String, Object> flightData = ds.getData();
                 flightData.put("id", ds.getId());
                 flightData.put("ft1", flightTimeZero);
                 flightData.put("ft2", flightTimeOne);
                 flightData.put("rt1", secondOne);
                 flightData.put("rt2", secondTwo);

                 li.add(flightData);
            }
       }

       } catch(Exception e){
        System.out.println(e);
       }

       return gson.toJson(li);
    }

}