import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, StatTile } from "../../../shared";
import { loadDetections } from "../detectionsSlice";
import DailyDetectionsChart from "./DailyDetectionsChart";
import RecentEventsTable from "./RecentEventsTable";

export default function DetectionsPanel() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.detections);

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadDetections());
    }
  }, [status, dispatch]);

  if (status === "failed") {
    return (
      <Card>
        <p role="alert" style={{ margin: 0, color: "var(--ink-secondary)" }}>
          Could not load detection data ({error}) — is the analysis service running on{" "}
          <code>localhost:8080</code>?
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <p style={{ margin: 0, color: "var(--ink-secondary)" }}>Loading detections…</p>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <StatTile label="Total detections" value={data.total_count.toLocaleString()} />
      </div>

      <Card title="Detections per day">
        <DailyDetectionsChart dailyCounts={data.daily_counts} />
      </Card>

      <Card title="Recent events">
        <RecentEventsTable events={data.recent_events} />
      </Card>
    </div>
  );
}
