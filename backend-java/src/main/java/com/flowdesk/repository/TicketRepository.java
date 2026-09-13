package com.flowdesk.repository;

import com.flowdesk.model.TicketRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class TicketRepository {

    private final JdbcTemplate jdbcTemplate;

    public TicketRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<TicketRequest> rowMapper = new RowMapper<TicketRequest>() {
        @Override
        public TicketRequest mapRow(ResultSet rs, int rowNum) throws SQLException {
            TicketRequest request = new TicketRequest();
            request.setId(rs.getString("id"));
            request.setTitle(rs.getString("title"));
            request.setDescription(rs.getString("description"));
            request.setRequesterId(rs.getString("requester_id"));
            request.setCategory(rs.getString("category"));

            int urgency = rs.getInt("urgency_score");
            if (!rs.wasNull()) {
                request.setUrgencyScore(urgency);
            }

            int priority = rs.getInt("final_priority");
            if (!rs.wasNull()) {
                request.setFinalPriority(priority);
            }

            int queue = rs.getInt("queue_position");
            if (!rs.wasNull()) {
                request.setQueuePosition(queue);
            }

            request.setRequesterDepartment(rs.getString("requester_department"));
            request.setRequesterManagerEmail(rs.getString("requester_manager_email"));
            request.setStatus(rs.getString("status"));
            request.setErrorDetail(rs.getString("error_detail"));

            Timestamp created = rs.getTimestamp("created_at");
            if (created != null) {
                request.setCreatedAt(created.toLocalDateTime());
            }

            Timestamp updated = rs.getTimestamp("updated_at");
            if (updated != null) {
                request.setUpdatedAt(updated.toLocalDateTime());
            }

            return request;
        }
    };

    public void save(TicketRequest request) {
        String sql = """
                    INSERT INTO requests (
                        id, title, description, requester_id, category, urgency_score,
                        final_priority, queue_position, requester_department, requester_manager_email,
                        status, error_detail, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        LocalDateTime now = LocalDateTime.now();
        request.setCreatedAt(now);
        request.setUpdatedAt(now);
        jdbcTemplate.update(sql,
                request.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getRequesterId(),
                request.getCategory(),
                request.getUrgencyScore(),
                request.getFinalPriority(),
                request.getQueuePosition(),
                request.getRequesterDepartment(),
                request.getRequesterManagerEmail(),
                request.getStatus(),
                request.getErrorDetail(),
                Timestamp.valueOf(now),
                Timestamp.valueOf(now));
    }

    public void updateEnrichment(TicketRequest request) {
        String sql = """
                    UPDATE requests SET
                        category = ?,
                        urgency_score = ?,
                        final_priority = ?,
                        queue_position = ?,
                        requester_department = ?,
                        requester_manager_email = ?,
                        status = ?,
                        error_detail = ?,
                        updated_at = ?
                    WHERE id = ?
                """;
        LocalDateTime now = LocalDateTime.now();
        request.setUpdatedAt(now);
        jdbcTemplate.update(sql,
                request.getCategory(),
                request.getUrgencyScore(),
                request.getFinalPriority(),
                request.getQueuePosition(),
                request.getRequesterDepartment(),
                request.getRequesterManagerEmail(),
                request.getStatus(),
                request.getErrorDetail(),
                Timestamp.valueOf(now),
                request.getId());
    }

    public void updateStatus(String id, String status) {
        String sql = "UPDATE requests SET status = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, status, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    public Optional<TicketRequest> findById(String id) {
        String sql = "SELECT * FROM requests WHERE id = ?";
        List<TicketRequest> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<TicketRequest> findAll() {
        String sql = "SELECT * FROM requests ORDER BY COALESCE(final_priority, 99) ASC, created_at DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void logStep(String requestId, String step, String status, String detail) {
        String sql = "INSERT INTO logs (request_id, step, status, detail, timestamp) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, requestId, step, status, detail, Timestamp.valueOf(LocalDateTime.now()));
    }
}
