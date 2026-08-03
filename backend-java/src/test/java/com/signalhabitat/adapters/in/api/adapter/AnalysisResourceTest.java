package com.signalhabitat.adapters.in.api.adapter;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.signalhabitat.adapters.out.analysis.FakeAnalysisServicePort;
import com.signalhabitat.adapters.out.persistence.FakeAnalysisResultRepository;
import com.signalhabitat.application.domain.model.ActivityPoint;
import com.signalhabitat.application.domain.model.AnalysisMeta;
import com.signalhabitat.application.domain.model.AnalysisResult;
import com.signalhabitat.application.domain.model.FittedModel;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

@QuarkusTest
class AnalysisResourceTest {

    @Inject
    FakeAnalysisServicePort fakeAnalysisServicePort;

    @Inject
    FakeAnalysisResultRepository fakeRepository;

    @BeforeEach
    void resetCache() {
        fakeRepository.setCached(Optional.empty());
    }

    @Test
    void getAnalysisReturnsSnakeCaseShapeMatchingTheFrontendContract() {
        AnalysisResult result = new AnalysisResult(
                new AnalysisMeta(5, 3360, 3287, 975),
                List.of(new ActivityPoint(18.0, 226, 78, 0.345)),
                new FittedModel(1, List.of(0.176, 0.003), List.of(0.018, 0.46), 0.025),
                new FittedModel(2, List.of(-0.475, 0.095, -0.003), List.of(0.0, 0.0, 0.0), 0.891),
                Instant.now());
        fakeAnalysisServicePort.setResult(result);

        given()
                .when().get("/api/analysis")
                .then()
                .statusCode(200)
                .body("meta.sensor_count", equalTo(5))
                .body("meta.raw_reading_count", equalTo(3360))
                .body("aggregated_points[0].temperature_bin_center", equalTo(18.0f))
                .body("aggregated_points[0].activity_frequency", equalTo(0.345f))
                .body("models.linear.degree", equalTo(1))
                .body("models.quadratic.r_squared", equalTo(0.891f));
    }
}
