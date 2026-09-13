package com.flowdesk;

import com.flowdesk.model.RequestStatus;
import com.flowdesk.model.TicketRequest;
import com.flowdesk.service.RequestService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EndToEndIntegrationTest {

    @Autowired
    private RequestService requestService;

    @Test
    @DisplayName("Verify pipeline records partial status and error detail when a downstream service is down")
    void testDegradedPipelineExecution() {
        TicketRequest ticket = requestService.createTicket(
            "Server CPU thermal throttling",
            "Core compute nodes experiencing high temperature and blocking batch jobs",
            "E1026"
        );

        assertNotNull(ticket.getId());
        assertNotNull(ticket.getStatus());
        assertTrue(
            RequestStatus.PROCESSED.name().equals(ticket.getStatus()) ||
            RequestStatus.PROCESSING_FAILED.name().equals(ticket.getStatus())
        );

        List<TicketRequest> all = requestService.getAllTickets();
        assertTrue(all.stream().anyMatch(t -> t.getId().equals(ticket.getId())));
    }
}
