package com.sapient.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecognitionRepository extends JpaRepository<Recognition, Integer> {
	
}
