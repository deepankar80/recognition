package com.sapient.repository;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "nominations")
public class Recognition implements Serializable {

	@Id
	@GeneratedValue
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
	private Integer recognitionPeriod;
	
	@Column(name = "sender_comp_id")
	private String senderCompId;
	
	@Column(name = "nom_insert_ts")
	private Date insertedDate;

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

	public Integer getRecognitionPeriod() {
		return recognitionPeriod;
	}

	public void setRecognitionPeriod(Integer recognitionPeriod) {
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

	public Date getInsertedDate() {
		return insertedDate;
	}

	public void setInsertedDate(Date insertedDate) {
		this.insertedDate = insertedDate;
	}
}
