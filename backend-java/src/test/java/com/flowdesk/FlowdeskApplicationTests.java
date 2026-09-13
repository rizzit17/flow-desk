package com.flowdesk;

import com.flowdesk.model.TicketRequest;
import com.flowdesk.service.RequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FlowdeskApplicationTests {

    @Autowired
    private RequestService requestService;

    @Test
    void testSingleTicketFetchAndPatchStatus() {
        TicketRequest ticket = requestService.createTicket(
            "Hardware replacement",
            "Monitor stopped turning on",
            "E1023"
        );

        assertNotNull(ticket.getId());

        Optional<TicketRequest> fetched = requestService.getTicketById(ticket.getId());
        assertTrue(fetched.isPresent());
        assertEquals(ticket.getId(), fetched.get().getId());
        assertEquals("Hardware replacement", fetched.get().getTitle());

        Optional<TicketRequest> updated = requestService.updateStatus(ticket.getId(), "RESOLVED");
        assertTrue(updated.isPresent());
        assertEquals("RESOLVED", updated.get().getStatus());

        Optional<TicketRequest> refetched = requestService.getTicketById(ticket.getId());
        assertTrue(refetched.isPresent());
        assertEquals("RESOLVED", refetched.get().getStatus());
    }
}
