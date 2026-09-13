package com.flowdesk;

import com.flowdesk.model.TicketRequest;
import com.flowdesk.service.RequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FlowdeskApplicationTests {

    @Autowired
    private RequestService requestService;

    @Test
    void testCreateTicketWithClassification() {
        TicketRequest ticket = requestService.createTicket(
            "VPN not connecting",
            "Cannot connect to corp VPN since this morning, blocking all work",
            "E1023"
        );

        assertNotNull(ticket.getId());
        assertEquals("IT_INFRASTRUCTURE", ticket.getCategory());
        assertNotNull(ticket.getUrgencyScore());
        assertTrue(ticket.getUrgencyScore() > 0);
    }
}
