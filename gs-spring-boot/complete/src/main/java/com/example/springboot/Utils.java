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

     public void sendEmail (String recipient) {
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

         message.setSubject("This is Subject");
         message.setText("This is a test mail");

         Transport.send(message);
         System.out.println("Mail successfully sent");
      }
      catch (MessagingException mex)
      {
         mex.printStackTrace();
      }
    }
}