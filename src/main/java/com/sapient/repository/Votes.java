package com.sapient.repository;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "reco_votes_tbl")
public class Votes implements Serializable {

	@Id
	@GeneratedValue
	@Column(name = "vote_id")
	private Integer voteId ;
	
	@Column(name = "nomination_id")
	private Integer nominationId ;
	
	@Column(name = "voter_oid")
	private Integer voterOid;

	@Column(name = "period_Id")
	private int periodId;
	
	public Integer getVoteId() {
		return voteId;
	}

	public void setVoteId(Integer voteId) {
		this.voteId = voteId;
	}

	public Integer getNominationId() {
		return nominationId;
	}

	public void setNominationId(Integer nominationId) {
		this.nominationId = nominationId;
	}

	public Integer getVoterOid() {
		return voterOid;
	}

	public void setVoterOid(Integer voterOid) {
		this.voterOid = voterOid;
	}

	public int getPeriodId() {
		return periodId;
	}

	public void setPeriodId(int periodId) {
		this.periodId = periodId;
	}
}
