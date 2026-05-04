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

// Import section managers
import AccommodationsSectionManager from "../pages/AccommodationsSectionManager";
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

        {/* Main admin pages */}
        <Route path="booking" element={<Booking />} />

        <Route path="homepage" element={<HomepageManager />} />
        <Route path="homepage/:sectionSlug" element={<PageEdit />} />

        <Route path="restaurant" element={<RestaurantManager />} />
        
        {/* ========== WEDDING NESTED ROUTES ========== */}
        <Route path="wedding" element={<WeddingManager />}>
          <Route path="hero" element={<HeroSectionManager />} />
          <Route path="envision" element={<EnvisionSectionManager />} />
          <Route path="services" element={<ServicesSectionManager />} />
          <Route path="why-choose" element={<WhyChooseSectionManager />} />
          <Route path="prime-apartment" element={<PrimeApartmentSectionManager />} />
          <Route path="accommodations" element={<AccommodationsSectionManager />} />
          <Route path="location" element={<LocationSectionManager />} />
          <Route path="gallery" element={<MultipleImagesSectionManager />} />
        </Route>
        
        {/* ========== WEDDING VENUES MICROSERVICE ========== */}
        <Route path="wedding-venues" element={<WeddingVenuesManagerMicroService />}>
          <Route path="hero" element={<VenuesHeroManager />} />
          <Route path="luxury" element={<LuxuryVenuesManager />} />
          <Route path="garden" element={<GardenCeremonyManager />} />
          <Route path="reception" element={<WeddingReceptionHallManager />} />
          <Route path="bar" element={<BarLoungeManager />} />
        </Route>
        
        {/* ========== WEDDING SERVICES MICROSERVICE ========== */}
        <Route path="wedding-services" element={<WeddingServicesManagerMicroService />}>
          <Route path="hero" element={<ServicesHeroManager />} />
          <Route path="luxury" element={<ServicesLuxuryManager />} />
          <Route path="seamless" element={<ServicesSeamlessManager />} />
          <Route path="catering" element={<ServicesCateringManager />} />
          <Route path="culinary" element={<ServicesCulinaryManager />} />
          <Route path="what-you-get" element={<ServicesWhatYouGetManager />} />
        </Route>
        
        {/* ========== WEDDING PACKAGES MICROSERVICE ========== */}
        <Route path="wedding-packages" element={<WeddingPackagesManagerMicroService />}>
          <Route path="hero" element={<PackagesHeroManager />} />
          <Route path="wedding-packages" element={<PackagesWeddingPackagesManager />} />
          <Route path="classic" element={<PackagesClassicManager />} />
          <Route path="premium" element={<PackagesPremiumManager />} />
          <Route path="benefits" element={<PackagesBenefitsManager />} />
          <Route path="bar" element={<PackagesBarManager />} />
        </Route>
        
        {/* ========== WEDDING ROOM BLOCKS MICROSERVICE ========== */}
        <Route path="wedding-room-blocks" element={<WeddingRoomBlocksManagerMicroService />}>
          <Route path="hero" element={<RoomBlocksHeroManager />} />
          <Route path="meeting" element={<RoomBlocksMeetingManager />} />
          <Route path="accommodation" element={<RoomBlocksAccommodationManager />} />
          <Route path="essentials" element={<RoomBlocksEssentialsManager />} />
        </Route>
        
        {/* ========== WEDDING GALLERY MICROSERVICE (NOW ACTIVE) ========== */}
        <Route path="wedding-gallery" element={<WeddingGalleryManagerMicroService />}>
          <Route path="hero" element={<GalleryHeroManager />} />
          <Route path="overview" element={<GalleryOverviewManager />} />
          <Route path="images" element={<GalleryImagesManager />} />
        </Route>
        
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