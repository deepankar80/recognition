package com.sapient.repository;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "winner")
public class Winners implements Serializable {

	@Id
	@GeneratedValue
	@Column(name = "win_id")
	private Integer winId ;
	
	@OneToOne
	@JoinColumn(name = "nomination_id", referencedColumnName = "nomination_id")
	private Recognition nomination;

	@Column(name = "period_Id")
	private int periodId;

	public Integer getWinId() {
		return winId;
	}

	public void setWinId(Integer winId) {
		this.winId = winId;
	}

	public Recognition getNomination() {
		return nomination;
	}

	public void setNomination(Recognition nomination) {
		this.nomination = nomination;
	}

	public int getPeriodId() {
		return periodId;
	}

	public void setPeriodId(int periodId) {
		this.periodId = periodId;
	}
}
