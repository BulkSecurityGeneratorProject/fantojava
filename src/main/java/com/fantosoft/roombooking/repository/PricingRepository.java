package com.fantosoft.roombooking.repository;

import com.fantosoft.roombooking.domain.Pricing;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Pricing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PricingRepository extends JpaRepository<Pricing, Long> {

}
