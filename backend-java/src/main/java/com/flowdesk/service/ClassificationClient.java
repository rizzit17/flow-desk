package com.flowdesk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ClassificationClient {

    private final RestClient restClient;
    private final String pythonServiceUrl;

    public ClassificationClient(RestClient restClient, @Value("${flowdesk.python.url:http://localhost:8001}") String pythonServiceUrl) {
        this.restClient = restClient;
        this.pythonServiceUrl = pythonServiceUrl;
    }

    public static class ClassifyRequestDto {
        private String title;
        private String description;

        public ClassifyRequestDto() {}

        public ClassifyRequestDto(String title, String description) {
            this.title = title;
            this.description = description;
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
    }

    public static class ClassificationResponseDto {
        private String category;
        private Integer urgencyScore;
        private Double confidence;

        public ClassificationResponseDto() {}

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

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }
    }

    public ClassificationResponseDto classify(String title, String description) {
        return restClient.post()
            .uri(pythonServiceUrl + "/classify")
            .contentType(MediaType.APPLICATION_JSON)
            .body(new ClassifyRequestDto(title, description))
            .retrieve()
            .body(ClassificationResponseDto.class);
    }
}
