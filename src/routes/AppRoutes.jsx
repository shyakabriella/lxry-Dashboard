import { Route, Routes } from "react-router-dom";

import Layouts from "../components/Layouts";
import Dashboard from "../pages/Dashboard";
import HomepageManager from "../pages/HomepageManager";
import PropertiesManager from "../pages/PropertiesManager";
import TestimonialsManager from "../pages/TestimonialsManager";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Layouts />}>
        <Route index element={<Dashboard />} />
        <Route path="homepage" element={<HomepageManager />} />
        <Route path="properties" element={<PropertiesManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
      </Route>
    </Routes>
  );
}