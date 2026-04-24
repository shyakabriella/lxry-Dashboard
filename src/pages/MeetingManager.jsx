import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../data/store";
import { Save, RotateCcw, Check } from "lucide-react";

import MeetingVenuesManagerMicroService from "./meeting-microservices/MeetingVenuesManagerMicroService";
import MeetingGroupServicesManagerMicroService from "./meeting-microservices/MeetingGroupServicesManagerMicroService";
import MeetingGalleryManagerMicroService from "./meeting-microservices/MeetingGalleryManagerMicroService";

const sectionLabels = {
  hero: "Hero Section",
  corporate_meetings_one: "Corporate Meetings One",
  our_meeting_amenities: "Our Meeting Amenities",
  why_choose_luxury: "Why Choose Luxury",
  corporate_meetings_two: "Corporate Meetings Two",
  meetings_conferences: "Meetings & Conferences",
  corporate_meetings_three: "Corporate Meetings Three",
  meeting_images: "Meeting Images",
};

export default function MeetingManager() {
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
  // SECTION TYPES
  // =========================

  const isHero = activeSection === "hero";
  const isCorporateOne = activeSection === "corporate_meetings_one";
  const isCorporateTwo = activeSection === "corporate_meetings_two";
  const isCorporateThree = activeSection === "corporate_meetings_three";
  const isMeetingsConferences = activeSection === "meetings_conferences";
  const isMeetingImages = activeSection === "meeting_images";
  const isAmenities = activeSection === "our_meeting_amenities";
  const isWhyChoose = activeSection === "why_choose_luxury";

  return (
    <section>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Meeting homepage Content
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Edit the content displayed on your meeting
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
              className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm"
            >
              Reset
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-lg text-sm text-white ${
                hasChanges ? "bg-amber-500" : "bg-slate-300"
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-4 gap-1 rounded-xl border bg-slate-100 p-1">
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

          {/* LEFT SIDE */}
          <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">

            {/* HERO */}
            {isHero &&
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 border-b pb-3">
                  <input
                    placeholder={`Title ${i + 1}`}
                    value={editedSection.titles?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("titles", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />

                  <input
                    placeholder={`Subtitle ${i + 1}`}
                    value={editedSection.subtitles?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("subtitles", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />

                  <input
                    placeholder={`Image ${i + 1}`}
                    value={editedSection.images?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("images", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}

            {/* CORPORATE ONE */}
            {isCorporateOne && (
              <>
                <input
                  placeholder="Title"
                  value={editedSection.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Subtitle"
                  value={editedSection.subtitle || ""}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="w-full border p-2 rounded"
                />

                {[0, 1].map((i) => (
                  <input
                    key={i}
                    placeholder={`Image ${i + 1}`}
                    value={editedSection.images?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("images", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                ))}
              </>
            )}

            {/* CORPORATE TWO */}
            {isCorporateTwo && (
              <>
                <input
                  placeholder="Title"
                  value={editedSection.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Subtitle"
                  value={editedSection.subtitle || ""}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="w-full border p-2 rounded"
                />

                {[0, 1].map((i) => (
                  <input
                    key={i}
                    placeholder={`Image ${i + 1}`}
                    value={editedSection.images?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("images", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                ))}
              </>
            )}

            {/* MEETINGS CONFERENCES (NEW FIX) */}
            {isMeetingsConferences && (
              <>
                <input
                  placeholder="Title"
                  value={editedSection.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  placeholder="Subtitle"
                  value={editedSection.subtitle || ""}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  placeholder="Image URL"
                  value={editedSection.imageUrl || ""}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </>
            )}

            {/* CORPORATE THREE (NEW FIX) */}
            {isCorporateThree && (
              <>
                <input
                  placeholder="Title"
                  value={editedSection.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  placeholder="Subtitle"
                  value={editedSection.subtitle || ""}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  placeholder="Image URL"
                  value={editedSection.imageUrl || ""}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </>
            )}

            {/* MEETING IMAGES */}
            {isMeetingImages &&
              [0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  placeholder={`Image ${i + 1}`}
                  value={editedSection.images?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("images", i, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              ))}

            {/* AMENITIES */}
            {isAmenities &&
              Array.from({ length: 9 }).map((_, i) => (
                <input
                  key={i}
                  placeholder={`Item ${i + 1}`}
                  value={editedSection.items?.[i] || ""}
                  onChange={(e) =>
                    updateArrayField("items", i, e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              ))}

            {/* WHY CHOOSE */}
            {isWhyChoose &&
              [0, 1, 2].map((i) => (
                <div key={i} className="border-b pb-3 space-y-2">
                  <input
                    placeholder="Title"
                    value={editedSection.titles?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("titles", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                  <input
                    placeholder="Subtitle"
                    value={editedSection.subtitles?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("subtitles", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                  <input
                    placeholder="Image"
                    value={editedSection.images?.[i] || ""}
                    onChange={(e) =>
                      updateArrayField("images", i, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl">
            <h3 className="font-bold text-lg">
              {editedSection.title || "Preview"}
            </h3>
          </div>
        </div>
      </div>

      {/* MICRO SERVICES */}
      <MeetingVenuesManagerMicroService />
      <MeetingGroupServicesManagerMicroService />
      <MeetingGalleryManagerMicroService />
    </section>
  );
}