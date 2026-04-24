import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Building2,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  BedDouble,
  UtensilsCrossed,
  Heart,
  Image,
  Flower,
} from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  // { to: "/admin/homepage", icon: Home, label: "Homepage Content" },
  { to: "/admin/property", icon: Building2, label: "Property" },
  { to: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
];

export default function Layouts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  const propertyItems = [
    { name: "Home", path: "/admin/property/home", icon: Home },
    // { name: "Accommodation", path: "/admin/accommodation", icon: BedDouble },
    { name: "Restaurant", path: "/admin/restaurant", icon: UtensilsCrossed },
    { name: "Wedding", path: "/admin/wedding", icon: Heart },
    { name: "Gallery", path: "/admin/gallery", icon: Image },
    { name: "Massage & Spa", path: "/admin/property/massage-spa", icon: Flower },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white">
              LG
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">Luxury Garden</h1>
              <p className="text-[10px] text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            // 👇 Replace ONLY Property behavior
            if (item.label === "Property") {
              return (
                <div key={item.to}>
                  <button
                    onClick={() => setOpenProperty(!openProperty)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                  >
                    <item.icon size={18} />
                    {item.label}
                    {openProperty ? (
                      <ChevronDown size={14} className="ml-auto opacity-50" />
                    ) : (
                      <ChevronRight size={14} className="ml-auto opacity-50" />
                    )}
                  </button>

                  {/* Submenu */}
                  {openProperty && (
                    <div className="ml-6 mt-1 space-y-1">
                      {propertyItems.map((sub, i) => {
                        const Icon = sub.icon;
                        const isActive = location.pathname === sub.path;

                        return (
                          <div
                            key={i}
                            onClick={() => {
                              navigate(sub.path);
                              setSidebarOpen(false);
                            }}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                              isActive
                                ? "bg-amber-500/20 text-amber-400"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <Icon size={16} />
                            {sub.name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // ✅ Everything else untouched
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
                <ChevronRight size={14} className="ml-auto opacity-50" />
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-slate-500">
              Welcome back, <span className="text-slate-900">Admin</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}