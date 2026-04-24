import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../data/store";
import { Save, RotateCcw, Check, Plus, Trash2 } from "lucide-react";

const sectionLabels = {
  wedding: "Wedding",
  accommodation: "Accommodation",
  restaurant: "Restaurant",
  bar: "Bar",
  massage_spa: "Massage & Spa",
  gym: "Gym",
};

export default function GalleryManager() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("wedding");
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();

    const sectionImages =
      siteData?.homepage?.[activeSection]?.images || [];

    setData(siteData);
    setImages(sectionImages);
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;

    setActiveSection(key);

    const sectionImages =
      data?.homepage?.[key]?.images || [];

    setImages(sectionImages);
    setNewImage("");
    setHasChanges(false);
    setSaved(false);
  };

  const addImage = () => {
    if (!newImage.trim()) return;

    const updated = [...images, newImage.trim()];
    setImages(updated);
    setNewImage("");
    setHasChanges(true);
  };

  const deleteImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!data) return;

    const updated = {
      ...data,
      homepage: {
        ...data.homepage,
        [activeSection]: {
          images,
        },
      },
    };

    saveSiteData(updated);
    setData(updated);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirm("Reset images for this section?")) return;

    const defaultData = loadSiteData();
    const resetImages =
      defaultData?.homepage?.[activeSection]?.images || [];

    setImages(resetImages);
    setHasChanges(true);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gallery Manager</h1>
          <p className="text-sm text-slate-500">
            Manage all section images
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {saved && (
            <span className="text-green-600 text-sm flex items-center gap-1">
              <Check size={16} />
              Saved
            </span>
          )}

          <button
            onClick={handleReset}
            className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 ${
              hasChanges ? "bg-amber-500" : "bg-slate-300"
            }`}
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* Section buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-slate-100 p-2 rounded-xl">
        {Object.entries(sectionLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => switchSection(key)}
            className={`px-4 py-2 rounded-lg text-[10px] ${
              activeSection === key
                ? "bg-white shadow text-black"
                : "text-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Uploader + Gallery */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Upload */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">
            {sectionLabels[activeSection]} Images
          </h2>

          <div className="flex gap-2">
            <input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />

            <button
              onClick={addImage}
              className="bg-amber-500 text-white px-4 rounded-lg flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Add or remove images anytime. Everything updates per section.
          </p>
        </div>

        {/* Gallery */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Current Images</h3>

          {images.length === 0 ? (
            <p className="text-sm text-slate-400">No images yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    className="h-28 w-full object-cover rounded-lg border"
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400")
                    }
                  />

                  <button
                    onClick={() => deleteImage(i)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}