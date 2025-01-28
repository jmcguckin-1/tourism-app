package com.example.springboot;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.junit.Assert.*;

@SpringBootTest
@AutoConfigureMockMvc
public class HelloControllerTest {

	@Autowired
	private MockMvc mvc;

	@Test
	public void testGetFlights() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get("/findFlights")
		        .param("arrivalAirport", "New York, United States(JFK) - John F. Kennedy Airport")
		        .param("departureAirport", "Dublin, Ireland(DUB) - Dublin International")
		        .param("startDate", "Wed Dec 04 2024 00:00:00 GMT+0000 (Greenwich Mean Time)")
		        .param("endDate", "Sat Dec 07 2024 00:00:00 GMT+0000 (Greenwich Mean Time)")
		        .param("oneWay", "false")
		        .param("direct", "true")
		        .param("returnFlight", "true"))
		        .andExpect(status().isOk());
	}

	@Test
	public void testGetHotels() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get("/findHotels")
		        .param("destination", "New York, United States(JFK) - John F. Kennedy Airport")
		        .param("startDate", "Wed Dec 04 2024 00:00:00 GMT+0000 (Greenwich Mean Time)")
		        .param("endDate", "Sat Dec 07 2024 00:00:00 GMT+0000 (Greenwich Mean Time)")
		        .param("numAdults", "2")
		        .param("numChildren", "2"))
		        .andExpect(status().isOk());
	}


	@Test
	public void testGetCartHotels() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get("/getCartItems")
		        .param("user", "jmcguckin308@gmail.com")
		        .param("type", "hotels"))
		        .andExpect(status().isOk());
	}

	@Test
	public void testGetCartFlights() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get("/getCartItems")
		        .param("user", "jmcguckin308@gmail.com")
		        .param("type", "flights"))
		        .andExpect(status().isOk());
	}

	@Test
	public void testCheckDates() throws Exception {
	     TestService ts = new TestService();

	     boolean b = ts.checkDates("Wed Dec 04 2024 00:00:00 GMT+0000 (Greenwich Mean Time)" , "Wed Dec 04 10:49:04 GMT 2024");

	     assertTrue(b);
	}

    @Test
	public void testCheckDatesFailure() throws Exception {
	     TestService ts = new TestService();

	     boolean b = ts.checkDates("Sat Dec 07 2024 00:00:00 GMT+0000 (Greenwich Mean Time)" , "Wed Dec 04 10:49:04 GMT 2024");

	     assertFalse(b);
	}
}
