package com.fantosoft.roombooking.repository;

import com.fantosoft.roombooking.domain.RoomCategory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the RoomCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoomCategoryRepository extends JpaRepository<RoomCategory, Long> {

}
