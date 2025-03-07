package com.example.springboot;

import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;
import javax.mail.Session;
import javax.mail.Transport;
import java.util.*;
import com.sun.mail.util.MailLogger;

public class Utils{
      public Utils(){

      }

     public void sendEmail (String recipient, Map<String,Object> hotelsContent, Map<String,Object> flightsContent) {
     System.out.println("in here!");
      String sender = "jmcguckin308@gmail.com";
      String host = "127.0.0.1";
      Properties properties = System.getProperties();

      properties.setProperty("mail.smtp.host", "smtp.gmail.com");
      properties.setProperty("mail.smtp.port", "465");
      properties.setProperty("mail.smtp.starttls.enable", "true");
      properties.setProperty("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
      properties.setProperty("mail.smtp.auth", "true");


      Session session = Session.getDefaultInstance(properties,
       new javax.mail.Authenticator(){
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(
                sender, "trlz ptgb ptey mjfz");
        }
});

      try
      {
         MimeMessage message = new MimeMessage(session);
         message.setFrom(new InternetAddress(sender));
         message.addRecipient(Message.RecipientType.TO, new InternetAddress(recipient));

         message.setSubject("Booking Confirmation for " + recipient);
         String text = "Destination: " + hotelsContent.get("location") + "\n" + "Stay:" + hotelsContent.get("st") + "-" + hotelsContent.get("end")
                        + "\n" + "Flying from " + flightsContent.get("start") + "\n" +
                        "Total: " + flightsContent.get("total") + "- Paid (via Stripe)" + "\n" + "We hope you have a great trip!";

         message.setText(text);

         Transport.send(message);
         System.out.println("Mail successfully sent");
      }
      catch (MessagingException mex)
      {
         System.out.println("error:" + mex);

      }
    }
}