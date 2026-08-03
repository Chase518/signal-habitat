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
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to initialize SQLite schema", e);
        }
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + sqlitePath);
    }
}
