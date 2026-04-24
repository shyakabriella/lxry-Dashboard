import { Route, Routes } from "react-router-dom";

import Layouts from "../components/Layouts";
import Dashboard from "../pages/Dashboard";
import HomepageManager from "../pages/HomepageManager";
import PageEdit from "../pages/PageEdit";
import PropertiesManager from "../pages/PropertiesManager";
import TestimonialsManager from "../pages/TestimonialsManager";
import Login from "../pages/Login";

import PropertyHome from "../pages/PropertyHome";
import Accommodations from "../pages/Accommodations";
import Wedding from "../pages/Wedding";
import Gallery from "../pages/Gallery";
import Restaurant from "../pages/Restaurant";
import MassageSpa from "../pages/MassageSpa";

import AccomodationManager from "../pages/AccommodationManager";
import RestaurantManager from "../pages/RestaurantManager";
import WeddingManager from "../pages/WeddingManager";
import GalleryManager from "../pages/GalleryManager";
import MeetingManager from "../pages/MeetingManager";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<Layouts />}>
        <Route index element={<Dashboard />} />

        <Route path="homepage" element={<HomepageManager />} />
        <Route path="homepage/:sectionSlug" element={<PageEdit />} />

        <Route path="restaurant" element={<RestaurantManager />} />
        <Route path="wedding" element={<WeddingManager />} />
        <Route path="meeting" element={<MeetingManager />} />
        <Route path="gallery" element={<GalleryManager />} />

        <Route path="property/home" element={<PropertyHome />} />
        <Route path="property/accommodations" element={<Accommodations />} />
        <Route path="property/wedding" element={<Wedding />} />
        <Route path="property/gallery" element={<Gallery />} />
        <Route path="property/restaurant" element={<Restaurant />} />
        <Route path="property/massage-spa" element={<MassageSpa />} />
        <Route path="property">
          <Route path="home" element={<PropertyHome />} />
          <Route path="accommodations" element={<Accommodations />} />
          <Route path="wedding" element={<Wedding />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="massage-spa" element={<MassageSpa />} />

          <Route path="meeting" element={<MeetingManager />} />
        </Route>

        <Route path="testimonials" element={<TestimonialsManager />} />
      </Route>
    </Routes>
  );
}