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
   if (FirebaseApp.getApps().isEmpty()) {
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
         Gson gson = new Gson();
         Map<String, Object> map = new HashMap<>();
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
    .setSuccessUrl(domain + "/confirmation")
    .setCancelUrl(domain + "/cancel")
    .build();
      Session session = Session.create(params);
      map.put("session", session.getUrl());
      return gson.toJson(map);
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
            System.out.println(e);
        }
        if (li.size() == 0){
            Map<String, Object> map = new HashMap<>();
            map.put("error", true);
            flightLi.add(map);
            return gson.toJson(flightLi);
        }
        if (type.equals("flights")){
            Map<String, Object> flightData = flightLi.get(0);
            flightData.put("total", price);
            flightData.put("error", false);
            return gson.toJson(flightLi);
        }

        Map<String, Object> hotel = li.get(0);
        hotel.put("total", price);
        hotel.put("error", false);
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

    public boolean hotelFilters(Map <String,Object> map, List<Map<String,Object>> li){
            ArrayList<String> al = (ArrayList<String>) map.get("facilities");
            int match = 0;
            if (al.size() == 0){
                return false;
            }
            if (al.contains("Single Bed") && (boolean) li.get(0).get("singleBeds")){
                match += 1;
            }

            if (al.contains("Wi-Fi") && (boolean) li.get(0).get("wifi")){
                match += 1;
            }

            if (al.contains("Pool") && (boolean) li.get(0).get("pool")){
                match += 1;
            }

            if (match == 3){
                map.put("match", "Exact Filter Match");
                return true;
            }
            else if (match > 0){
                map.put("match", "Not Exact Match, But with Similar Filters");
                return true;
            }
            return false;
    }

    public boolean flightFilters(Map<String,Object> ma, List<Map<String,Object>> li){
            int match = 0;

            if ((boolean) ma.get("direct") && (boolean) li.get(0).get("direct")){
                  match += 1;
            }
            if ((boolean) ma.get("return") && (boolean) li.get(0).get("return")){
                  match += 1;
            }

            if (match == 2){
                ma.put("match", "Exact Filter Match");
                return true;
            }
            else if (match > 0){
                ma.put("match", "Not Exact Match, But with Similar Filters");
                return true;
            }
            return false;

    }

    public String getHotels(String destination, String startDate, String endDate, int numAdults,
    int numChildren, List<Map<String,Object>> list){

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
                boolean adults = numAdults == Integer.parseInt(ds.get("adults").toString());
                boolean children = numChildren == Integer.parseInt(ds.get("children").toString());
                 if (checkDates(flightTimeZero, startDate) && checkDates(flightTimeOne, endDate)){
                    if (adults && children){
                        Map<String, Object> hotelData = ds.getData();
                        hotelData.put("id", ds.getId());
                        hotelData.put("user", "John McGuckin");
                        hotelData.put("day1", flightTimeZero);
                        hotelData.put("final_day", flightTimeOne);
                        hotelData.put("st", flightTimeZero);
                        hotelData.put("end", flightTimeOne);
                        if (hotelFilters(hotelData, list)){
                             li.add(hotelData);
                        }

                    }
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

    public String getDetails(String user){
      Gson gson = new Gson();
        try{
             Firestore db = FirestoreClient.getFirestore();
       ApiFuture<QuerySnapshot> future = db.collection("users").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (DocumentSnapshot ds: documents){
            if (ds.get("email").equals(user)) {
              Map map = ds.getData();
              return gson.toJson(map);
            }
        }
       }

        catch(Exception e){
        System.out.println(e);
       }
        return "";
    }

    public void leaveReview(String user, String review, int stars, String holiday){
         Firestore db = FirestoreClient.getFirestore();

           try{
       ApiFuture<QuerySnapshot> future = db.collection("users").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (DocumentSnapshot ds: documents){
            if (ds.get("email").equals(user)) {
                 DocumentReference docRef = db.collection("users").document(ds.getId());
                 if (ds.getData().containsKey("review_count")){
                     ApiFuture<WriteResult> future1 = docRef.update("review_count", Integer.valueOf(ds.get("review_count").toString()) + 1);
                 }
                 else{
                      ApiFuture<WriteResult> future1 = docRef.update("review_count", 1);
                 }

            }
        }
       }

        catch(Exception e){
        System.out.println(e);
       }
         Map ma = new HashMap<String,Object>();
         ma.put("user", user);
         ma.put("review", review);
         ma.put("stars", stars);
         ma.put("holiday", holiday);
         ApiFuture<DocumentReference> addedDocRef = db.collection("reviews").add(ma);
    }

    // stays they have booked
    public String getBookings(String user){
        ArrayList<Map<String,Object>> li = new ArrayList<>();
        Gson gson = new Gson();
        try{
             Firestore db = FirestoreClient.getFirestore();
       ApiFuture<QuerySnapshot> future = db.collection("confirmed_bookings").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (DocumentSnapshot ds: documents){
            Map<String, Object> ma = (Map<String, Object>) ds.get("flights");
            if (ma.get("email").equals(user)) {
              Map map = new HashMap<String, Object>();
              map.put("id", ma.get("id"));
              map.put("start", ma.get("start"));
              map.put("end", ma.get("end"));
              map.put("ft1", ma.get("ft1"));
              map.put("rt2", ma.get("rt2"));
              li.add(map);
            }
        }
       }

        catch(Exception e){
        System.out.println(e);
       }

       return gson.toJson(li);
    }

    public void saveForLater(List<Map<String,Object>> li, String user){
         Firestore db = FirestoreClient.getFirestore();
         Map a = li.get(0);
         a.put("user", user);
         ApiFuture<DocumentReference> addedFlight = db.collection("saved_bookings").add(a);
    }

    // bookings they save for later
    public String getSavedBookings(String user){
           ArrayList<Map<String,Object>> li = new ArrayList<>();
        Gson gson = new Gson();
        try{
             Firestore db = FirestoreClient.getFirestore();
       ApiFuture<QuerySnapshot> future = db.collection("saved_bookings").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (DocumentSnapshot ds: documents){
            if (user.equals(ds.get("user"))){
                  Map<String, Object> savedBooking = ds.getData();
                  savedBooking.put("id", ds.getId());
                  li.add(savedBooking);
            }
        }
       }

        catch(Exception e){
        System.out.println(e);
       }

       return gson.toJson(li);
    }

    public String getReviews(String holiday){
         ArrayList<Map<String,Object>> li = new ArrayList<>();
        Gson gson = new Gson();
        try{
             Firestore db = FirestoreClient.getFirestore();
       ApiFuture<QuerySnapshot> future = db.collection("reviews").get();
       List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (DocumentSnapshot ds: documents){
            if (holiday.equals(ds.get("holiday"))){
                  Map<String, Object> reviewData = ds.getData();
                  reviewData.put("id", ds.getId());
                  li.add(reviewData);
            }
        }
       }

        catch(Exception e){
        System.out.println(e);
       }

       return gson.toJson(li);
    }


    public void removeData(String user, String collection){
         Firestore db = FirestoreClient.getFirestore();
           try{
             ApiFuture<QuerySnapshot> future3 = db.collection(collection).get();
              List<QueryDocumentSnapshot> documents = future3.get().getDocuments();
                for (DocumentSnapshot ds: documents){
                   if (ds.getString("email").equals(user)){
                       db.collection(collection).document(ds.getId()).delete();
                   }
                }

             }
             catch(Exception e){
             System.out.println(e);
             }
    }

    public String saveBooking(String user){
        Gson gson = new Gson();
        boolean success = false;

         DocumentReference docRef = null;
          Firestore db = FirestoreClient.getFirestore();
          try{
             ApiFuture<QuerySnapshot> future = db.collection("users").get();
              List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                for (DocumentSnapshot ds: documents){
                   if (ds.getString("email").equals(user)){
                       docRef = db.collection("users").document(ds.getId());
                       }
                }

             }
             catch(Exception e){
             System.out.println(e);
             }

        String hotels = getCartItems(user, "hotels");
        String flights = getCartItems(user, "flights");
        List<Map<String,Object>> hotelsMap = gson.fromJson(hotels, List.class);
        List<Map<String,Object>> flightsMap = gson.fromJson(flights, List.class);

        Utils u = new Utils();
        u.sendEmail(user, hotelsMap.get(0), flightsMap.get(0));

        Map newMap = new HashMap<String,Object>();
        newMap.put("hotel", hotelsMap.get(0));
        newMap.put("flights", flightsMap.get(0));
        ApiFuture<DocumentReference> addedDocRef = db.collection("confirmed_bookings").add(newMap);

        ApiFuture<WriteResult> future = docRef.update("hotel_added", false);
        ApiFuture<WriteResult> future2 = docRef.update("flight_added", false);
        success = true;

        removeData(user, "flight_bookings");
        removeData(user, "hotel_bookings");
        removeData(user, "bookings");

        Map<String, Object> map = new HashMap<>();
        map.put("success", success);
        return gson.toJson(map);
    }

    public String getFlights(String start, String end, String startDate, String endDate, int numAdults, int numChildren, List<Map<String,Object>> list){
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
                 boolean adults = numAdults == Integer.parseInt(ds.get("adults").toString());
                 boolean children = numChildren == Integer.parseInt(ds.get("children").toString());
                 if (checkDates(flightTimeZero, startDate) && checkDates(secondOne, endDate)){
                    if (adults && children){
                    Map<String, Object> flightData = ds.getData();
                    flightData.put("id", ds.getId());
                    flightData.put("ft1", flightTimeZero);
                    flightData.put("ft2", flightTimeOne);
                    flightData.put("rt1", secondOne);
                    flightData.put("rt2", secondTwo);
                        if (flightFilters(flightData, list)){
                            li.add(flightData);
                        }
                    }

                 }
            }
       }

       } catch(Exception e){
        System.out.println(e);
       }
       return gson.toJson(li);
    }
}
