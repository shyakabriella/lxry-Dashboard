import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Sparkles,
  Gift,
  Diamond,
  Crown,
  List,
  Martini,
  ArrowLeft,
} from "lucide-react";
import BackToWeddingButton from "../../components/BackToWeddingButton";

const sectionCards = [
  {
    key: "hero",
    label: "Packages Hero",
    description: "Main hero banner for wedding packages",
    path: "/admin/wedding-packages/hero",
    icon: Sparkles,
  },
  {
    key: "wedding-packages",
    label: "Wedding Packages",
    description: "Manage wedding packages section",
    path: "/admin/wedding-packages/wedding-packages",
    icon: Gift,
  },
  {
    key: "classic",
    label: "Classic Package",
    description: "Manage classic wedding package details",
    path: "/admin/wedding-packages/classic",
    icon: Diamond,
  },
  {
    key: "premium",
    label: "Premium Package",
    description: "Manage premium wedding package details",
    path: "/admin/wedding-packages/premium",
    icon: Crown,
  },
  {
    key: "benefits",
    label: "Benefits",
    description: "Manage included benefits list",
    path: "/admin/wedding-packages/benefits",
    icon: List,
  },
  {
    key: "bar",
    label: "Bar Packages",
    description: "Manage bar packages section",
    path: "/admin/wedding-packages/bar",
    icon: Martini,
  },
];

export default function WeddingPackagesManagerMicroService() {
  const location = useLocation();
  const isChildRoute = location.pathname !== "/admin/wedding-packages";

  if (isChildRoute) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/wedding-packages"
          className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-amber-300 hover:text-amber-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Wedding Packages
        </Link>
        <Outlet />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackToWeddingButton />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Wedding Packages</h2>
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