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
import java.util.Arrays;
import com.google.gson.Gson;

import java.nio.file.Paths;
import com.stripe.Stripe;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.model.PaymentIntent;
import com.stripe.exception.StripeException;
import spark.ModelAndView;
import static spark.Spark.get;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class TestService{

    public TestService(){
         try{
      FileInputStream serviceAccount = new FileInputStream("/Users/john/repos/tourism-app/gs-spring-boot/complete/src/main/java/com/example/springboot/tourism-app-fd1ae-firebase-adminsdk-muvsn-8c79789f53.json");
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

    public String payments(int amount, String user) throws StripeException {
         Stripe.apiKey = "sk_test_51QjfupAOjjwqVkzkOSwj2TR1Zem8GUq6z6PG1goe5d674gqGrtvUIONBNkY58LuTpv0UkAIZU7kQH6GGHGI284Hm000iCwePvL";
    String domain = "http://localhost:3000";
    long total = amount;

    SessionCreateParams params =
  SessionCreateParams.builder()
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPriceData(
          SessionCreateParams.LineItem.PriceData.builder()
            .setCurrency("gbp")
            .setProductData(
              SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName("booking")
                .build()
            )
            .setUnitAmount(total*100)
            .build()
        )
        .setQuantity(1L)
        .build()
    )
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .setSuccessUrl(domain + "/success")
    .setCancelUrl(domain + "/cancel")
    .build();
      Session session = Session.create(params);
      System.out.println(session.getUrl());
      return "";
    }

    public String getCartItems(String user, String type){
        Gson gson = new Gson();
        Firestore db = FirestoreClient.getFirestore();
        ArrayList<Map<String,Object>> li = new ArrayList<>();
        ArrayList<Map<String,Object>> flightLi = new ArrayList<>();
        double price = 0.0;
        try{
             ApiFuture<QuerySnapshot> future = db.collection("hotel_bookings").get();
              List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                for (DocumentSnapshot ds: documents){
                   if (ds.getString("email").equals(user)) {
                    Map<String, Object> hotelData = ds.getData();
                    price += ds.getDouble("price");
                    li.add(hotelData);
                }
                }

              ApiFuture<QuerySnapshot> flights = db.collection("flight_bookings").get();
              List<QueryDocumentSnapshot> doc1 = flights.get().getDocuments();
                for (DocumentSnapshot ds: doc1){
                 if (ds.getString("email").equals(user)) {
                    Map<String, Object> flightData = ds.getData();
                    price += ds.getDouble("price");
                    flightLi.add(flightData);
                }
              }
        }
         catch (Exception e){
            System.out.println("this method:" + e);
        }
        if (type.equals("flights")){
            Map<String, Object> flightData = flightLi.get(0);
            flightData.put("total", price);
            return gson.toJson(flightLi);
        }

        Map<String, Object> hotel = li.get(0);
        hotel.put("total", price);
        return gson.toJson(li);
    }

    public String addToBasket(List<Map <String,Object>> ma, String user){
        Gson gson = new Gson();
        ArrayList<Map<String,Object>> li = new ArrayList<>();
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = null;
        // checks if user basket has only one flight and one hotel
          try{
             ApiFuture<QuerySnapshot> future = db.collection("users").get();
              List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                for (DocumentSnapshot ds: documents){
                   if (ds.getString("email").equals(user)){
                       docRef = db.collection("users").document(ds.getId());
                     if (ds.getBoolean("flight_added") && ds.getBoolean("hotel_added")) {
                         Map<String, Object> map = new HashMap<>();
                         map.put("basket_full", true);
                         li.add(map);
                         return gson.toJson(li);
                     }
                   }
                }
        }
         catch (Exception e){
            System.out.println(e);
        }

        for (Map <String, Object> e: ma){
            // Check what type of map it is and add to corresponding table
          if (e.containsKey("accomodation_name")){
             e.remove("start_date");
             e.remove("end_date");
             e.put("email", user);
             ApiFuture<DocumentReference> addedDocRef = db.collection("hotel_bookings").add(e);
             ApiFuture<WriteResult> future = docRef.update("hotel_added", true);
          }
          else if (e.containsKey("airline")){
            e.put("email", user);
            ApiFuture<DocumentReference> addedFlight = db.collection("flight_bookings").add(e);
            ApiFuture<WriteResult> future = docRef.update("flight_added", true);
          }

        }
        Map<String, Object> map = new HashMap<>();
        li.add(map);
        return gson.toJson(li);

    }

    public String getHotels(String destination, String startDate, String endDate, int numAdults,
    int numChildren){
        // need firebase user reference in here
        ArrayList<Map<String,Object>> li = new ArrayList<>();
        Gson gson = new Gson();
        try{
             Firestore db = FirestoreClient.getFirestore();
       ApiFuture<QuerySnapshot> future = db.collection("hotels").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (DocumentSnapshot ds: documents){
            if (ds.getString("location").equals(destination)) {
                Timestamp t = (Timestamp) ds.get("start_date");
                Timestamp t1 = (Timestamp) ds.get("end_date");
                String flightTimeZero = t.toDate().toString();
                String flightTimeOne = t1.toDate().toString();
                 if (checkDates(flightTimeZero, startDate) && checkDates(flightTimeOne, endDate)){
                 // add logic for that
//                     if (numAdults == ds.getInt("adults")){
//                     }
                    Map<String, Object> hotelData = ds.getData();
                    hotelData.put("id", ds.getId());
                    hotelData.put("user", "John McGuckin");
                    hotelData.put("day1", flightTimeZero);
                    hotelData.put("final_day", flightTimeOne);
                    hotelData.put("st", flightTimeZero);
                    hotelData.put("end", flightTimeOne);
                    li.add(hotelData);
                 }
            }
       }

       } catch(Exception e){
        System.out.println(e);
       }
        return gson.toJson(li);
    }

    // used to verify dates match up
    public static boolean checkDates(String a, String b){
     String[] tokens = a.split(" ");
     String firebaseDate = "";
     int count = 0;
     while (count != 2){
        firebaseDate += tokens[count] + " ";
        count++;
     }
     firebaseDate += tokens[count];
     if (b.contains(firebaseDate)){
          return true;
     }
     return false;

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
                 ArrayList<Timestamp> al = (ArrayList<Timestamp>) ds.get("first_flight");
                 ArrayList<Timestamp> al1 = (ArrayList<Timestamp>) ds.get("return_flight");
                 String flightTimeZero = al.get(0).toDate().toString();
                 String flightTimeOne = al.get(1).toDate().toString();
                 String secondOne = al1.get(0).toDate().toString();
                 String secondTwo = al1.get(1).toDate().toString();
                 if (checkDates(flightTimeZero, startDate) && checkDates(secondOne, endDate)){
                    Map<String, Object> flightData = ds.getData();
                    flightData.put("id", ds.getId());
                    flightData.put("ft1", flightTimeZero);
                    flightData.put("ft2", flightTimeOne);
                    flightData.put("rt1", secondOne);
                    flightData.put("rt2", secondTwo);
                    li.add(flightData);
                 }
            }
       }

       } catch(Exception e){
        System.out.println(e);
       }
       return gson.toJson(li);
    }
}
