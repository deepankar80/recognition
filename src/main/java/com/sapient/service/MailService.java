package com.sapient.service;

import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;

@org.springframework.stereotype.Service
public class MailService {
	private final Session session;
	private final String from;

	public MailService() {
		final String host = "ggnoutlook.sapient.com";
		final String user = "ddixit@sapient.com";
		final String password = "Pa55word@516";

		this.from = "ddixit@sapient.com";

		// Get the session object
		Properties props = new Properties();
		props.put("mail.smtp.host", host);
		props.put("mail.smtp.auth", "true");
		props.setProperty("mail.smtps.ssl.enable", "true");

		this.session = Session.getDefaultInstance(props,
				new javax.mail.Authenticator() {
					protected PasswordAuthentication getPasswordAuthentication() {
						return new PasswordAuthentication(user, password);
					}
				});
	}

	public boolean send(String to, String textMsg) throws MessagingException {
		// Compose the message
		try {
			MimeMessage message = new MimeMessage(this.session);
			message.setFrom(new InternetAddress(this.from));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			message.setSubject("Feedback saved Succesfully.");
			message.setText(
					"<html><body>"
							+ textMsg //"<h3><u>Feedback testing</u></h3><div><ol><li>item 1</li><li>item 2</li><li>item 3</li></ol><pre>Pre</pre><blockquote>It was said by</blockquote></div>"
							+ "</body></html>", "utf-8", "html");

			// send the message
			Transport.send(message);

			System.out.println("message sent successfully...");

		} catch (MessagingException e) {
			e.printStackTrace();
			
			throw e;
		}
		
		return true;
	}
	
	public static void main1(String[] args) throws MessagingException {
		// Recipient's email ID needs to be mentioned.
	      String to = "ddixit@sapient.com";

	      // Sender's email ID needs to be mentioned
	      String from = "ddixit@sapient.com";

	      // Assuming you are sending email from localhost
	      String host = "ggnoutlook.sapient.com";

	      // Get system properties
	      Properties properties = System.getProperties();

	      // Setup mail server

	      properties.setProperty("mail.smtp.host", host);
	      //properties.setProperty("mail.smtp.port", "465");


	      properties.put("mail.smtp.starttls.enable", "true");
	      properties.setProperty("mail.smtp.user", "ddixit@sapient.com");
	      properties.setProperty("mail.smtp.password", "Pa55word@516");
	      properties.setProperty("mail.smtp.auth", "true");
	      properties.setProperty("mail.smtps.ssl.enable", "false");
	      
	      properties.put("mail.smtp.auth", "true");
	      // Get the default Session object.
	      Session session = Session.getDefaultInstance(properties, new javax.mail.Authenticator() 
	      {
	          protected PasswordAuthentication getPasswordAuthentication() 
	          {
	              return new PasswordAuthentication("ddixit@sapient.com","Pa55word@516");
	          }
	     });
	      session.setDebug(true);

	      try{
	         // Create a default MimeMessage object.
	         MimeMessage message = new MimeMessage(session);

	         // Set From: header field of the header.
	         message.setFrom(new InternetAddress(from));

	         // Set To: header field of the header.
	         message.addRecipient(Message.RecipientType.TO,
	                                  new InternetAddress(to));

	         // Set Subject: header field
	         message.setSubject("This is the Subject Line!");

	         // Now set the actual message
	         message.setText("This is actual message");

	         // Send message
	         Transport.send(message);
	         System.out.println("Sent message successfully....");
	      }catch (MessagingException mex) {
	         mex.printStackTrace();
	      }
	}
}