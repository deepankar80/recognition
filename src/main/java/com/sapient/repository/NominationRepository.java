package com.sapient.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NominationRepository extends JpaRepository<Nomination, Integer> {
	
	@Query(value = "select n.*, "
			+ " (select count(*) from reco_votes_tbl v where v.nomination_id= n.nomination_id) number_of_votes, "
			+ " (select count(*) from winner w where w.nomination_id= n.nomination_id) number_of_winners, "
			+ " (select count(*) from nominations i where i.nominee_oid = n.nominee_oid) number_of_nominations "
			+ " from nominations n "
			+ " where n.recognition_period = :periodId", 
			nativeQuery = true)
	public List<Nomination> getAllNomination( @Param("periodId") Integer periodId);
	
	@Query(value = "select n.*, 1 number_of_votes, 1 number_of_winners, 1 number_of_nominations "
			+ " from nominations n where n.nominator_oid = :oid ", 
			nativeQuery = true)
	public List<Nomination> getMyNomination(@Param("oid") Integer oId);
	
}
