package com.flowdesk;

import com.flowdesk.model.TicketRequest;
import com.flowdesk.service.RequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FlowdeskApplicationTests {

    @Autowired
    private RequestService requestService;

    @Test
    void testCreateAndListTicket() {
        TicketRequest created = requestService.createTicket(
            "VPN not connecting",
            "Cannot connect to corp VPN since this morning",
            "E1023"
        );

        assertNotNull(created.getId());
        assertEquals("PENDING", created.getStatus());

        List<TicketRequest> allTickets = requestService.getAllTickets();
        assertFalse(allTickets.isEmpty());

        boolean found = allTickets.stream()
            .anyMatch(t -> t.getId().equals(created.getId()) && "PENDING".equals(t.getStatus()));
        assertTrue(found);
    }
}
