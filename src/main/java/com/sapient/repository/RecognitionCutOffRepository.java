package com.sapient.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecognitionCutOffRepository extends JpaRepository<RecognitionCutOff, Integer> {
	@Query(value = "select p.* from sapient.recognition_cutoff_tbl p, member m "
			+ " where p.Recognition_period_start_ts <= now() and p.Recognition_period_end_ts >= now() "
			+ "		and p.account_id = m.account_id "
			+ "     and m.oracle_id = :oid "
			+ " order by p.period_id desc LIMIT 1", 
			nativeQuery = true)
	public RecognitionCutOff getNominationPeriod(@Param("oid") Integer oId);
}
