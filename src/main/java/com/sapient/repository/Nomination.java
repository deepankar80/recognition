package com.sapient.repository;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
public class Nomination implements Serializable {
	@Id
	@Column(name = "nomination_id")
	private Integer nominationId ;
	
	@OneToOne
	@JoinColumn(name = "nominator_OID", referencedColumnName = "oracle_Id")
	private Member nominator;

	@OneToOne
	@JoinColumn(name = "nominee_OID", referencedColumnName = "oracle_Id")
	private Member nominee;
		
	@Column
	private String citation;
	
	@Column(name = "recognition_category")
	private String recognitionCategory;
	
	@Column(name = "recognition_period")
	private String recognitionPeriod;
	
	@Column(name = "sender_comp_id")
	private String senderCompId;

	@Column(name = "number_of_votes")
	private int numberOfvotes;

	@Column(name = "number_of_winners")
	private int numberOfWinners;
	
	@Column(name = "number_of_nominations")
	private int numberOfNominations;
	
	public Integer getNominationId() {
		return nominationId;
	}

	public void setNominationId(Integer nominationId) {
		this.nominationId = nominationId;
	}

	public String getCitation() {
		return citation;
	}

	public void setCitation(String citation) {
		this.citation = citation;
	}

	public String getRecognitionCategory() {
		return recognitionCategory;
	}

	public void setRecognitionCategory(String recognitionCategory) {
		this.recognitionCategory = recognitionCategory;
	}

	public String getRecognitionPeriod() {
		return recognitionPeriod;
	}

	public void setRecognitionPeriod(String recognitionPeriod) {
		this.recognitionPeriod = recognitionPeriod;
	}

	public String getSenderCompId() {
		return senderCompId;
	}

	public void setSenderCompId(String senderCompId) {
		this.senderCompId = senderCompId;
	}

	public Member getNominator() {
		return nominator;
	}

	public void setNominator(Member nominator) {
		this.nominator = nominator;
	}

	public Member getNominee() {
		return nominee;
	}

	public void setNominee(Member nominee) {
		this.nominee = nominee;
	}

	public int getNumberOfvotes() {
		return numberOfvotes;
	}

	public void setNumberOfvotes(int numberOfvotes) {
		this.numberOfvotes = numberOfvotes;
	}

	public int getNumberOfWinners() {
		return numberOfWinners;
	}

	public void setNumberOfWinners(int numberOfWinners) {
		this.numberOfWinners = numberOfWinners;
	}

	public int getNumberOfNominations() {
		return numberOfNominations;
	}

	public void setNumberOfNominations(int numberOfNominations) {
		this.numberOfNominations = numberOfNominations;
	}
	
	public int getPrefernenceCount() {
		return this.numberOfvotes * ((this.numberOfNominations / (this.numberOfWinners + 1 )) - (this.numberOfWinners / this.numberOfNominations));
	}
}
