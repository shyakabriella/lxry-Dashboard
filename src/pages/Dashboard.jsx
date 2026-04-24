import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Building2,
  MessageSquare,
  Eye,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { loadSiteData } from "../data/store";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadSiteData());
  }, []);

  if (!data) return null;

  const stats = [
    {
      label: "Homepage Sections",
      value: Object.keys(data.homepage).length,
      icon: Home,
      color: "from-violet-500 to-indigo-600",
      bgLight: "bg-violet-50",
      link: "/admin/homepage",
    },
    {
      label: "Property",
      value: data.property.length,
      icon: Building2,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      link: "/admin/property",
    },
    {
      label: "Testimonials",
      value: data.testimonials.length,
      icon: MessageSquare,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      link: "/admin/testimonials",
    },
    {
      label: "Featured Property",
      value: data.property.filter((p) => p.featured).length,
      icon: TrendingUp,
      color: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50",
      link: "/admin/property",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your Luxury Garden Palace website content
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${stat.bgLight}`}>
                <stat.icon size={20} className="text-slate-700" />
              </div>
              <ArrowRight
                size={16}
                className="text-slate-300 transition-colors group-hover:text-slate-500"
              />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Property */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-900">Property Overview</h3>
            <Link
              to="/admin/property"
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {data.property.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center gap-4 rounded-lg border border-slate-100 p-3"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={prop.imageUrl}
                    alt={prop.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{prop.name}</p>
                  <p className="text-xs text-slate-500">{prop.type} · {prop.capacity}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    prop.featured
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {prop.featured ? "Featured" : "Standard"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-900">Recent Testimonials</h3>
            <Link
              to="/admin/testimonials"
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-4">
            {data.testimonials.map((t) => (
              <div key={t.id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= t.rating ? "text-amber-400" : "text-slate-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{t.content}</p>
                <p className="mt-2 text-xs font-medium text-slate-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Site preview link */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <Eye size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Preview Your Site</h3>
              <p className="text-sm text-slate-500">
                See how your changes look on the live site
              </p>
            </div>
          </div>
          <a
            href="https://www.luxurygardenpalace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Visit Site
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
