import { Route, Routes } from "react-router-dom";
import AnalysisPage from "../pages/AnalysisPage";
import ComingSoonPage from "../pages/ComingSoonPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AnalysisPage />} />
      <Route path="/sensors" element={<ComingSoonPage title="Sensors" />} />
      <Route path="/detections" element={<ComingSoonPage title="Detections" />} />
      <Route path="/alerts" element={<ComingSoonPage title="Alerts" />} />
    </Routes>
  );
}
