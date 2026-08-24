package com.signalhabitat.adapters.out.persistence.repositories;

import com.signalhabitat.adapters.out.persistence.SqliteConnectionProvider;
import com.signalhabitat.application.domain.model.BatteryTrendPoint;
import com.signalhabitat.application.domain.model.SensorSummary;
import com.signalhabitat.application.domain.model.SensorsOverview;
import com.signalhabitat.application.ports.out.SensorRepositoryPort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class SqliteSensorRepository implements SensorRepositoryPort {

    private static final String SUMMARY_SQL = """
            SELECT
                m.sensor_id,
                m.base_temperature_c,
                m.is_faulty,
                COUNT(r.id) AS reading_count,
                (SELECT battery FROM sensor_reading WHERE sensor_id = m.sensor_id ORDER BY timestamp DESC LIMIT 1) AS latest_battery,
                (SELECT rssi FROM sensor_reading WHERE sensor_id = m.sensor_id ORDER BY timestamp DESC LIMIT 1) AS latest_rssi,
                (SELECT timestamp FROM sensor_reading WHERE sensor_id = m.sensor_id ORDER BY timestamp DESC LIMIT 1) AS latest_reading_at
            FROM sensor_metadata m
            LEFT JOIN sensor_reading r ON r.sensor_id = m.sensor_id
            GROUP BY m.sensor_id
            ORDER BY m.sensor_id
            """;

    private static final String BATTERY_TREND_SQL = """
            SELECT sensor_id, date(timestamp) AS day, AVG(battery) AS avg_battery
            FROM sensor_reading
            GROUP BY sensor_id, day
            ORDER BY day, sensor_id
            """;

    private final SqliteConnectionProvider connectionProvider;

    @Inject
    public SqliteSensorRepository(SqliteConnectionProvider connectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    @Override
    public SensorsOverview loadOverview() {
        try (Connection connection = connectionProvider.getConnection();
                Statement statement = connection.createStatement()) {
            List<SensorSummary> sensors = readSummaries(statement);
            List<BatteryTrendPoint> batteryTrend = readBatteryTrend(statement);
            return new SensorsOverview(sensors, batteryTrend);
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to read sensors overview", e);
        }
    }

    private List<SensorSummary> readSummaries(Statement statement) throws SQLException {
        List<SensorSummary> sensors = new ArrayList<>();
        try (ResultSet resultSet = statement.executeQuery(SUMMARY_SQL)) {
            while (resultSet.next()) {
                sensors.add(new SensorSummary(
                        resultSet.getString("sensor_id"),
                        resultSet.getDouble("base_temperature_c"),
                        resultSet.getBoolean("is_faulty"),
                        resultSet.getInt("reading_count"),
                        nullableDouble(resultSet, "latest_battery"),
                        nullableDouble(resultSet, "latest_rssi"),
                        resultSet.getString("latest_reading_at")));
            }
        }
        return sensors;
    }

    private List<BatteryTrendPoint> readBatteryTrend(Statement statement) throws SQLException {
        List<BatteryTrendPoint> trend = new ArrayList<>();
        try (ResultSet resultSet = statement.executeQuery(BATTERY_TREND_SQL)) {
            while (resultSet.next()) {
                trend.add(new BatteryTrendPoint(
                        resultSet.getString("sensor_id"),
                        resultSet.getString("day"),
                        resultSet.getDouble("avg_battery")));
            }
        }
        return trend;
    }

    private static Double nullableDouble(ResultSet resultSet, String column) throws SQLException {
        double value = resultSet.getDouble(column);
        return resultSet.wasNull() ? null : value;
    }
}
