package com.sapient.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VotesRepository extends JpaRepository<Votes, Integer> {
	
	@Query(value = "select nomination_id from reco_votes_tbl "
			+ " where voter_oid = :voterId "
			+ "		and period_id = :periodId", nativeQuery = true)
	public List<Integer> getMyVotes(@Param("voterId") Integer voterId, @Param("periodId") Integer periodId);
	
	@Modifying
	@Query(value = "delete from reco_votes_tbl "
			+ " where voter_oid = :voterId "
			+ "		and period_id = :periodId", nativeQuery = true)
	public int clearMyVotes(@Param("voterId") Integer voterId, @Param("periodId") Integer periodId);
	
}
