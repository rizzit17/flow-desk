package com.flowdesk.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@Service
public class PriorityEngineClient {

    private final String configuredBinaryPath;
    private final ObjectMapper objectMapper;

    public PriorityEngineClient(@Value("${flowdesk.cpp.binaryPath:../priority-engine-cpp/build/Release/priority_engine.exe}") String configuredBinaryPath,
                                ObjectMapper objectMapper) {
        this.configuredBinaryPath = configuredBinaryPath;
        this.objectMapper = objectMapper;
    }

    public static class PriorityResultDto {
        private String requestId;
        private Integer finalPriority;
        private Integer queuePosition;

        public PriorityResultDto() {}

        public PriorityResultDto(String requestId, Integer finalPriority, Integer queuePosition) {
            this.requestId = requestId;
            this.finalPriority = finalPriority;
            this.queuePosition = queuePosition;
        }

        public String getRequestId() {
            return requestId;
        }

        public void setRequestId(String requestId) {
            this.requestId = requestId;
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
    }

    private File resolveBinary() {
        File f = new File(configuredBinaryPath);
        if (f.exists() && f.canExecute()) {
            return f;
        }
        File f1 = new File("../priority-engine-cpp/build/Release/priority_engine.exe");
        if (f1.exists()) {
            return f1;
        }
        File f2 = new File("priority-engine-cpp/build/Release/priority_engine.exe");
        if (f2.exists()) {
            return f2;
        }
        File f3 = new File("../priority-engine-cpp/build/priority_engine");
        if (f3.exists()) {
            return f3;
        }
        return f;
    }

    public PriorityResultDto computePriority(String requestId, int urgencyScore, String category) throws Exception {
        File binary = resolveBinary();
        if (!binary.exists()) {
            throw new FileNotFoundException("C++ priority engine binary not found at: " + binary.getAbsolutePath());
        }

        ProcessBuilder pb = new ProcessBuilder(binary.getAbsolutePath());
        Process process = pb.start();

        String payload = objectMapper.writeValueAsString(new PriorityInput(requestId, urgencyScore, category));

        try (OutputStream os = process.getOutputStream()) {
            os.write(payload.getBytes(StandardCharsets.UTF_8));
            os.flush();
        }

        boolean finished = process.waitFor(5, TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
            throw new RuntimeException("Priority engine subprocess timed out");
        }

        int exitCode = process.exitValue();
        if (exitCode != 0) {
            String errorMsg;
            try (BufferedReader errReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = errReader.readLine()) != null) {
                    sb.append(line).append("\n");
                }
                errorMsg = sb.toString();
            }
            throw new RuntimeException("Priority engine failed with exit code " + exitCode + ": " + errorMsg);
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JsonNode node = objectMapper.readTree(sb.toString());
            PriorityResultDto result = new PriorityResultDto();
            result.setRequestId(node.path("requestId").asText(requestId));
            result.setFinalPriority(node.path("finalPriority").asInt());
            result.setQueuePosition(node.path("queuePosition").asInt());
            return result;
        }
    }

    private record PriorityInput(String requestId, int urgencyScore, String category) {}
}
