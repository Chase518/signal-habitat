package com.signalhabitat.adapters.out.persistence.repositories;

import com.signalhabitat.adapters.out.persistence.SqliteConnectionProvider;
import com.signalhabitat.adapters.out.persistence.entity.AnalysisResultRow;
import com.signalhabitat.adapters.out.persistence.mapper.AnalysisResultRowMapper;
import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.ports.out.AnalysisResultRepositoryPort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.Optional;

@ApplicationScoped
public class SqliteAnalysisResultRepository implements AnalysisResultRepositoryPort {

    private final SqliteConnectionProvider connectionProvider;
    private final AnalysisResultRowMapper rowMapper;

    @Inject
    public SqliteAnalysisResultRepository(
            SqliteConnectionProvider connectionProvider, AnalysisResultRowMapper rowMapper) {
        this.connectionProvider = connectionProvider;
        this.rowMapper = rowMapper;
    }

    @Override
    public Optional<AnalysisResult> findLatest() {
        String sql = "SELECT id, computed_at, payload_json FROM analysis_result ORDER BY id DESC LIMIT 1";
        try (Connection connection = connectionProvider.getConnection();
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(sql)) {
            if (!resultSet.next()) {
                return Optional.empty();
            }
            AnalysisResultRow row = new AnalysisResultRow(
                    resultSet.getLong("id"),
                    Instant.parse(resultSet.getString("computed_at")),
                    resultSet.getString("payload_json"));
            return Optional.of(rowMapper.toDomain(row));
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to read cached analysis result", e);
        }
    }

    @Override
    public void save(AnalysisResult result) {
        String sql = "INSERT INTO analysis_result (computed_at, payload_json) VALUES (?, ?)";
        try (Connection connection = connectionProvider.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, result.computedAt().toString());
            statement.setString(2, rowMapper.toPayloadJson(result));
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to persist analysis result", e);
        }
    }
}
