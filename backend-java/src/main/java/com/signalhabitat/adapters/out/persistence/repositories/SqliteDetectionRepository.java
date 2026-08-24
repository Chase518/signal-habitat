package com.signalhabitat.adapters.out.persistence.repositories;

import com.signalhabitat.adapters.out.persistence.SqliteConnectionProvider;
import com.signalhabitat.application.domain.model.DailyDetectionCount;
import com.signalhabitat.application.domain.model.DetectionEvent;
import com.signalhabitat.application.domain.model.DetectionsOverview;
import com.signalhabitat.application.ports.out.DetectionRepositoryPort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class SqliteDetectionRepository implements DetectionRepositoryPort {

    private static final String TOTAL_COUNT_SQL = "SELECT COUNT(*) AS total FROM detection_event";

    private static final String RECENT_EVENTS_SQL =
            "SELECT sensor_id, timestamp FROM detection_event ORDER BY timestamp DESC LIMIT ?";

    private static final String DAILY_COUNTS_SQL = """
            SELECT date(timestamp) AS day, COUNT(*) AS count
            FROM detection_event
            GROUP BY day
            ORDER BY day
            """;

    private final SqliteConnectionProvider connectionProvider;

    @Inject
    public SqliteDetectionRepository(SqliteConnectionProvider connectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    @Override
    public DetectionsOverview loadOverview(int recentEventLimit) {
        try (Connection connection = connectionProvider.getConnection()) {
            int totalCount = readTotalCount(connection);
            List<DetectionEvent> recentEvents = readRecentEvents(connection, recentEventLimit);
            List<DailyDetectionCount> dailyCounts = readDailyCounts(connection);
            return new DetectionsOverview(totalCount, recentEvents, dailyCounts);
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to read detections overview", e);
        }
    }

    private int readTotalCount(Connection connection) throws SQLException {
        try (Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(TOTAL_COUNT_SQL)) {
            resultSet.next();
            return resultSet.getInt("total");
        }
    }

    private List<DetectionEvent> readRecentEvents(Connection connection, int limit) throws SQLException {
        List<DetectionEvent> events = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(RECENT_EVENTS_SQL)) {
            statement.setInt(1, limit);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    events.add(new DetectionEvent(resultSet.getString("sensor_id"), resultSet.getString("timestamp")));
                }
            }
        }
        return events;
    }

    private List<DailyDetectionCount> readDailyCounts(Connection connection) throws SQLException {
        List<DailyDetectionCount> counts = new ArrayList<>();
        try (Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(DAILY_COUNTS_SQL)) {
            while (resultSet.next()) {
                counts.add(new DailyDetectionCount(resultSet.getString("day"), resultSet.getInt("count")));
            }
        }
        return counts;
    }
}
