package com.example;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class SendMailBySite {
 public static void main(String[] args) {

  String host="email-smtp.us-west-2.amazonaws.com";
  final String user="AKIAJI345DWP72YZBOMA";//change accordingly
  final String password="AnnJuxYjs1mq4gpYlwriUnrl3iGpRgY2NsVg/ZvbNFmy";//change accordingly
  
  String to="ddixit@sapient.com";//change accordingly

   //Get the session object
   Properties props = new Properties();
   props.put("mail.smtp.host",host);
   props.put("mail.smtp.auth", "true");
   
   Session session = Session.getDefaultInstance(props,
    new javax.mail.Authenticator() {
      protected PasswordAuthentication getPasswordAuthentication() {
	return new PasswordAuthentication(user,password);
      }
    });

   //Compose the message
    try {
     MimeMessage message = new MimeMessage(session);
     message.setFrom(new InternetAddress(to));
     message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));
     message.setSubject("Feedback saved Succesfully.");
     message.setText("<html><body>"
     		+ "<h3><u>Feedback testing</u></h3><div><ol><li>item 1</li><li>item 2</li><li>item 3</li></ol><pre>Pre</pre><blockquote>It was said by</blockquote></div>"
     		+ "</body></html>",
    		 "utf-8", "html");
     
    //send the message
     Transport.send(message);

     System.out.println("message sent successfully...");
 
     } catch (MessagingException e) {e.printStackTrace();}
 }
}