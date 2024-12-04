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
import java.util.HashMap;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import java.io.FileInputStream;
import java.util.List;

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

    public Map<String, Object> getFlights(String start, String end, String startDate){
       System.out.println("hello");
       try{
             Firestore db = FirestoreClient.getFirestore();
       ApiFuture<QuerySnapshot> future = db.collection("flights").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
       if (documents.size() != 0){
        for (DocumentSnapshot ds: documents){
            if (ds.getString("start").equals(start) && ds.getString("end").equals(end)) {
                 Map<String, Object> flightData = ds.getData();
                 Map<String, Object> finalData = new HashMap<String,Object>(flightData);
                 return finalData;
            }
       }
       }

       } catch(Exception e){
        System.out.println(e);
       }

       return null;
    }

}