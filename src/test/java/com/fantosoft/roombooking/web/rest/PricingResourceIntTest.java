package com.fantosoft.roombooking.web.rest;

import com.fantosoft.roombooking.RoombookingApp;

import com.fantosoft.roombooking.domain.Pricing;
import com.fantosoft.roombooking.repository.PricingRepository;
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
import java.math.BigDecimal;
import java.util.List;

import static com.fantosoft.roombooking.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PricingResource REST controller.
 *
 * @see PricingResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RoombookingApp.class)
public class PricingResourceIntTest {

    private static final BigDecimal DEFAULT_PRICE_GUEST = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE_GUEST = new BigDecimal(2);

    @Autowired
    private PricingRepository pricingRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPricingMockMvc;

    private Pricing pricing;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PricingResource pricingResource = new PricingResource(pricingRepository);
        this.restPricingMockMvc = MockMvcBuilders.standaloneSetup(pricingResource)
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
    public static Pricing createEntity(EntityManager em) {
        Pricing pricing = new Pricing()
            .priceGuest(DEFAULT_PRICE_GUEST);
        return pricing;
    }

    @Before
    public void initTest() {
        pricing = createEntity(em);
    }

    @Test
    @Transactional
    public void createPricing() throws Exception {
        int databaseSizeBeforeCreate = pricingRepository.findAll().size();

        // Create the Pricing
        restPricingMockMvc.perform(post("/api/pricings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pricing)))
            .andExpect(status().isCreated());

        // Validate the Pricing in the database
        List<Pricing> pricingList = pricingRepository.findAll();
        assertThat(pricingList).hasSize(databaseSizeBeforeCreate + 1);
        Pricing testPricing = pricingList.get(pricingList.size() - 1);
        assertThat(testPricing.getPriceGuest()).isEqualTo(DEFAULT_PRICE_GUEST);
    }

    @Test
    @Transactional
    public void createPricingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pricingRepository.findAll().size();

        // Create the Pricing with an existing ID
        pricing.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPricingMockMvc.perform(post("/api/pricings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pricing)))
            .andExpect(status().isBadRequest());

        // Validate the Pricing in the database
        List<Pricing> pricingList = pricingRepository.findAll();
        assertThat(pricingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPricings() throws Exception {
        // Initialize the database
        pricingRepository.saveAndFlush(pricing);

        // Get all the pricingList
        restPricingMockMvc.perform(get("/api/pricings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pricing.getId().intValue())))
            .andExpect(jsonPath("$.[*].priceGuest").value(hasItem(DEFAULT_PRICE_GUEST.intValue())));
    }

    @Test
    @Transactional
    public void getPricing() throws Exception {
        // Initialize the database
        pricingRepository.saveAndFlush(pricing);

        // Get the pricing
        restPricingMockMvc.perform(get("/api/pricings/{id}", pricing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pricing.getId().intValue()))
            .andExpect(jsonPath("$.priceGuest").value(DEFAULT_PRICE_GUEST.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPricing() throws Exception {
        // Get the pricing
        restPricingMockMvc.perform(get("/api/pricings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePricing() throws Exception {
        // Initialize the database
        pricingRepository.saveAndFlush(pricing);
        int databaseSizeBeforeUpdate = pricingRepository.findAll().size();

        // Update the pricing
        Pricing updatedPricing = pricingRepository.findOne(pricing.getId());
        // Disconnect from session so that the updates on updatedPricing are not directly saved in db
        em.detach(updatedPricing);
        updatedPricing
            .priceGuest(UPDATED_PRICE_GUEST);

        restPricingMockMvc.perform(put("/api/pricings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPricing)))
            .andExpect(status().isOk());

        // Validate the Pricing in the database
        List<Pricing> pricingList = pricingRepository.findAll();
        assertThat(pricingList).hasSize(databaseSizeBeforeUpdate);
        Pricing testPricing = pricingList.get(pricingList.size() - 1);
        assertThat(testPricing.getPriceGuest()).isEqualTo(UPDATED_PRICE_GUEST);
    }

    @Test
    @Transactional
    public void updateNonExistingPricing() throws Exception {
        int databaseSizeBeforeUpdate = pricingRepository.findAll().size();

        // Create the Pricing

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPricingMockMvc.perform(put("/api/pricings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pricing)))
            .andExpect(status().isCreated());

        // Validate the Pricing in the database
        List<Pricing> pricingList = pricingRepository.findAll();
        assertThat(pricingList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePricing() throws Exception {
        // Initialize the database
        pricingRepository.saveAndFlush(pricing);
        int databaseSizeBeforeDelete = pricingRepository.findAll().size();

        // Get the pricing
        restPricingMockMvc.perform(delete("/api/pricings/{id}", pricing.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Pricing> pricingList = pricingRepository.findAll();
        assertThat(pricingList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pricing.class);
        Pricing pricing1 = new Pricing();
        pricing1.setId(1L);
        Pricing pricing2 = new Pricing();
        pricing2.setId(pricing1.getId());
        assertThat(pricing1).isEqualTo(pricing2);
        pricing2.setId(2L);
        assertThat(pricing1).isNotEqualTo(pricing2);
        pricing1.setId(null);
        assertThat(pricing1).isNotEqualTo(pricing2);
    }
}
