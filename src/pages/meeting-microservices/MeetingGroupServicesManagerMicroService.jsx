import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../../data/store";
import { Save, RotateCcw, Check } from "lucide-react";

const sectionLabels = {
  hero: "Services Hero",
  premium_meeting_venues_in_kigali_rwanda:
    "Premium Meeting Venues in Kigali, Rwanda",
  seamless_meeting_experience: "Seamless Experience",
  catering: "Catering",
  culinary_enhancements: "Culinary Enhancements",
  what_you_get_at: "What You Get",
};

const emptyState = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  items: [],
};

export default function MeetingGroupServicesManagerMicroService() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();

    const initial = siteData?.weddingServices?.[activeSection] || emptyState;

    setData(siteData);
    setEditedSection({ ...initial });
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("Discard changes?")) return;

    const next = data?.weddingServices?.[key] || emptyState;

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

  const updateArrayField = (field, index, value) => {
    const arr = editedSection[field] ? [...editedSection[field]] : [];
    arr[index] = value;
    updateField(field, arr);
  };

  const handleSave = () => {
    const updated = {
      ...data,
      weddingServices: {
        ...data.weddingServices,
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
    const reset = defaultData?.weddingServices?.[activeSection] || emptyState;

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
  const isPremium =
    activeSection === "premium_meeting_venues_in_kigali_rwanda";
  const isSeamless = activeSection === "seamless_meeting_experience";
  const isCatering = activeSection === "catering";
  const isCulinary = activeSection === "culinary_enhancements";
  const isList = activeSection === "what_you_get_at";

  return (
    <section className="mt-10 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Meeting Services</h2>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <Check size={14} />
              Saved
            </span>
          )}

          <button
            onClick={handleReset}
            className="border px-3 py-1 rounded flex items-center gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-amber-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded">
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

      {/* BODY */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* LEFT */}
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

          {/* PREMIUM */}
          {isPremium && (
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

          {/* SEAMLESS */}
          {isSeamless && (
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

              <input
                value={editedSection.imageUrl || ""}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="Image URL"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          {/* CATERING (UNCHANGED - YOUR ORIGINAL STYLE) */}
          {isCatering &&
            [0, 1].map((i) => (
              <div key={i} className="border p-2 rounded space-y-2">
                <input
                  value={editedSection.cards?.[i]?.title || ""}
                  onChange={(e) => {
                    const cards = editedSection.cards || [];
                    cards[i] = {
                      ...cards[i],
                      title: e.target.value,
                    };
                    updateField("cards", cards);
                  }}
                  placeholder={`Card ${i + 1} Title`}
                  className="w-full border p-2 rounded"
                />

                <input
                  value={editedSection.cards?.[i]?.subtitle || ""}
                  onChange={(e) => {
                    const cards = editedSection.cards || [];
                    cards[i] = {
                      ...cards[i],
                      subtitle: e.target.value,
                    };
                    updateField("cards", cards);
                  }}
                  placeholder={`Card ${i + 1} Subtitle`}
                  className="w-full border p-2 rounded"
                />

                <input
                  value={editedSection.cards?.[i]?.imageUrl || ""}
                  onChange={(e) => {
                    const cards = editedSection.cards || [];
                    cards[i] = {
                      ...cards[i],
                      imageUrl: e.target.value,
                    };
                    updateField("cards", cards);
                  }}
                  placeholder={`Card ${i + 1} Image`}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

          {/* CULINARY */}
          {isCulinary &&
            [0, 1, 2].map((i) => (
              <div key={i} className="border p-2 rounded space-y-2">
                <input
                  value={editedSection.titles?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("titles", i, e.target.value)
                  }
                  placeholder={`Title ${i + 1}`}
                  className="w-full border p-2 rounded"
                />

                <input
                  value={editedSection.subtitles?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("subtitles", i, e.target.value)
                  }
                  placeholder={`Subtitle ${i + 1}`}
                  className="w-full border p-2 rounded"
                />

                <input
                  value={editedSection.images?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("images", i, e.target.value)
                  }
                  placeholder={`Image ${i + 1}`}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

          {/* LIST */}
          {isList &&
            Array.from({ length: 12 }).map((_, i) => (
              <input
                key={i}
                value={editedSection.items?.[i] || ""}
                onChange={(e) => updateArrayField("items", i, e.target.value)}
                placeholder={`Item ${i + 1}`}
                className="w-full border p-2 rounded"
              />
            ))}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl">
          {editedSection.imageUrl ? (
            <img
              src={editedSection.imageUrl}
              className="rounded mb-3 w-full h-52 object-cover"
            />
          ) : (
            <div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded mb-3 text-sm text-gray-400">
              No image set
            </div>
          )}

          <h3 className="font-bold text-lg">
            {editedSection.title || "No title"}
          </h3>

          <p className="text-sm text-gray-500">
            {editedSection.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}