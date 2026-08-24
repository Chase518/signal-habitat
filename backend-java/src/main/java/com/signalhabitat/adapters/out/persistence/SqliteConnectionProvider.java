package com.signalhabitat.adapters.out.persistence;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Plain JDBC over sqlite-jdbc -- no Hibernate/Panache. A 1-table cache
 * doesn't need an ORM's machinery, and it keeps this adapter's boundary
 * with the domain obvious (see docs/decisions.md).
 */
@ApplicationScoped
public class SqliteConnectionProvider {

    @ConfigProperty(name = "signalhabitat.sqlite.path")
    String sqlitePath;

    void onStart(@Observes StartupEvent event) {
        try (Connection connection = getConnection();
                Statement statement = connection.createStatement()) {
            statement.execute("""
                    CREATE TABLE IF NOT EXISTS analysis_result (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        computed_at TEXT NOT NULL,
                        payload_json TEXT NOT NULL
                    )
                    """);
            // sensor_metadata/sensor_reading/detection_event are owned (written) by
            // the Python service (see analysis-python/app/storage.py) -- Java only
            // reads them, but declares the same schema here defensively so the
            // Sensors/Detections views don't 500 on a fresh checkout where Java
            // starts before Python has ever run once.
            statement.execute("""
                    CREATE TABLE IF NOT EXISTS sensor_metadata (
                        sensor_id TEXT PRIMARY KEY,
                        base_temperature_c REAL NOT NULL,
                        is_faulty INTEGER NOT NULL
                    )
                    """);
            statement.execute("""
                    CREATE TABLE IF NOT EXISTS sensor_reading (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        sensor_id TEXT NOT NULL REFERENCES sensor_metadata(sensor_id),
                        timestamp TEXT NOT NULL,
                        temperature REAL,
                        humidity REAL,
                        battery REAL NOT NULL,
                        rssi REAL NOT NULL
                    )
                    """);
            statement.execute("""
                    CREATE TABLE IF NOT EXISTS detection_event (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        sensor_id TEXT NOT NULL REFERENCES sensor_metadata(sensor_id),
                        timestamp TEXT NOT NULL
                    )
                    """);
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to initialize SQLite schema", e);
        }
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + sqlitePath);
    }
}
