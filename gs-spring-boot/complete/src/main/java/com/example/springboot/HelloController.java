package com.example.springboot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.android.gms.tasks.OnCompleteListener;
import androidx.annotation.NonNull;
import com.google.android.gms.tasks.OnFailureListener;
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
	 FileInputStream serviceAccount = new FileInputStream("tourism-app-fd1ae-firebase-adminsdk-muvsn-8c79789f53");

   FirebaseOptions options = new FirebaseOptions.Builder()
  .setCredentials(GoogleCredentials.fromStream(serviceAccount))
  .build();
FirebaseApp.initializeApp(options);

Firestore db = FirestoreClient.getFirestore();
    setDb(db);

	 }
	 catch(Exception e){
	 System.out.println(e);
	 }

        HashMap<String, String> map = new HashMap<>();
        map.put("name", "His name is " + "John");

        Firestore db = getDb();
        db.collection("cities").document("LA")
        .set(map)
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
//                 Log.d(TAG, "DocumentSnapshot successfully written!");
            }
        })
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
//                 Log.w(TAG, "Error writing document", e);
            }
        });
    }

}
