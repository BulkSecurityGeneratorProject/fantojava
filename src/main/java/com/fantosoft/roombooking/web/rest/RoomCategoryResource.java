package com.fantosoft.roombooking.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fantosoft.roombooking.domain.RoomCategory;

import com.fantosoft.roombooking.repository.RoomCategoryRepository;
import com.fantosoft.roombooking.web.rest.errors.BadRequestAlertException;
import com.fantosoft.roombooking.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing RoomCategory.
 */
@RestController
@RequestMapping("/api")
public class RoomCategoryResource {

    private final Logger log = LoggerFactory.getLogger(RoomCategoryResource.class);

    private static final String ENTITY_NAME = "roomCategory";

    private final RoomCategoryRepository roomCategoryRepository;

    public RoomCategoryResource(RoomCategoryRepository roomCategoryRepository) {
        this.roomCategoryRepository = roomCategoryRepository;
    }

    /**
     * POST  /room-categories : Create a new roomCategory.
     *
     * @param roomCategory the roomCategory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new roomCategory, or with status 400 (Bad Request) if the roomCategory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/room-categories")
    @Timed
    public ResponseEntity<RoomCategory> createRoomCategory(@RequestBody RoomCategory roomCategory) throws URISyntaxException {
        log.debug("REST request to save RoomCategory : {}", roomCategory);
        if (roomCategory.getId() != null) {
            throw new BadRequestAlertException("A new roomCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RoomCategory result = roomCategoryRepository.save(roomCategory);
        return ResponseEntity.created(new URI("/api/room-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /room-categories : Updates an existing roomCategory.
     *
     * @param roomCategory the roomCategory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated roomCategory,
     * or with status 400 (Bad Request) if the roomCategory is not valid,
     * or with status 500 (Internal Server Error) if the roomCategory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/room-categories")
    @Timed
    public ResponseEntity<RoomCategory> updateRoomCategory(@RequestBody RoomCategory roomCategory) throws URISyntaxException {
        log.debug("REST request to update RoomCategory : {}", roomCategory);
        if (roomCategory.getId() == null) {
            return createRoomCategory(roomCategory);
        }
        RoomCategory result = roomCategoryRepository.save(roomCategory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, roomCategory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /room-categories : get all the roomCategories.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of roomCategories in body
     */
    @GetMapping("/room-categories")
    @Timed
    public List<RoomCategory> getAllRoomCategories() {
        log.debug("REST request to get all RoomCategories");
        return roomCategoryRepository.findAll();
        }

    /**
     * GET  /room-categories/:id : get the "id" roomCategory.
     *
     * @param id the id of the roomCategory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the roomCategory, or with status 404 (Not Found)
     */
    @GetMapping("/room-categories/{id}")
    @Timed
    public ResponseEntity<RoomCategory> getRoomCategory(@PathVariable Long id) {
        log.debug("REST request to get RoomCategory : {}", id);
        RoomCategory roomCategory = roomCategoryRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(roomCategory));
    }

    /**
     * DELETE  /room-categories/:id : delete the "id" roomCategory.
     *
     * @param id the id of the roomCategory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/room-categories/{id}")
    @Timed
    public ResponseEntity<Void> deleteRoomCategory(@PathVariable Long id) {
        log.debug("REST request to delete RoomCategory : {}", id);
        roomCategoryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
