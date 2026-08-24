package com.signalhabitat.adapters.in.api.adapter;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.signalhabitat.adapters.out.persistence.FakeDetectionRepository;
import com.signalhabitat.application.domain.model.DailyDetectionCount;
import com.signalhabitat.application.domain.model.DetectionEvent;
import com.signalhabitat.application.domain.model.DetectionsOverview;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import java.util.List;
import org.junit.jupiter.api.Test;

@QuarkusTest
class DetectionResourceTest {

    @Inject
    FakeDetectionRepository fakeDetectionRepository;

    @Test
    void getDetectionsReturnsSnakeCaseShapeMatchingTheFrontendContract() {
        fakeDetectionRepository.setOverview(new DetectionsOverview(
                975,
                List.of(new DetectionEvent("S3", "2026-06-07 18:15:00")),
                List.of(new DailyDetectionCount("2026-06-01", 120))));

        given()
                .when().get("/api/detections")
                .then()
                .statusCode(200)
                .body("total_count", equalTo(975))
                .body("recent_events[0].sensor_id", equalTo("S3"))
                .body("daily_counts[0].count", equalTo(120));

        assertEquals(50, fakeDetectionRepository.getLastRequestedLimit());
    }
}
