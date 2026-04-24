import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../../data/store";
import { Save, RotateCcw, Check } from "lucide-react";

const sectionLabels = {
  hero: "Venues Hero",
  luxury_wedding_venues_in_kigali_rwanda:
    "Luxury Wedding Venues in Kigali, Rwanda",
  garden_ceremony_venue: "Garden Ceremony Venue",
  wedding_reception_hall: "Wedding Reception Hall",
  bar_lounge: "Bar & Lounge",
};

const emptyState = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
};

export default function WeddingVenuesManagerMicroService() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();

    const initial =
      siteData?.weddingVenues?.hero || emptyState;

    setData(siteData);
    setEditedSection({ ...initial });
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("You have unsaved changes. Discard them?"))
      return;

    const next =
      data?.weddingVenues?.[key] || emptyState;

    setActiveSection(key);
    setEditedSection({ ...next });
    setHasChanges(false);
    setSaved(false);
  };

  const updateField = (field, value) => {
    setEditedSection((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    const updated = {
      ...data,
      weddingVenues: {
        ...data.weddingVenues,
        [activeSection]: editedSection,
      },
    };

    saveSiteData(updated);
    setData(updated);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaultData = loadSiteData();
    const reset =
      defaultData?.weddingVenues?.[activeSection] || emptyState;

    setEditedSection({ ...reset });
    setHasChanges(true);
  };

  if (!data || !editedSection) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const isHero = activeSection === "hero";

  const isLuxury =
    activeSection === "luxury_wedding_venues_in_kigali_rwanda";

  return (
    <section className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Wedding Venues</h2>

        <div className="flex items-center gap-2">

          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <Check size={14} />
              Saved
            </span>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1 border px-3 py-1 rounded"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-5 gap-1 bg-gray-100 p-1 rounded">
        {Object.entries(sectionLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => switchSection(key)}
            className={`text-xs p-2 rounded ${
              activeSection === key ? "bg-white shadow" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* EDIT AREA */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">

          {/* HERO → title + image ONLY */}
          {isHero && (
            <>
              <input
                value={editedSection.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Title"
                className="w-full border p-2 rounded"
              />

              <input
                value={editedSection.imageUrl || ""}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="Image URL"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          {/* LUXURY → title + subtitle + description ONLY */}
          {isLuxury && (
            <>
              <input
                value={editedSection.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Title"
                className="w-full border p-2 rounded"
              />

              <input
                value={editedSection.subtitle || ""}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Subtitle"
                className="w-full border p-2 rounded"
              />

              <textarea
                value={editedSection.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          {/* OTHER SECTIONS (UNCHANGED) */}
          {!isHero && !isLuxury && (
            <>
              <input
                value={editedSection.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Title"
                className="w-full border p-2 rounded"
              />

              <input
                value={editedSection.subtitle || ""}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Subtitle"
                className="w-full border p-2 rounded"
              />

              <textarea
                value={editedSection.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />

              <input
                value={editedSection.imageUrl || ""}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="Image URL"
                className="w-full border p-2 rounded"
              />
            </>
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl">

          {/* IMAGE ONLY FOR HERO + OTHER SECTIONS (NOT LUXURY) */}
          {editedSection?.imageUrl && !isLuxury ? (
            <img
              src={editedSection.imageUrl}
              className="rounded mb-3 w-full h-52 object-cover"
              alt="preview"
            />
          ) : !isLuxury && (
            <div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded mb-3 text-sm text-gray-400">
              No image set
            </div>
          )}

          <h3 className="font-bold text-lg">
            {editedSection?.title || "No title"}
          </h3>

          {editedSection?.subtitle && (
            <p className="text-sm text-gray-500">
              {editedSection.subtitle}
            </p>
          )}

          {editedSection?.description && (
            <p className="text-sm mt-2 text-gray-600">
              {editedSection.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}