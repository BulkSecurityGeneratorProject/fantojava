package com.fantosoft.roombooking.web.rest;

import com.fantosoft.roombooking.RoombookingApp;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
/**
 * Test class for the Hello REST controller.
 *
 * @see HelloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RoombookingApp.class)
public class HelloResourceIntTest {

    private MockMvc restMockMvc;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        HelloResource helloResource = new HelloResource();
        restMockMvc = MockMvcBuilders
            .standaloneSetup(helloResource)
            .build();
    }

    /**
    * Test hello
    */
    @Test
    public void testHello() throws Exception {
        restMockMvc.perform(get("/api/hello/hello"))
            .andExpect(status().isOk());
    }

}
