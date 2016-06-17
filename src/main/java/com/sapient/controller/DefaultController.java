package com.sapient.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class DefaultController {
	
	@RequestMapping("/")
	public String defaultPage() {
		return "home";
	}
	
	@RequestMapping("/index")
	public String home() {
		return "index";
	}
	
}
