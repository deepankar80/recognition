package com.sapient.repository;

import java.text.ParseException;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.sapient.util.Util;

@Entity
@Table(name = "recognition_cutoff_tbl")
public class RecognitionCutOff {

	@Id
	@Column(name = "period_Id")
	private int periodId;
		
	@Column(name = "recognition_description")
	private String recognitionDescription;
	
	@Column(name = "recognition_period_start_ts")
	private Date recognitionPeriodStart;

	@Column(name = "recognition_period_end_ts")
	private Date recognitionPeriodEnd;

	@Column(name = "recognition_cutoff_dt")
	private Date recognitionPeriodCutoff;

	@Column(name = "voting_cutoff_dt")
	private Date votingCutoff;

	@Column(name = "account_id")
	private int accountId;
	
	public int getPeriodId() {
		return periodId;
	}

	public void setPeriodId(int periodId) {
		this.periodId = periodId;
	}

	public Date getRecognitionPeriodStart() {
		return recognitionPeriodStart;
	}
	
	public void setRecognitionPeriodStartStr(String recognitionPeriodStartStr) throws ParseException {
		this.recognitionPeriodStart = Util.getDate(recognitionPeriodStartStr);
	}

	public void setRecognitionPeriodStart(Date recognitionPeriodStart) {
		this.recognitionPeriodStart = recognitionPeriodStart;
	}

	public Date getRecognitionPeriodEnd() {
		return recognitionPeriodEnd;
	}

	public void setRecognitionPeriodEnd(Date recognitionPeriodEnd) {
		this.recognitionPeriodEnd = recognitionPeriodEnd;
	}

	public void setRecognitionPeriodEndStr(String recognitionPeriodEndStr) throws ParseException {
		this.recognitionPeriodEnd = Util.getDate(recognitionPeriodEndStr);
	}

	public Date getRecognitionPeriodCutoff() {
		return recognitionPeriodCutoff;
	}

	public void setRecognitionPeriodCutoff(Date recognitionPeriodCutoff) {
		this.recognitionPeriodCutoff = recognitionPeriodCutoff;
	}

	public void setRecognitionPeriodCutoffStr(String recognitionPeriodCutoffStr) throws ParseException {
		this.recognitionPeriodCutoff = Util.getDate(recognitionPeriodCutoffStr);
	}

	public Date getVotingCutoff() {
		return votingCutoff;
	}

	public void setVotingCutoff(Date votingCutoff) {
		this.votingCutoff = votingCutoff;
	}
	public void setVotingCutoffStr(String votingCutoffStr) throws ParseException {
		this.votingCutoff = Util.getDate(votingCutoffStr);
	}

	public String getRecognitionDescription() {
		return recognitionDescription;
	}

	public void setRecognitionDescription(String recognitionDescription) {
		this.recognitionDescription = recognitionDescription;
	}

	public int getAccountId() {
		return accountId;
	}

	public void setAccountId(int accountId) {
		this.accountId = accountId;
	}
}
