import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../data/store";
import {
  Save,
  RotateCcw,
  Check,
  Image,
  Type,
  Link2,
  AlertCircle,
} from "lucide-react";

import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

const sectionLabels = {
  hero: "Hero Section",
  envision_your_special_day: "Envision Your Special Day Section",
  services: "Services Section",
  why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
  prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
  wedding_accommodations: "Wedding Accommodations Section",
  Location: "Location Section",
  multiple_images: "Multiple Images Section",
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
    setEditedSection({ ...siteData.homepage["hero"] });
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("You have unsaved changes. Discard them?"))
      return;

    setActiveSection(key);
    setEditedSection({ ...data.homepage[key] });
    setHasChanges(false);
    setSaved(false);
  };

  const updateField = (field, value) => {
    setEditedSection({ ...editedSection, [field]: value });
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
    const defaultData = loadSiteData();
    setEditedSection({ ...defaultData.homepage[activeSection] });
    setHasChanges(true);
  };

  if (!data || !editedSection) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  // =========================
  // RULES (MATCHED + CLEAN)
  // =========================

  const showTitle = activeSection !== "multiple_images";

  const showSubtitle =
    activeSection !== "multiple_images" &&
    activeSection !== "services";

  const showImage = ![
    "why_choose_luxury_garden_palace",
    "services",
  ].includes(activeSection);

  const isTwoImages =
    activeSection === "envision_your_special_day" ||
    activeSection === "prime_luxury_apartment_living";

  const isFourImages =
    activeSection === "multiple_images" ||
    activeSection === "hero";

  const isServices = activeSection === "services";

  return (
    <section>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Wedding homepage Content
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Edit the content displayed on your wedding
            </p>
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
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
                hasChanges
                  ? "bg-gradient-to-r from-amber-500 to-amber-600"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          {Object.entries(sectionLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => switchSection(key)}
              className={`text-[10px] p-2 rounded-lg ${
                activeSection === key ? "bg-white shadow" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">

            {showTitle && (
              <input
                value={editedSection.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Title"
              />
            )}

            {showSubtitle && (
              <input
                value={editedSection.subtitle || ""}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Subtitle"
              />
            )}

            {showImage && !isTwoImages && !isFourImages && (
              <input
                value={editedSection.imageUrl || ""}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Image URL"
              />
            )}

            {isTwoImages &&
              [0, 1].map((i) => (
                <input
                  key={i}
                  value={editedSection.images?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("images", i, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                  placeholder={`Image ${i + 1}`}
                />
              ))}

            {isFourImages &&
              [0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  value={editedSection.images?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("images", i, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                  placeholder={`Image ${i + 1}`}
                />
              ))}

            {isServices &&
              Array.from({ length: 12 }).map((_, i) => (
                <input
                  key={i}
                  value={editedSection.items?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("items", i, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                  placeholder={`Service ${i + 1}`}
                />
              ))}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl">

            {editedSection.imageUrl && (
              <img
                src={editedSection.imageUrl}
                className="rounded mb-3"
              />
            )}

            {editedSection.images?.map((img, i) => (
              <img key={i} src={img} className="rounded mb-2" />
            ))}

            <h3 className="font-bold text-lg">
              {editedSection.title}
            </h3>

            <p className="text-sm text-gray-500">
              {showSubtitle ? editedSection.subtitle : null}
            </p>

            {editedSection.items && (
              <ul className="text-sm mt-2 list-disc pl-4">
                {editedSection.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* MICRO SERVICES (UNCHANGED CALLS) */}
      <WeddingVenuesManagerMicroService />
      <WeddingServicesManagerMicroService />
      <WeddingPackagesManagerMicroService />
      <WeddingRoomBlocksManagerMicroService />
      <WeddingGalleryManagerMicroService />
    </section>
  );
}