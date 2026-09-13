package com.flowdesk.service;

import com.flowdesk.model.RequestStatus;
import com.flowdesk.model.TicketRequest;
import com.flowdesk.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RequestService {

    private final TicketRepository ticketRepository;
    private final ClassificationClient classificationClient;

    public RequestService(TicketRepository ticketRepository, ClassificationClient classificationClient) {
        this.ticketRepository = ticketRepository;
        this.classificationClient = classificationClient;
    }

    public TicketRequest createTicket(String title, String description, String requesterId) {
        String id = UUID.randomUUID().toString();
        TicketRequest ticket = new TicketRequest();
        ticket.setId(id);
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setRequesterId(requesterId);
        ticket.setStatus(RequestStatus.PENDING.name());
        
        ticketRepository.save(ticket);

        try {
            ClassificationClient.ClassificationResponseDto classification = classificationClient.classify(title, description);
            if (classification != null) {
                ticket.setCategory(classification.getCategory());
                ticket.setUrgencyScore(classification.getUrgencyScore());
                ticketRepository.logStep(id, "CLASSIFY", "SUCCESS", "Category: " + classification.getCategory() + ", Urgency: " + classification.getUrgencyScore());
            }
        } catch (Exception ex) {
            ticketRepository.logStep(id, "CLASSIFY", "FAILURE", ex.getMessage());
        }

        ticketRepository.updateEnrichment(ticket);
        return ticket;
    }

    public List<TicketRequest> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<TicketRequest> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public Optional<TicketRequest> updateStatus(String id, String status) {
        Optional<TicketRequest> existing = ticketRepository.findById(id);
        if (existing.isPresent()) {
            ticketRepository.updateStatus(id, status);
            return ticketRepository.findById(id);
        }
        return Optional.empty();
    }
}
