package com.flowdesk.controller;

import com.flowdesk.model.TicketRequest;
import com.flowdesk.service.RequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    public static class CreateTicketDto {
        private String title;
        private String description;
        private String requesterId;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getRequesterId() {
            return requesterId;
        }

        public void setRequesterId(String requesterId) {
            this.requesterId = requesterId;
        }
    }

    public static class StatusUpdateDto {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createRequest(@RequestBody CreateTicketDto dto) {
        TicketRequest ticket = requestService.createTicket(dto.getTitle(), dto.getDescription(), dto.getRequesterId());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "id", ticket.getId(),
            "status", ticket.getStatus()
        ));
    }

    @GetMapping
    public ResponseEntity<List<TicketRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketRequest> getRequestById(@PathVariable String id) {
        return requestService.getTicketById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TicketRequest> updateStatus(@PathVariable String id, @RequestBody StatusUpdateDto dto) {
        return requestService.updateStatus(id, dto.getStatus())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
