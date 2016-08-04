package com.sapient.model;

import com.sapient.repository.Recognition;

public class JMSMessage {

	private Recognition message;

	public JMSMessage(Recognition message) {
		this.message = message;
	}
	
	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("Nominator : " + message.getNominator().getOracleId());
		sb.append("\nNominee : " + message.getNominee().getOracleId());
		sb.append("\nCategory : " + message.getRecognitionCategory());
		sb.append("\nPeriod : " + message.getRecognitionPeriod());
		sb.append("\nCitation : " + message.getCitation());
		
		return sb.toString();
	}
	
}
