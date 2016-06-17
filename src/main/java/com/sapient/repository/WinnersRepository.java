package com.sapient.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WinnersRepository extends JpaRepository<Winners, Integer> {
	
	@Query(value = "select nomination_id from winner w where w.period_id = :periodId "
			+ "  ", nativeQuery = true)
	public List<Integer> getWinners(@Param("periodId") Integer periodId);
	
	@Modifying
	@Query(value = "delete from winner where period_id = :periodId "
			+ "  ", nativeQuery = true)
	public int clearMyVotes(@Param("periodId") Integer periodId);

	@Query(value = "select * from winner w where w.period_id = "
			+ " (select max(p.period_id) from recognition_cutoff_tbl p, member m "
			+ "					where oracle_Id = :accountId "
			+ "                        and m.account_id = m.account_id "
			+ "						and p.Recognition_period_end_ts < now()) "
			, nativeQuery = true)
	public List<Winners> getPreviousCycleWinner(@Param("accountId") Integer accountId);
	
}
