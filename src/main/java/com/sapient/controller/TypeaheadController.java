package com.sapient.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sapient.repository.Member;
import com.sapient.repository.MembersRepository;

@RestController
public class TypeaheadController {

	@Autowired
	private MembersRepository membersRepository;
	
	@RequestMapping("personSearchTypeaheadDynamic")
	public List<Member> getPersons(@RequestParam("personSearchString") String strValue, @RequestParam("accountId") String accountId) {
		return membersRepository.getPsersons(strValue, accountId);
	}
	

	@RequestMapping("personSearchLoggedInUser")
	public List<Member> getPersons(@RequestParam("personSearchString") String strValue) {
		return membersRepository.getPsersons(strValue);
	}
}
