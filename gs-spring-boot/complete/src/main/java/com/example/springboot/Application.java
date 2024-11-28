package com.example.springboot;

import java.util.Arrays;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import java.io.FileInputStream;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.FirebaseApp;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
        FileInputStream serviceAccount = new FileInputStream("tourism-app-fd1ae-firebase-adminsdk-muvsn-8c79789f53");

        FirebaseOptions options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();

        FirebaseApp.initializeApp(options);

		SpringApplication.run(Application.class, args);
	}

}
