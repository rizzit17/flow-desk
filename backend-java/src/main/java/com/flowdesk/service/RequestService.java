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
    private final PriorityEngineClient priorityEngineClient;
    private final LegacyHrSoapClient legacyHrSoapClient;

    public RequestService(TicketRepository ticketRepository,
                          ClassificationClient classificationClient,
                          PriorityEngineClient priorityEngineClient,
                          LegacyHrSoapClient legacyHrSoapClient) {
        this.ticketRepository = ticketRepository;
        this.classificationClient = classificationClient;
        this.priorityEngineClient = priorityEngineClient;
        this.legacyHrSoapClient = legacyHrSoapClient;
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

        try {
            int urgency = (ticket.getUrgencyScore() != null) ? ticket.getUrgencyScore() : 50;
            String category = (ticket.getCategory() != null) ? ticket.getCategory() : "GENERAL";
            PriorityEngineClient.PriorityResultDto priorityResult = priorityEngineClient.computePriority(id, urgency, category);
            if (priorityResult != null) {
                ticket.setFinalPriority(priorityResult.getFinalPriority());
                ticket.setQueuePosition(priorityResult.getQueuePosition());
                ticketRepository.logStep(id, "PRIORITIZE", "SUCCESS", "Priority: " + priorityResult.getFinalPriority() + ", Queue: " + priorityResult.getQueuePosition());
            }
        } catch (Exception ex) {
            ticketRepository.logStep(id, "PRIORITIZE", "FAILURE", ex.getMessage());
        }

        try {
            if (requesterId != null && !requesterId.isBlank()) {
                LegacyHrSoapClient.EmployeeInfo emp = legacyHrSoapClient.getEmployeeInfo(requesterId);
                if (emp != null) {
                    ticket.setRequesterDepartment(emp.getDepartment());
                    ticket.setRequesterManagerEmail(emp.getManagerEmail());
                    ticketRepository.logStep(id, "SOAP_ENRICH", "SUCCESS", "Dept: " + emp.getDepartment() + ", Manager: " + emp.getManagerEmail());
                }
            }
        } catch (Exception ex) {
            ticketRepository.logStep(id, "SOAP_ENRICH", "FAILURE", ex.getMessage());
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
