package com.sapient.model;

import java.io.Serializable;
import java.util.List;

import com.sapient.repository.Nomination;
import com.sapient.repository.Recognition;

public class RecognitionDto implements Serializable {

	private String category; 
	private List<Nomination> recognitions;
	
	public RecognitionDto(String category, List<Nomination> recognitions) {
		this.category = category;
		this.recognitions = recognitions;
	}

	public List<Nomination> getRecognitions() {
		return recognitions;
	}

	public void setRecognitions(List<Nomination> recognitions) {
		this.recognitions = recognitions;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
	
}
