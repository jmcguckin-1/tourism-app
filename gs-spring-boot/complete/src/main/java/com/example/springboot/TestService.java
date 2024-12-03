package com.example.springboot;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.WriteResult;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import org.springframework.stereotype.Service;
import java.util.HashMap;

@Service
public class TestService{

    public TestService(){

    }
    public String testDB() throws Exception{
         Firestore db = FirestoreClient.getFirestore();
         HashMap<String, String> map = new HashMap<>();
         map.put("name", "His name is " + "John");
         DocumentReference dr = db.collection("cities").document("LA");
         ApiFuture<WriteResult> future = dr.set(map);
         return future.get().getUpdateTime().toString();
    }

}