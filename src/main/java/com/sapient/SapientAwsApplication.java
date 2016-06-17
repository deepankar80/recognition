package com.sapient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*@Configuration
@EnableWebMvc
@EnableAutoConfiguration
@ComponentScan*/
@SpringBootApplication
public class SapientAwsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SapientAwsApplication.class, args);
	}
}
