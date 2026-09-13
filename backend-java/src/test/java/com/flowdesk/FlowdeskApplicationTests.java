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
    void testGracefulDegradationWhenDownstreamFails() {
        // Without starting external services, downstream calls will fail,
        // but createTicket MUST not throw exception and must return PROCESSING_FAILED with errorDetail
        TicketRequest ticket = requestService.createTicket(
            "VPN issue without services",
            "Checking fault tolerance when services are not running",
            "E1023"
        );

        assertNotNull(ticket.getId());
        assertEquals("PROCESSING_FAILED", ticket.getStatus());
        assertNotNull(ticket.getErrorDetail());
        assertFalse(ticket.getErrorDetail().isBlank());
    }
}
