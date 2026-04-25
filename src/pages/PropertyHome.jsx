import { Link } from "react-router-dom";
import { ArrowRight, Home, Layers } from "lucide-react";

const homeSections = [
  {
    id: 0,
    slug: "welcome-section",
    title: "Welcome Section",
    description: "Manage homepage welcome slider content",
  },
  {
    id: 1,
    slug: "home-section-one",
    title: "Home Section One",
    description: "Manage section one content",
  },
  {
    id: 2,
    slug: "home-section-two",
    title: "Home Section Two",
    description: "Manage section two content",
  },
  {
    id: 3,
    slug: "home-section-three",
    title: "Home Section Three",
    description: "Manage section three content",
  },
  {
    id: 4,
    slug: "home-section-four",
    title: "Home Section Four",
    description: "Manage section four content",
  },
  {
    id: 5,
    slug: "home-section-five",
    title: "Home Section Five",
    description: "Manage section five content",
  },
  {
    id: 6,
    slug: "home-section-six",
    title: "Home Section Six Gallery",
    description: "Manage gallery images",
  },
  {
    id: 7,
    slug: "home-section-seven",
    title: "Home Section Seven Fitness",
    description: "Manage fitness section content",
  },
  {
    id: 8,
    slug: "home-section-eight",
    title: "Home Section Eight Parking",
    description: "Manage parking section content",
  },
  {
    id: 9,
    slug: "home-section-nine",
    title: "Home Section Nine Restaurant & Bar",
    description: "Manage restaurant and bar section",
  },
  {
    id: 10,
    slug: "home-section-ten",
    title: "Home Section Ten Sauna",
    description: "Manage sauna section content",
  },
  {
    id: 11,
    slug: "home-section-eleven",
    title: "Home Section Eleven Pool",
    description: "Manage pool section content",
  },
  {
    id: 12,
    slug: "home-section-twelve",
    title: "Home Section Twelve Family & Kids",
    description: "Manage family and kids section content",
  },
];

export default function HomepageManager() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/30">
            <Home size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Homepage Sections
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Select a home section to manage dynamic homepage content.
            </p>
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {homeSections.map((section) => (
          <Link
            key={section.slug}
            to={`/admin/homepage/${section.slug}`}
            className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Layers size={20} />
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                {section.id === 0 ? "Welcome" : `#${section.id}`}
              </span>
            </div>

            <h2 className="text-sm font-bold text-slate-900">
              {section.title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {section.description}
            </p>

            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600">
              Manage Section
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}