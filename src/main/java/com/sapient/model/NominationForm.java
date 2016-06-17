package com.sapient.model;

import java.util.LinkedHashMap;

public class NominationForm {

	private Integer nominationId;
	private Integer nominatorOracleId;
	private Integer nomineeOracleId;
	private String message;
	private String category;
	private LinkedHashMap<String, Boolean> votes;
	private LinkedHashMap<String, Boolean> winners;
	private Integer submittedBy;
	private Integer periodId;
	private Integer accountId;
	private String submitter;
	
	public Integer getNominatorOracleId() {
		return nominatorOracleId;
	}
	public void setNominatorOracleId(Integer nominatorOracleId) {
		this.nominatorOracleId = nominatorOracleId;
	}
	public Integer getNomineeOracleId() {
		return nomineeOracleId;
	}
	public void setNomineeOracleId(Integer nomineeOracleId) {
		this.nomineeOracleId = nomineeOracleId;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public LinkedHashMap<String, Boolean> getVotes() {
		return votes;
	}
	public void setVotes(LinkedHashMap<String, Boolean> votes) {
		this.votes = votes;
	}
	public Integer getSubmittedBy() {
		return submittedBy;
	}
	public void setSubmittedBy(Integer submittedBy) {
		this.submittedBy = submittedBy;
	}
	public LinkedHashMap<String, Boolean> getWinners() {
		return winners;
	}
	public void setWinners(LinkedHashMap<String, Boolean> winners) {
		this.winners = winners;
	}
	public Integer getNominationId() {
		return nominationId;
	}
	public void setNominationId(Integer nominationId) {
		this.nominationId = nominationId;
	}
	public Integer getPeriodId() {
		return periodId;
	}
	public void setPeriodId(Integer periodId) {
		this.periodId = periodId;
	}
	public Integer getAccountId() {
		return accountId;
	}
	public void setAccountId(Integer accountId) {
		this.accountId = accountId;
	}
	public String getSubmitter() {
		return submitter;
	}
	public void setSubmitter(String submitter) {
		this.submitter = submitter;
	}
	
}