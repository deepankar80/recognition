package com.sapient.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MembersRepository extends JpaRepository<Member, Integer> {
	
	@Query(value = "select * from member "
			+ " where name regexp :value "
			+ "		or nt_login regexp :value ", nativeQuery = true)
	public List<Member> getPsersons(@Param("value") String value);
	

	@Query(value = "select * from member "
			+ " where account_id = :accountId "
			+ "		and (name regexp :value "
			+ "			or nt_login regexp :value) ", nativeQuery = true)
	public List<Member> getPsersons(@Param("value") String value, @Param("accountId") String accountId);
}
