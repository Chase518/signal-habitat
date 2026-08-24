package com.signalhabitat.adapters.in.api.adapter;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.signalhabitat.adapters.out.persistence.FakeSensorRepository;
import com.signalhabitat.application.domain.model.BatteryTrendPoint;
import com.signalhabitat.application.domain.model.SensorSummary;
import com.signalhabitat.application.domain.model.SensorsOverview;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import java.util.List;
import org.junit.jupiter.api.Test;

@QuarkusTest
class SensorResourceTest {

    @Inject
    FakeSensorRepository fakeSensorRepository;

    @Test
    void getSensorsReturnsSnakeCaseShapeMatchingTheFrontendContract() {
        fakeSensorRepository.setOverview(new SensorsOverview(
                List.of(new SensorSummary("S5", 20.0, true, 672, 16.1, -97.0, "2026-06-07 23:45:00")),
                List.of(new BatteryTrendPoint("S5", "2026-06-01", 83.6))));

        given()
                .when().get("/api/sensors")
                .then()
                .statusCode(200)
                .body("sensors[0].sensor_id", equalTo("S5"))
                .body("sensors[0].is_faulty", equalTo(true))
                .body("sensors[0].reading_count", equalTo(672))
                .body("battery_trend[0].avg_battery", equalTo(83.6f));
    }
}
