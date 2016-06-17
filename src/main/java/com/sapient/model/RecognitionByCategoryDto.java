package com.sapient.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sapient.repository.Nomination;
import com.sapient.repository.Recognition;
import com.sapient.repository.RecognitionCutOff;
import com.sapient.repository.Winners;

public class RecognitionByCategoryDto implements Serializable {

	private Collection<RecognitionDto> recognitionDto;
	
	private Map<String, Boolean> myVotes;
	private Map<String, Boolean> myWinners;
	private List<Winners> allWinners;

	private List<Nomination> myNominations;

	private RecognitionCutOff recognitionCutOff;
	
	public RecognitionByCategoryDto(List<Nomination> nominations, List<Integer> mySelectedVotes, List<Integer> mySelectedWinners, List<Winners> allWinners, List<Nomination> myNominations, RecognitionCutOff recognitionCutOff) {
		this.allWinners = allWinners;
		this.myNominations = myNominations;
		this.recognitionCutOff = recognitionCutOff;
		this.myVotes = buildMyVotes(mySelectedVotes);
		this.myWinners = buildMyVotes(mySelectedWinners);
		
		
		Map<String, RecognitionDto> map = new HashMap<String, RecognitionDto>();
		
		for(Nomination nomination : nominations) {
			
			RecognitionDto recDto = map.get(nomination.getRecognitionCategory());
			
			if(recDto == null) {
				recDto = new RecognitionDto(nomination.getRecognitionCategory(), new ArrayList<Nomination>());
				map.put(nomination.getRecognitionCategory(), recDto);
			}
			
			recDto.getRecognitions().add(nomination);
		}
		
		recognitionDto = map.values();
		
	}

	private Map<String, Boolean> buildMyVotes(List<Integer> mySelectedVotes) {
		Map<String, Boolean> myVotes = new HashMap<String, Boolean>();
		for (Integer mySelectedVote : mySelectedVotes) {
			myVotes.put(String.valueOf(mySelectedVote), true);
		}
		
		return myVotes;
	}

	public Collection<RecognitionDto> getRecognitionDto() {
		return recognitionDto;
	}

	public void setRecognitionDto(Collection<RecognitionDto> recognitionDto) {
		this.recognitionDto = recognitionDto;
	}

	public Map<String, Boolean> getMyVotes() {
		return myVotes;
	}

	public void setMyVotes(Map<String, Boolean> myVotes) {
		this.myVotes = myVotes;
	}

	public Map<String, Boolean> getMyWinners() {
		return myWinners;
	}

	public void setMyWinners(Map<String, Boolean> myWinners) {
		this.myWinners = myWinners;
	}

	public List<Winners> getAllWinners() {
		return allWinners;
	}

	public void setAllWinners(List<Winners> allWinners) {
		this.allWinners = allWinners;
	}

	public List<Nomination> getMyNominations() {
		return myNominations;
	}

	public void setMyNominations(List<Nomination> myNominations) {
		this.myNominations = myNominations;
	}

	public RecognitionCutOff getRecognitionCutOff() {
		return recognitionCutOff;
	}

	public void setRecognitionCutOff(RecognitionCutOff recognitionCutOff) {
		this.recognitionCutOff = recognitionCutOff;
	}
}
