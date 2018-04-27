package com.fantosoft.roombooking.web.rest;

import com.fantosoft.roombooking.RoombookingApp;

import com.fantosoft.roombooking.domain.Booking;
import com.fantosoft.roombooking.repository.BookingRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.fantosoft.roombooking.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BookingResource REST controller.
 *
 * @see BookingResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RoombookingApp.class)
public class BookingResourceIntTest {

    private static final LocalDate DEFAULT_FROM = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FROM = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_UNTIL = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UNTIL = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_GUEST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GUEST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_GUEST_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_GUEST_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_GUEST_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_GUEST_PHONE = "BBBBBBBBBB";

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restBookingMockMvc;

    private Booking booking;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BookingResource bookingResource = new BookingResource(bookingRepository);
        this.restBookingMockMvc = MockMvcBuilders.standaloneSetup(bookingResource)
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
    public static Booking createEntity(EntityManager em) {
        Booking booking = new Booking()
            .from(DEFAULT_FROM)
            .until(DEFAULT_UNTIL)
            .guestName(DEFAULT_GUEST_NAME)
            .guestEmail(DEFAULT_GUEST_EMAIL)
            .guestPhone(DEFAULT_GUEST_PHONE);
        return booking;
    }

    @Before
    public void initTest() {
        booking = createEntity(em);
    }

    @Test
    @Transactional
    public void createBooking() throws Exception {
        int databaseSizeBeforeCreate = bookingRepository.findAll().size();

        // Create the Booking
        restBookingMockMvc.perform(post("/api/bookings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(booking)))
            .andExpect(status().isCreated());

        // Validate the Booking in the database
        List<Booking> bookingList = bookingRepository.findAll();
        assertThat(bookingList).hasSize(databaseSizeBeforeCreate + 1);
        Booking testBooking = bookingList.get(bookingList.size() - 1);
        assertThat(testBooking.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testBooking.getUntil()).isEqualTo(DEFAULT_UNTIL);
        assertThat(testBooking.getGuestName()).isEqualTo(DEFAULT_GUEST_NAME);
        assertThat(testBooking.getGuestEmail()).isEqualTo(DEFAULT_GUEST_EMAIL);
        assertThat(testBooking.getGuestPhone()).isEqualTo(DEFAULT_GUEST_PHONE);
    }

    @Test
    @Transactional
    public void createBookingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bookingRepository.findAll().size();

        // Create the Booking with an existing ID
        booking.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookingMockMvc.perform(post("/api/bookings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(booking)))
            .andExpect(status().isBadRequest());

        // Validate the Booking in the database
        List<Booking> bookingList = bookingRepository.findAll();
        assertThat(bookingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllBookings() throws Exception {
        // Initialize the database
        bookingRepository.saveAndFlush(booking);

        // Get all the bookingList
        restBookingMockMvc.perform(get("/api/bookings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(booking.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(DEFAULT_FROM.toString())))
            .andExpect(jsonPath("$.[*].until").value(hasItem(DEFAULT_UNTIL.toString())))
            .andExpect(jsonPath("$.[*].guestName").value(hasItem(DEFAULT_GUEST_NAME.toString())))
            .andExpect(jsonPath("$.[*].guestEmail").value(hasItem(DEFAULT_GUEST_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].guestPhone").value(hasItem(DEFAULT_GUEST_PHONE.toString())));
    }

    @Test
    @Transactional
    public void getBooking() throws Exception {
        // Initialize the database
        bookingRepository.saveAndFlush(booking);

        // Get the booking
        restBookingMockMvc.perform(get("/api/bookings/{id}", booking.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(booking.getId().intValue()))
            .andExpect(jsonPath("$.from").value(DEFAULT_FROM.toString()))
            .andExpect(jsonPath("$.until").value(DEFAULT_UNTIL.toString()))
            .andExpect(jsonPath("$.guestName").value(DEFAULT_GUEST_NAME.toString()))
            .andExpect(jsonPath("$.guestEmail").value(DEFAULT_GUEST_EMAIL.toString()))
            .andExpect(jsonPath("$.guestPhone").value(DEFAULT_GUEST_PHONE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBooking() throws Exception {
        // Get the booking
        restBookingMockMvc.perform(get("/api/bookings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBooking() throws Exception {
        // Initialize the database
        bookingRepository.saveAndFlush(booking);
        int databaseSizeBeforeUpdate = bookingRepository.findAll().size();

        // Update the booking
        Booking updatedBooking = bookingRepository.findOne(booking.getId());
        // Disconnect from session so that the updates on updatedBooking are not directly saved in db
        em.detach(updatedBooking);
        updatedBooking
            .from(UPDATED_FROM)
            .until(UPDATED_UNTIL)
            .guestName(UPDATED_GUEST_NAME)
            .guestEmail(UPDATED_GUEST_EMAIL)
            .guestPhone(UPDATED_GUEST_PHONE);

        restBookingMockMvc.perform(put("/api/bookings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBooking)))
            .andExpect(status().isOk());

        // Validate the Booking in the database
        List<Booking> bookingList = bookingRepository.findAll();
        assertThat(bookingList).hasSize(databaseSizeBeforeUpdate);
        Booking testBooking = bookingList.get(bookingList.size() - 1);
        assertThat(testBooking.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testBooking.getUntil()).isEqualTo(UPDATED_UNTIL);
        assertThat(testBooking.getGuestName()).isEqualTo(UPDATED_GUEST_NAME);
        assertThat(testBooking.getGuestEmail()).isEqualTo(UPDATED_GUEST_EMAIL);
        assertThat(testBooking.getGuestPhone()).isEqualTo(UPDATED_GUEST_PHONE);
    }

    @Test
    @Transactional
    public void updateNonExistingBooking() throws Exception {
        int databaseSizeBeforeUpdate = bookingRepository.findAll().size();

        // Create the Booking

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restBookingMockMvc.perform(put("/api/bookings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(booking)))
            .andExpect(status().isCreated());

        // Validate the Booking in the database
        List<Booking> bookingList = bookingRepository.findAll();
        assertThat(bookingList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteBooking() throws Exception {
        // Initialize the database
        bookingRepository.saveAndFlush(booking);
        int databaseSizeBeforeDelete = bookingRepository.findAll().size();

        // Get the booking
        restBookingMockMvc.perform(delete("/api/bookings/{id}", booking.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Booking> bookingList = bookingRepository.findAll();
        assertThat(bookingList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Booking.class);
        Booking booking1 = new Booking();
        booking1.setId(1L);
        Booking booking2 = new Booking();
        booking2.setId(booking1.getId());
        assertThat(booking1).isEqualTo(booking2);
        booking2.setId(2L);
        assertThat(booking1).isNotEqualTo(booking2);
        booking1.setId(null);
        assertThat(booking1).isNotEqualTo(booking2);
    }
}
