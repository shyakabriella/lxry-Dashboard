import { useEffect, useState } from "react";
import {
  loadSiteData,
  saveSiteData,
} from "../data/store";
import { Save, RotateCcw, Check, Image, Type, Link2, AlertCircle } from "lucide-react";

const sectionLabels = {
  hero: "Hero Section",
  about_one: "About Section Above",
  about_two: "About Section Below",
  for_every_event: "For Every Event Section",
  accomodation: "Accomodation Section",
  luxury_lay_of_land: "The Luxury Layout of Land Section",
  multiple_images: "Multiple Images Section",
  fitness: "Fitness Section",
  parking: "Parking Section",
  restaurant_bar_experience: "Restaurant & Bar Experience Section",
  massage: "Massage & Spa Section",
  infinity_pool: "Infinity Pool Experience Section",
  family_xperience_kids_zone: "Family Experience & Kids Zone Section"

};

export default function WeddingManager() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();
    setData(siteData);
    setEditedSection({ ...siteData.homepage[activeSection] });
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
    setActiveSection(key);
    if (data) {
      setEditedSection({ ...data.homepage[key] });
      setHasChanges(false);
      setSaved(false);
    }
  };

  const updateField = (field, value) => {
    if (!editedSection) return;
    setEditedSection({ ...editedSection, [field]: value });
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    if (!data || !editedSection) return;
    const updated = {
      ...data,
      homepage: {
        ...data.homepage,
        [activeSection]: editedSection,
      },
    };
    saveSiteData(updated);
    setData(updated);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!confirm("Reset this section to its default content?")) return;
    if (!data) return;
    const defaultData = loadSiteData();
    const reset = { ...defaultData.homepage[activeSection] };
    setEditedSection(reset);
    setHasChanges(true);
  };

  if (!data || !editedSection) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const fields = [
    { key: "title", label: "Title", icon: Type, type: "text", placeholder: "Section title..." },
    { key: "subtitle", label: "Subtitle", icon: Type, type: "text", placeholder: "Section subtitle..." },
    { key: "imageUrl", label: "Image URL", icon: Image, type: "url", placeholder: "https://..." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homepage Content</h1>
          <p className="mt-1 text-sm text-slate-500">Edit the content displayed on your homepage</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check size={16} />
              Saved successfully
            </span>
          )}
          <button
            onClick={handleReset}
            className="inline-flex items-cunnter gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
              hasChanges
                ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm hover:from-amber-600 hover:to-amber-700 active:scale-[0.98]"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
        {Object.entries(sectionLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => switchSection(key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeSection === key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Edit form */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              Edit {sectionLabels[activeSection]}
            </h2>
            <div className="space-y-4">
              {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
                <div key={key}>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Icon size={14} className="text-slate-400" />
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      value={editedSection[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      rows={4}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-y"
                    />
                  ) : (
                    <input
                      type={type === "url" ? "url" : "text"}
                      value={editedSection[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <p className="text-xs font-medium text-slate-500">Live Preview</p>
              </div>
              <div className="p-1">
                {editedSection.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={editedSection.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600";
                      }}
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  {editedSection.subtitle && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                      {editedSection.subtitle}
                    </p>
                  )}
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {editedSection.title || "No title set"}
                  </h3>
                  {editedSection.content && (
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                      {editedSection.content}
                    </p>
                  )}
                  {editedSection.ctaText && (
                    <span className="mt-3 inline-block rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white">
                      {editedSection.ctaText}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Tips</p>
                  <ul className="mt-1 space-y-1 text-xs text-blue-600">
                    <li>• Use high-quality images for best results</li>
                    <li>• Keep titles short and impactful</li>
                    <li>• Content should be clear and engaging</li>
                    <li>• CTA links use section IDs (e.g., #about)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
