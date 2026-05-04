import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Sparkles,
  Building2,
  Utensils,
  Coffee,
  Gift,
  ArrowLeft,
} from "lucide-react";
import BackToWeddingButton from "../../components/BackToWeddingButton";

const sectionCards = [
  {
    key: "hero",
    label: "Services Hero",
    description: "Main hero banner for wedding services",
    path: "/admin/wedding-services/hero",
    icon: Sparkles,
  },
  {
    key: "luxury",
    label: "Luxury Services",
    description: "Manage luxury wedding services section",
    path: "/admin/wedding-services/luxury",
    icon: Building2,
  },
  {
    key: "seamless",
    label: "Seamless Experience",
    description: "Manage seamless wedding experience section",
    path: "/admin/wedding-services/seamless",
    icon: Coffee,
  },
  {
    key: "catering",
    label: "Catering Services",
    description: "Manage catering services cards",
    path: "/admin/wedding-services/catering",
    icon: Utensils,
  },
  {
    key: "culinary",
    label: "Culinary Enhancements",
    description: "Manage culinary enhancements section",
    path: "/admin/wedding-services/culinary",
    icon: Utensils,
  },
  {
    key: "what-you-get",
    label: "What You Get",
    description: "Manage benefits and inclusions list",
    path: "/admin/wedding-services/what-you-get",
    icon: Gift,
  },
];

export default function WeddingServicesManagerMicroService() {
  const location = useLocation();
  const isChildRoute = location.pathname !== "/admin/wedding-services";

  // On child routes (individual section editing pages) - only show back to services button
  if (isChildRoute) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/wedding-services"
          className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-amber-300 hover:text-amber-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Wedding Services
        </Link>
        <Outlet />
      </div>
    );
  }

  // On the main microservices dashboard page - show back to wedding button and all cards
  return (
    <div className="space-y-6">
      {/* Only show Back to Wedding Dashboard on the main services page */}
      <BackToWeddingButton />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Wedding Services</h2>
        <p className="text-sm text-slate-500 mt-1">Select a section to manage its content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sectionCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              to={card.path}
              className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 min-h-[140px] w-full text-left hover:border-amber-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-all duration-200 group-hover:bg-amber-100">
                <Icon className="h-5 w-5 text-slate-500 transition-all duration-200 group-hover:text-amber-600" />
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-base font-semibold text-slate-800">{card.label}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{card.description}</p>
                <div className="mt-3 flex items-center gap-1 transition-all duration-200 group-hover:gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-amber-500">Manage section</span>
                  <span className="text-amber-400 text-xs transition-all duration-200 group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}