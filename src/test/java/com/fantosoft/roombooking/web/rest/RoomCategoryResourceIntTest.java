package com.fantosoft.roombooking.web.rest;

import com.fantosoft.roombooking.RoombookingApp;

import com.fantosoft.roombooking.domain.RoomCategory;
import com.fantosoft.roombooking.repository.RoomCategoryRepository;
import com.fantosoft.roombooking.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.fantosoft.roombooking.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the RoomCategoryResource REST controller.
 *
 * @see RoomCategoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RoombookingApp.class)
public class RoomCategoryResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private RoomCategoryRepository roomCategoryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRoomCategoryMockMvc;

    private RoomCategory roomCategory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RoomCategoryResource roomCategoryResource = new RoomCategoryResource(roomCategoryRepository);
        this.restRoomCategoryMockMvc = MockMvcBuilders.standaloneSetup(roomCategoryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoomCategory createEntity(EntityManager em) {
        RoomCategory roomCategory = new RoomCategory()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return roomCategory;
    }

    @Before
    public void initTest() {
        roomCategory = createEntity(em);
    }

    @Test
    @Transactional
    public void createRoomCategory() throws Exception {
        int databaseSizeBeforeCreate = roomCategoryRepository.findAll().size();

        // Create the RoomCategory
        restRoomCategoryMockMvc.perform(post("/api/room-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(roomCategory)))
            .andExpect(status().isCreated());

        // Validate the RoomCategory in the database
        List<RoomCategory> roomCategoryList = roomCategoryRepository.findAll();
        assertThat(roomCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        RoomCategory testRoomCategory = roomCategoryList.get(roomCategoryList.size() - 1);
        assertThat(testRoomCategory.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRoomCategory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createRoomCategoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = roomCategoryRepository.findAll().size();

        // Create the RoomCategory with an existing ID
        roomCategory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoomCategoryMockMvc.perform(post("/api/room-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(roomCategory)))
            .andExpect(status().isBadRequest());

        // Validate the RoomCategory in the database
        List<RoomCategory> roomCategoryList = roomCategoryRepository.findAll();
        assertThat(roomCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllRoomCategories() throws Exception {
        // Initialize the database
        roomCategoryRepository.saveAndFlush(roomCategory);

        // Get all the roomCategoryList
        restRoomCategoryMockMvc.perform(get("/api/room-categories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(roomCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getRoomCategory() throws Exception {
        // Initialize the database
        roomCategoryRepository.saveAndFlush(roomCategory);

        // Get the roomCategory
        restRoomCategoryMockMvc.perform(get("/api/room-categories/{id}", roomCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(roomCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRoomCategory() throws Exception {
        // Get the roomCategory
        restRoomCategoryMockMvc.perform(get("/api/room-categories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRoomCategory() throws Exception {
        // Initialize the database
        roomCategoryRepository.saveAndFlush(roomCategory);
        int databaseSizeBeforeUpdate = roomCategoryRepository.findAll().size();

        // Update the roomCategory
        RoomCategory updatedRoomCategory = roomCategoryRepository.findOne(roomCategory.getId());
        // Disconnect from session so that the updates on updatedRoomCategory are not directly saved in db
        em.detach(updatedRoomCategory);
        updatedRoomCategory
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restRoomCategoryMockMvc.perform(put("/api/room-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRoomCategory)))
            .andExpect(status().isOk());

        // Validate the RoomCategory in the database
        List<RoomCategory> roomCategoryList = roomCategoryRepository.findAll();
        assertThat(roomCategoryList).hasSize(databaseSizeBeforeUpdate);
        RoomCategory testRoomCategory = roomCategoryList.get(roomCategoryList.size() - 1);
        assertThat(testRoomCategory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRoomCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingRoomCategory() throws Exception {
        int databaseSizeBeforeUpdate = roomCategoryRepository.findAll().size();

        // Create the RoomCategory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restRoomCategoryMockMvc.perform(put("/api/room-categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(roomCategory)))
            .andExpect(status().isCreated());

        // Validate the RoomCategory in the database
        List<RoomCategory> roomCategoryList = roomCategoryRepository.findAll();
        assertThat(roomCategoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteRoomCategory() throws Exception {
        // Initialize the database
        roomCategoryRepository.saveAndFlush(roomCategory);
        int databaseSizeBeforeDelete = roomCategoryRepository.findAll().size();

        // Get the roomCategory
        restRoomCategoryMockMvc.perform(delete("/api/room-categories/{id}", roomCategory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<RoomCategory> roomCategoryList = roomCategoryRepository.findAll();
        assertThat(roomCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RoomCategory.class);
        RoomCategory roomCategory1 = new RoomCategory();
        roomCategory1.setId(1L);
        RoomCategory roomCategory2 = new RoomCategory();
        roomCategory2.setId(roomCategory1.getId());
        assertThat(roomCategory1).isEqualTo(roomCategory2);
        roomCategory2.setId(2L);
        assertThat(roomCategory1).isNotEqualTo(roomCategory2);
        roomCategory1.setId(null);
        assertThat(roomCategory1).isNotEqualTo(roomCategory2);
    }
}
