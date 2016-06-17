package com.sapient.repository;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "member")
public class Member {

	@Id
	@Column(name = "oracle_Id")
	private int oracleId;
	
	@Column
	private String email;
	
	@Column
	private String name;
	
	@Column(name = "nt_login")
	private String ntLogin;
	
	@Column(name = "office_location")
	private String officeLocation;
	
	@Column(name = "person_title")
	private String personTitle;
	
	@Column(name = "project_id")
	private int projectId;
	
	@Column(name = "project_desc")
	private String projectDesc;

	@Column(name = "recognition_team_flg")
	private String recognitionTeamFlag;
	
	@Column(name = "account_id")
	private int accountId;
	
	public int getOracleId() {
		return oracleId;
	}

	public void setOracleId(int oracleId) {
		this.oracleId = oracleId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNtLogin() {
		return ntLogin;
	}

	public void setNtLogin(String ntLogin) {
		this.ntLogin = ntLogin;
	}

	public String getOfficeLocation() {
		return officeLocation;
	}

	public void setOfficeLocation(String officeLocation) {
		this.officeLocation = officeLocation;
	}

	public String getPersonTitle() {
		return personTitle;
	}

	public void setPersonTitle(String personTitle) {
		this.personTitle = personTitle;
	}

	public int getProjectId() {
		return projectId;
	}

	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}

	public String getProjectDesc() {
		return projectDesc;
	}

	public void setProjectDesc(String projectDesc) {
		this.projectDesc = projectDesc;
	}

	public String getRecognitionTeamFlag() {
		return recognitionTeamFlag;
	}

	public void setRecognitionTeamFlag(String recognitionTeamFlag) {
		this.recognitionTeamFlag = recognitionTeamFlag;
	}

	public int getAccountId() {
		return accountId;
	}

	public void setAccountId(int accountId) {
		this.accountId = accountId;
	}
}
