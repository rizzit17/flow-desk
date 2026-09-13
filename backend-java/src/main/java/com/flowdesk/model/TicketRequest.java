package com.flowdesk.model;

import java.time.LocalDateTime;

public class TicketRequest {
    private String id;
    private String title;
    private String description;
    private String requesterId;
    private String category;
    private Integer urgencyScore;
    private Integer finalPriority;
    private Integer queuePosition;
    private String requesterDepartment;
    private String requesterManagerEmail;
    private String status;
    private String errorDetail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketRequest() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getUrgencyScore() {
        return urgencyScore;
    }

    public void setUrgencyScore(Integer urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public Integer getFinalPriority() {
        return finalPriority;
    }

    public void setFinalPriority(Integer finalPriority) {
        this.finalPriority = finalPriority;
    }

    public Integer getQueuePosition() {
        return queuePosition;
    }

    public void setQueuePosition(Integer queuePosition) {
        this.queuePosition = queuePosition;
    }

    public String getRequesterDepartment() {
        return requesterDepartment;
    }

    public void setRequesterDepartment(String requesterDepartment) {
        this.requesterDepartment = requesterDepartment;
    }

    public String getRequesterManagerEmail() {
        return requesterManagerEmail;
    }

    public void setRequesterManagerEmail(String requesterManagerEmail) {
        this.requesterManagerEmail = requesterManagerEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorDetail() {
        return errorDetail;
    }

    public void setErrorDetail(String errorDetail) {
        this.errorDetail = errorDetail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
