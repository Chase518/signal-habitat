package com.signalhabitat.adapters.out.persistence.entity;

import java.time.Instant;

/** Raw row shape of the `analysis_result` table -- the persistence adapter's own model, not the domain's. */
public record AnalysisResultRow(long id, Instant computedAt, String payloadJson) {
}
