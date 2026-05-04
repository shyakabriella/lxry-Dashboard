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

// Import wedding section managers for nested routes
import HeroSectionManager from "../pages/HeroSectionManager";
import EnvisionSectionManager from "../pages/EnvisionSectionManager";
import ServicesSectionManager from "../pages/ServicesSectionManager";
import WhyChooseSectionManager from "../pages/WhyChooseSectionManager";
import PrimeApartmentSectionManager from "../pages/PrimeApartmentSectionManager";
import LocationSectionManager from "../pages/LocationSectionManager";
import MultipleImagesSectionManager from "../pages/MultipleImagesSectionManager";

// =========================================================================
// WEDDING VENUES MICROSERVICE
// =========================================================================
import WeddingVenuesManagerMicroService from "../pages/wedding-microservices/WeddingVenuesManagerMicroService";
import VenuesHeroManager from "../pages/wedding-microservices/VenuesHeroManager";
import LuxuryVenuesManager from "../pages/wedding-microservices/LuxuryVenuesManager";
import GardenCeremonyManager from "../pages/wedding-microservices/GardenCeremonyManager";
import WeddingReceptionHallManager from "../pages/wedding-microservices/WeddingReceptionHallManager";
import BarLoungeManager from "../pages/wedding-microservices/BarLoungeManager";

// =========================================================================
// WEDDING SERVICES MICROSERVICE
// =========================================================================
import WeddingServicesManagerMicroService from "../pages/wedding-microservices/WeddingServicesManagerMicroService";
import ServicesHeroManager from "../pages/wedding-microservices/ServicesHeroManager";
import ServicesLuxuryManager from "../pages/wedding-microservices/ServicesLuxuryManager";
import ServicesSeamlessManager from "../pages/wedding-microservices/ServicesSeamlessManager";
import ServicesCateringManager from "../pages/wedding-microservices/ServicesCateringManager";
import ServicesCulinaryManager from "../pages/wedding-microservices/ServicesCulinaryManager";
import ServicesWhatYouGetManager from "../pages/wedding-microservices/ServicesWhatYouGetManager";

// =========================================================================
// WEDDING PACKAGES MICROSERVICE
// =========================================================================
import WeddingPackagesManagerMicroService from "../pages/wedding-microservices/WeddingPackagesManagerMicroService";
import PackagesHeroManager from "../pages/wedding-microservices/PackagesHeroManager";
import PackagesWeddingPackagesManager from "../pages/wedding-microservices/PackagesWeddingPackagesManager";
import PackagesClassicManager from "../pages/wedding-microservices/PackagesClassicManager";
import PackagesPremiumManager from "../pages/wedding-microservices/PackagesPremiumManager";
import PackagesBenefitsManager from "../pages/wedding-microservices/PackagesBenefitsManager";
import PackagesBarManager from "../pages/wedding-microservices/PackagesBarManager";

// =========================================================================
// WEDDING ROOM BLOCKS MICROSERVICE
// =========================================================================
import WeddingRoomBlocksManagerMicroService from "../pages/wedding-microservices/WeddingRoomBlocksManagerMicroService";
import RoomBlocksHeroManager from "../pages/wedding-microservices/RoomBlocksHeroManager";
import RoomBlocksMeetingManager from "../pages/wedding-microservices/RoomBlocksMeetingManager";
import RoomBlocksAccommodationManager from "../pages/wedding-microservices/RoomBlocksAccommodationManager";
import RoomBlocksEssentialsManager from "../pages/wedding-microservices/RoomBlocksEssentialsManager";

// =========================================================================
// WEDDING GALLERY MICROSERVICE (UNCOMMENTED)
// =========================================================================
import WeddingGalleryManagerMicroService from "../pages/wedding-microservices/WeddingGalleryManagerMicroService";
import GalleryHeroManager from "../pages/wedding-microservices/GalleryHeroManager";
import GalleryOverviewManager from "../pages/wedding-microservices/GalleryOverviewManager";
import GalleryImagesManager from "../pages/wedding-microservices/GalleryImagesManager";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<Layouts />}>
        <Route index element={<Dashboard />} />

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

        {/* ========== PROPERTY ROUTES ========== */}
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