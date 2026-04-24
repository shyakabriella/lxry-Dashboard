import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../../data/store";
import { Save, RotateCcw, Check } from "lucide-react";

const sectionLabels = {
  hero: "Packages Hero",
  wedding_packages: "Wedding Packages",
  classic_package: "Classic Package",
  premium_package: "Premium Package",
  included_benefits: "Included Benefits",
  bar_packages: "Bar Packages",
};

const emptyState = {
  title: "",
  subtitle: "",
  imageUrl: "",
  items: [],
  blocks: [],
};

export default function WeddingPackagesManagerMicroService() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();

    const initial =
      siteData?.weddingPackages?.[activeSection] || emptyState;

    setData(siteData);
    setEditedSection({ ...initial });
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("Discard changes?")) return;

    const next =
      data?.weddingPackages?.[key] || emptyState;

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
      weddingPackages: {
        ...data.weddingPackages,
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
      defaultData?.weddingPackages?.[activeSection] || emptyState;

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
  const isWeddingPackages = activeSection === "wedding_packages";
  const isClassic = activeSection === "classic_package";
  const isPremium = activeSection === "premium_package";
  const isBenefits = activeSection === "included_benefits";
  const isBar = activeSection === "bar_packages";

  return (
    <section className="mt-10 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold">Wedding Packages</h2>

        <div className="flex gap-2">
          {saved && (
            <span className="text-green-600 flex items-center gap-1">
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
            className="bg-amber-500 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1 bg-gray-100 p-1 rounded">
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

          {/* SIMPLE */}
          {isWeddingPackages && (
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

          {/* CLASSIC (6 ITEMS) */}
          {isClassic && (
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

              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  value={editedSection.items?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("items", i, e.target.value)
                  }
                  placeholder={`Feature ${i + 1}`}
                  className="w-full border p-2 rounded"
                />
              ))}
            </>
          )}

          {/* PREMIUM (7 ITEMS) */}
          {isPremium && (
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

              {Array.from({ length: 7 }).map((_, i) => (
                <input
                  key={i}
                  value={editedSection.items?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("items", i, e.target.value)
                  }
                  placeholder={`Feature ${i + 1}`}
                  className="w-full border p-2 rounded"
                />
              ))}
            </>
          )}

          {/* INCLUDED BENEFITS (15 ITEMS) */}
          {isBenefits &&
            Array.from({ length: 15 }).map((_, i) => (
              <input
                key={i}
                value={editedSection.items?.[i] || ""}
                onChange={(e) =>
                  updateArrayField("items", i, e.target.value)
                }
                placeholder={`Benefit ${i + 1}`}
                className="w-full border p-2 rounded"
              />
            ))}

          {/* BAR PACKAGES (7 BLOCKS) */}
          {isBar &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border p-3 rounded space-y-2">

                {/* TITLE */}
                <input
                  value={editedSection.blocks?.[i]?.title || ""}
                  onChange={(e) => {
                    const blocks = editedSection.blocks || [];
                    blocks[i] = {
                      ...blocks[i],
                      title: e.target.value,
                    };
                    updateField("blocks", blocks);
                  }}
                  placeholder={`Block ${i + 1} Title`}
                  className="w-full border p-2 rounded"
                />

                {/* IMAGE */}
                <input
                  value={editedSection.blocks?.[i]?.imageUrl || ""}
                  onChange={(e) => {
                    const blocks = editedSection.blocks || [];
                    blocks[i] = {
                      ...blocks[i],
                      imageUrl: e.target.value,
                    };
                    updateField("blocks", blocks);
                  }}
                  placeholder={`Block ${i + 1} Image URL`}
                  className="w-full border p-2 rounded"
                />

                {/* 4 ITEMS */}
                {Array.from({ length: 4 }).map((_, j) => (
                  <input
                    key={j}
                    value={editedSection.blocks?.[i]?.items?.[j] || ""}
                    onChange={(e) => {
                      const blocks = editedSection.blocks || [];
                      const items = blocks[i]?.items || [];

                      items[j] = e.target.value;

                      blocks[i] = {
                        ...blocks[i],
                        items,
                      };

                      updateField("blocks", blocks);
                    }}
                    placeholder={`Item ${j + 1}`}
                    className="w-full border p-2 rounded"
                  />
                ))}

              </div>
            ))}
        </div>

        {/* RIGHT PREVIEW */}
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

          {editedSection.subtitle && (
            <p className="text-sm text-gray-500">
              {editedSection.subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}