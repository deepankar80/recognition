package com.sapient.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sapient.controller.FeedbackController;
import com.sapient.repository.Member;
import com.sapient.repository.MembersRepository;
import com.sapient.repository.Nomination;
import com.sapient.repository.NominationRepository;
import com.sapient.repository.Recognition;
import com.sapient.repository.RecognitionCutOff;
import com.sapient.repository.RecognitionCutOffRepository;
import com.sapient.repository.RecognitionRepository;
import com.sapient.repository.Votes;
import com.sapient.repository.VotesRepository;
import com.sapient.repository.Winners;
import com.sapient.repository.WinnersRepository;

@Service
public class RecognitionService {
	private static final Logger LOGGER = LoggerFactory.getLogger(RecognitionService.class);
	
	@Autowired
	private RecognitionRepository recognitionRepository;
	
	@Autowired
	private NominationRepository nominationRepository;
	
	@Autowired
	private VotesRepository votesRepository;
	
	@Autowired
	private WinnersRepository winnersRepository;
	
	@Autowired
	private MembersRepository memberRepository;
	
	@Autowired
	private RecognitionCutOffRepository recognitionCutOffRepository ;
	
	@Transactional(readOnly = true)
	public List<Nomination> getAllRecognition(int periodId) {
		return nominationRepository.getAllNomination(periodId);
	}
	
	@Transactional(readOnly = true)
	@Cacheable(value="nominationCache", key="#oracleId")
	public List<Nomination> getMyRecognition(Integer oracleId) {
		LOGGER.info("Loading recognition from DB for : " + oracleId);
		return nominationRepository.getMyNomination(oracleId);
	}
	
	@Transactional(readOnly = true)
	public RecognitionCutOff getNominationPeriod(Integer submittedBy) {
		return recognitionCutOffRepository.getNominationPeriod(submittedBy);
	}
	
	@Transactional
	@CacheEvict(value="nominationCache", key="#recognition.nominator.oracleId")
	public Recognition insertRecognition(Recognition recognition) {
		return recognitionRepository.save(recognition);
	}

	@Transactional
	public List<Votes> addVotes(ArrayList<Votes> votes, Integer voteroId, Integer periodId) {
		votesRepository.clearMyVotes(voteroId, periodId);
		return votesRepository.save(votes);
	}
	
	public List<Integer> getMyVotes(Integer voteroId, Integer periodId) {
		return votesRepository.getMyVotes(voteroId, periodId);
	}

	@Transactional
	public List<Winners> addWinners(List<Winners> winners, Integer submittedBy, Integer periodId) {
		winnersRepository.clearMyVotes(periodId);
		return winnersRepository.save(winners);
	}

	@Transactional
	public Member updateMember(Member member) {
		return memberRepository.save(member);
	}

	public List<Integer> getMyWinners(Integer voteroId, Integer periodId) {
		return winnersRepository.getWinners(periodId);
	}

	public List<Winners> getWinners(Integer accountId) {
		return winnersRepository.getPreviousCycleWinner(accountId);
	}

	public RecognitionCutOff updateCutOff(RecognitionCutOff recognitionCutOffForm) {
		return recognitionCutOffRepository.save(recognitionCutOffForm);
		
	}
}
