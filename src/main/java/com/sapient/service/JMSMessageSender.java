package com.sapient.service;

import java.util.Properties;

import javax.jms.DeliveryMode;
import javax.jms.JMSException;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Async
public class JMSMessageSender {
	private static final Logger LOGGER = LoggerFactory.getLogger(JMSMessageSender.class);
	private Queue queue;
	private QueueConnectionFactory connFactory;

	public JMSMessageSender() {
		Properties env = new Properties();
		env.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.activemq.jndi.ActiveMQInitialContextFactory");
		env.put(Context.PROVIDER_URL, "tcp://localhost:61616");
		env.put("queue.sapientNewQueue", "sapientQueue");
		
		// get the initial context
		InitialContext ctx;
		try {
			ctx = new InitialContext(env);
			
			// lookup the queue object
			queue = (Queue) ctx.lookup("sapientNewQueue");
			
			// lookup the queue connection factory
			connFactory = (QueueConnectionFactory) ctx.lookup("QueueConnectionFactory");
			
		} catch (NamingException e) {
			LOGGER.error(e.getMessage());
		} 
		
	}
	
	public void send(String strMessage) {
		

		QueueConnection queueConn = null;
		try {
			
			// create a queue connection
			queueConn = connFactory.createQueueConnection();
			
			// create a queue session
			QueueSession queueSession = queueConn.createQueueSession(false, Session.DUPS_OK_ACKNOWLEDGE);
			// create a queue sender
			QueueSender queueSender = queueSession.createSender(queue);
			queueSender.setDeliveryMode(DeliveryMode.PERSISTENT);
			
			// create a simple message to say "Hello"
			TextMessage message = queueSession.createTextMessage(strMessage);
			
			// send the message
			queueSender.send(message);
			LOGGER.info("JMS message sent: " + message.getText());
			
		} catch (JMSException e) {
			LOGGER.error(e.getMessage());
		} finally {
			try {
				queueConn.close();
			} catch (JMSException e) {
				LOGGER.error(e.getMessage());
			}
			
		}


	}
}

