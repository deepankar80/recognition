package com.sapient.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.sapient.excel.ExcelBuilder;
import com.sapient.model.NominationForm;
import com.sapient.model.RecognitionByCategoryDto;
import com.sapient.repository.Member;
import com.sapient.repository.Nomination;
import com.sapient.repository.Recognition;
import com.sapient.repository.RecognitionCutOff;
import com.sapient.repository.Votes;
import com.sapient.repository.Winners;
import com.sapient.service.MailService;
import com.sapient.service.RecognitionService;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
	private static final Logger LOGGER = LoggerFactory.getLogger(FeedbackController.class);
	
	@Autowired
	private MailService mailService;
	
	@Autowired
	private RecognitionService recognitionService;
	
	@RequestMapping(value = "/submit", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public String submit(@RequestBody NominationForm feedbackFormData) {
		LOGGER.info("Submiter details {} ", feedbackFormData.getMessage());
		try {
			//sendMail(feedbackFormData);
			
			// Save feedback in DB.
			Recognition recognition = new Recognition();
			
			Member nominator = new Member();
			nominator.setOracleId(feedbackFormData.getNominatorOracleId());
			recognition.setNominator(nominator);
			
			Member nominee = new Member();
			nominee.setOracleId(feedbackFormData.getNomineeOracleId());
			recognition.setNominee(nominee);

			recognition.setNominationId(feedbackFormData.getNominationId());
			recognition.setCitation(feedbackFormData.getMessage());
			recognition.setRecognitionCategory(feedbackFormData.getCategory());
			recognition.setRecognitionPeriod(feedbackFormData.getPeriodId());
			recognition.setSenderCompId(feedbackFormData.getSubmitter());
			recognition.setInsertedDate(new Date());
			
			return recognitionService.insertRecognition(recognition).toString();
			
		} catch (Exception e) {
			e.printStackTrace();
			
			return "There is an exception, " + e.getMessage();
		}
	}

	@RequestMapping(value = "/submitVotes", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public String submitVotes(@RequestBody NominationForm feedbackFormData) {
		LOGGER.info("Submiter details {} ", feedbackFormData.getSubmittedBy());
		ArrayList<Votes> votes = new ArrayList<Votes>();
		
		try {
			// Save feedback in DB.
			for(Entry<String, Boolean> vote : feedbackFormData.getVotes().entrySet()) {
				if(vote.getValue()) {
					Votes dbv = new Votes();
					dbv.setNominationId(Integer.parseInt(vote.getKey()));
					dbv.setVoterOid(feedbackFormData.getSubmittedBy());
					dbv.setPeriodId(feedbackFormData.getPeriodId());
					votes.add(dbv);
				}
			}
			
			recognitionService.addVotes(votes, feedbackFormData.getSubmittedBy(), feedbackFormData.getPeriodId()).toString();
			
			return "Votes Saved Successfully";
			
		} catch (Exception e) {
			e.printStackTrace();
			
			return "There is an exception, " + e.getMessage();
		}
	}

	@RequestMapping(value = "/updateMember", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public String updateMember(@RequestBody Member member) {
		LOGGER.info("Submiter details {} ", member.getRecognitionTeamFlag());
		
		try {
			member.setEmail(String.format("%s@sapient.com", member.getOracleId()));
			member.setProjectId(1);
			recognitionService.updateMember(member);
			
			return "Member Saved Successfully";
			
		} catch (Exception e) {
			e.printStackTrace();
			
			return "There is an exception, " + e.getMessage();
		}
	}

	@RequestMapping(value = "/updateCutOff", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public String updateCutOff(@RequestBody RecognitionCutOff recognitionCutOffForm) {
		
		try {
			
			recognitionService.updateCutOff(recognitionCutOffForm);
			
			return "Saved Successfully";
			
		} catch (Exception e) {
			e.printStackTrace();
			
			return "There is an exception, " + e.getMessage();
		}
	}

	@RequestMapping(value = "/submitWinners", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public String submitWinners(@RequestBody NominationForm feedbackFormData) {
		LOGGER.info("Submiter details {} ", feedbackFormData.getWinners());
		ArrayList<Winners> votes = new ArrayList<Winners>();
		
		try {
			// Save feedback in DB.
			for(Entry<String, Boolean> vote : feedbackFormData.getWinners().entrySet()) {
				if(vote.getValue()) {
					Winners dbv = new Winners();
					Recognition nomination = new Recognition();
					nomination.setNominationId(Integer.parseInt(vote.getKey()));
					dbv.setNomination(nomination);
					dbv.setPeriodId(feedbackFormData.getPeriodId());
					votes.add(dbv);
				}
			}
			
			recognitionService.addWinners(votes, feedbackFormData.getSubmittedBy(), feedbackFormData.getPeriodId()).toString();
			
			return "Winners Saved Successfully";
			
		} catch (Exception e) {
			e.printStackTrace();
			
			return "There is an exception, " + e.getMessage();
		}
	}

	private void sendMail(NominationForm feedbackFormData) {
		try {
			// send mail.
			mailService.send("ddixit@sapient.com", feedbackFormData.getMessage());
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value = "/load", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public RecognitionByCategoryDto load(@RequestBody NominationForm feedbackFormData) {
		LOGGER.info("load details ");
		
		RecognitionCutOff nominationPeriod = this.recognitionService.getNominationPeriod(feedbackFormData.getSubmittedBy());
		
		if(nominationPeriod == null) {
			return new RecognitionByCategoryDto(
					new ArrayList<Nomination>(),
					new ArrayList<Integer>(),
					new ArrayList<Integer>(),
					this.recognitionService.getWinners(feedbackFormData.getSubmittedBy()),
					this.recognitionService.getMyRecognition(feedbackFormData.getSubmittedBy()),
					nominationPeriod);
		}
		
		return new RecognitionByCategoryDto(
				this.recognitionService.getAllRecognition(nominationPeriod.getPeriodId()), 
				this.recognitionService.getMyVotes(feedbackFormData.getSubmittedBy(), nominationPeriod.getPeriodId()), 
				this.recognitionService.getMyWinners(feedbackFormData.getSubmittedBy(), nominationPeriod.getPeriodId()),
				this.recognitionService.getWinners(feedbackFormData.getSubmittedBy()),
				this.recognitionService.getMyRecognition(feedbackFormData.getSubmittedBy()),
				nominationPeriod);
	}
	
	@RequestMapping(value = "/downloadExcel/{submittedBy}", method = RequestMethod.GET, produces = {"application/ms-excel"})
    public ModelAndView downloadExcel(@PathVariable("submittedBy") int submittedBy , HttpServletRequest request, HttpServletResponse response) {
			LOGGER.info("load details ");
			
			/*RecognitionCutOff nominationPeriod = this.recognitionService.getNominationPeriod(submittedBy);
			
			if(nominationPeriod == null) {
				return null;
			}*/
			List<Winners> allRecognition = this.recognitionService.getWinners(submittedBy);
 
        // return a view which will be resolved by an excel view resolver
        //return new ModelAndView("excelBuilder", "recognitions", allRecognition);
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("recognitions", allRecognition);
	        response.setContentType( "application/ms-excel" );
	        response.setHeader( "Content-disposition", "attachment; filename=myfile.xls" );         
	        return new ModelAndView(new ExcelBuilder(), model);
    }
}
