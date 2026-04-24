import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../../data/store";
import { Save, RotateCcw, Check } from "lucide-react";

const sectionLabels = {
  hero: "Gallery Hero",
  overview: "Gallery Overview",
  images: "Wedding Images",
};

const emptyState = {
  title: "",
  subtitle: "",
  imageUrl: "",
  images: [],
};

export default function WeddingGalleryManagerMicroService() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();

    const initial =
      siteData?.weddingGallery?.[activeSection] || emptyState;

    setData(siteData);
    setEditedSection({ ...initial });
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("Discard changes?")) return;

    const next =
      data?.weddingGallery?.[key] || emptyState;

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

  const updateArrayField = (index, value) => {
    const arr = editedSection.images ? [...editedSection.images] : [];
    arr[index] = value;
    updateField("images", arr);
  };

  const handleSave = () => {
    const updated = {
      ...data,
      weddingGallery: {
        ...data.weddingGallery,
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
      defaultData?.weddingGallery?.[activeSection] || emptyState;

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
  const isOverview = activeSection === "overview";
  const isImages = activeSection === "images";

  return (
    <section className="mt-10 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Wedding Gallery</h2>

        <div className="flex gap-2">
          {saved && (
            <span className="text-green-600 flex items-center gap-1">
              <Check size={14} />Saved
            </span>
          )}

          <button
            onClick={handleReset}
            className="border px-3 py-1 rounded flex items-center gap-1"
          >
            <RotateCcw size={14} />Reset
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-amber-500 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
          >
            <Save size={14} />Save
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded">
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

          {/* HERO */}
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

          {/* OVERVIEW */}
          {isOverview && (
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
            </>
          )}

          {/* IMAGES (30 INPUTS) */}
          {isImages &&
            Array.from({ length: 30 }).map((_, i) => (
              <input
                key={i}
                value={editedSection.images?.[i] || ""}
                onChange={(e) => updateArrayField(i, e.target.value)}
                placeholder={`Image ${i + 1}`}
                className="w-full border p-2 rounded"
              />
            ))}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl">

          {/* HERO PREVIEW */}
          {isHero && (
            <>
              {editedSection.imageUrl ? (
                <img
                  src={editedSection.imageUrl}
                  className="w-full h-52 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded mb-3 text-sm text-gray-400">
                  No image set
                </div>
              )}

              <h3 className="font-bold text-lg">
                {editedSection.title || "No title"}
              </h3>
            </>
          )}

          {/* OVERVIEW PREVIEW */}
          {isOverview && (
            <>
              <h3 className="font-bold text-lg">
                {editedSection.title || "No title"}
              </h3>

              <p className="text-sm text-gray-500">
                {editedSection.subtitle || "No subtitle"}
              </p>
            </>
          )}

          {/* IMAGES PREVIEW */}
          {isImages && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 30 }).map((_, i) =>
                editedSection.images?.[i] ? (
                  <img
                    key={i}
                    src={editedSection.images[i]}
                    className="h-20 w-full object-cover rounded"
                  />
                ) : (
                  <div
                    key={i}
                    className="h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded"
                  >
                    No image
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}