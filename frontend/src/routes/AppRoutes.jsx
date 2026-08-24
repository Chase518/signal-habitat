import { Route, Routes } from "react-router-dom";
import AnalysisPage from "../pages/AnalysisPage";
import ComingSoonPage from "../pages/ComingSoonPage";
import DetectionsPage from "../pages/DetectionsPage";
import SensorsPage from "../pages/SensorsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AnalysisPage />} />
      <Route path="/sensors" element={<SensorsPage />} />
      <Route path="/detections" element={<DetectionsPage />} />
      <Route path="/alerts" element={<ComingSoonPage title="Alerts" />} />
    </Routes>
  );
}
