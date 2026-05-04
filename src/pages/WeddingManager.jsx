



import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Heart,
  Settings,
  Star,
  Home,
  MapPin,
  Image,
  Building,
  ArrowLeft,
} from "lucide-react";

import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

const sectionCards = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Manage wedding hero slider images and content",
    icon: LayoutGrid,
    path: "/admin/wedding/hero",
  },
  {
    key: "envision_your_special_day",
    label: "Envision Your Special Day",
    description: "Edit your special day vision and venue images",
    icon: Heart,
    path: "/admin/wedding/envision",
  },
  {
    key: "services",
    label: "Services Section",
    description: "Manage wedding services list",
    icon: Settings,
    path: "/admin/wedding/services",
  },
  {
    key: "why_choose_luxury_garden_palace",
    label: "Why Choose Us",
    description: "Edit why choose slides and features",
    icon: Star,
    path: "/admin/wedding/why-choose",
  },
  {
    key: "prime_luxury_apartment_living",
    label: "Prime Luxury Apartment",
    description: "Manage luxury apartment living section",
    icon: Home,
    path: "/admin/wedding/prime-apartment",
  },
  {
    key: "wedding_accommodations",
    label: "Wedding Accommodations",
    description: "Edit accommodations and amenities",
    icon: Building,
    path: "/admin/wedding/accommodations",
  },
  {
    key: "Location",
    label: "Location Section",
    description: "Manage venue location and features",
    icon: MapPin,
    path: "/admin/wedding/location",
  },
  {
    key: "multiple_images",
    label: "Multiple Images Gallery",
    description: "Upload and manage gallery images",
    icon: Image,
    path: "/admin/wedding/gallery",
  },
];

export default function WeddingManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const isChildRoute = location.pathname !== "/admin/wedding";

  // If we're on a child route, show the section content with back button
  if (isChildRoute) {
    return (
      <div className="space-y-6 p-6 max-w-[1800px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/wedding")}
          className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-amber-300 hover:text-amber-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Wedding Sections
        </button>

        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    );
  }

  // Main view - show all section cards
  return (
    <div className="space-y-6 p-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-semibold text-slate-800"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Wedding Content Manager
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a section to manage its content
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {sectionCards.map((card) => {
          const Icon = card.icon;
          
          return (
            <Link
              key={card.key}
              to={card.path}
              className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 min-h-[140px] w-full text-left hover:border-amber-300 hover:shadow-md"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-all duration-200 group-hover:bg-amber-100">
                <Icon className="h-5 w-5 text-slate-500 transition-all duration-200 group-hover:text-amber-600" />
              </div>
              
              {/* Content */}
              <div className="flex-1 w-full">
                <h3 className="text-base font-semibold text-slate-800">
                  {card.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-3 flex items-center gap-1 transition-all duration-200 group-hover:gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-amber-500">
                    Manage section
                  </span>
                  <span className="text-amber-400 text-xs transition-all duration-200 group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* MICRO SERVICES */}
      <div className="pt-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <h3 className="text-sm font-semibold text-slate-600">
            Wedding Micro Services
          </h3>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        
        <div className="space-y-4">
          <WeddingVenuesManagerMicroService />
          <WeddingServicesManagerMicroService />
          <WeddingPackagesManagerMicroService />
          <WeddingRoomBlocksManagerMicroService />
          <WeddingGalleryManagerMicroService />
        </div>
      </div>
    </div>
  );
}