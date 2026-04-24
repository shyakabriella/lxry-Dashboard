import { useEffect, useState } from "react";
import { loadSiteData, saveSiteData } from "../../data/store";
import { Save, RotateCcw, Check } from "lucide-react";

const sectionLabels = {
  hero: "Room Blocks Hero",
  meeting_rooms_in_california: "Meeting Rooms in California",
  accomodation: "Accomodation Types",
  restful_essentials: "Restful Essentials",
};

const emptyState = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  cards: [],
  items: [],
};

export default function WeddingRoomBlocksManagerMicroService() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();

    const initial =
      siteData?.weddingRoomBlocks?.[activeSection] || emptyState;

    setData(siteData);
    setEditedSection({ ...initial });
  }, []);

  const switchSection = (key) => {
    if (hasChanges && !confirm("Discard changes?")) return;

    const next =
      data?.weddingRoomBlocks?.[key] || emptyState;

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

  const updateCardField = (index, field, value) => {
    const cards = [...(editedSection.cards || [])];

    cards[index] = {
      ...cards[index],
      [field]: value,
    };

    updateField("cards", cards);
  };

  const updateArrayField = (field, index, value) => {
    const arr = editedSection[field] ? [...editedSection[field]] : [];
    arr[index] = value;
    updateField(field, arr);
  };

  const handleSave = () => {
    const updated = {
      ...data,
      weddingRoomBlocks: {
        ...data.weddingRoomBlocks,
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
      defaultData?.weddingRoomBlocks?.[activeSection] || emptyState;

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
  const isMeetingRooms =
    activeSection === "meeting_rooms_in_california";
  const isAccomodation = activeSection === "accomodation";
  const isEssentials = activeSection === "restful_essentials";

  return (
    <section className="mt-10 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Wedding Room Blocks</h2>

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

          {/* MEETING ROOMS */}
          {isMeetingRooms && (
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

          {/* ACCOMODATION (3 CARDS × 3 IMAGES EACH) */}
          {isAccomodation &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border p-3 rounded space-y-2">

                <input
                  value={editedSection.cards?.[i]?.title || ""}
                  onChange={(e) =>
                    updateCardField(i, "title", e.target.value)
                  }
                  placeholder={`Card ${i + 1} Title`}
                  className="w-full border p-2 rounded"
                />

                <input
                  value={editedSection.cards?.[i]?.subtitle || ""}
                  onChange={(e) =>
                    updateCardField(i, "subtitle", e.target.value)
                  }
                  placeholder="Subtitle"
                  className="w-full border p-2 rounded"
                />

                <textarea
                  value={editedSection.cards?.[i]?.description || ""}
                  onChange={(e) =>
                    updateCardField(i, "description", e.target.value)
                  }
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                />

                {/* 3 IMAGE URLS PER CARD */}
                {[0, 1, 2].map((imgIndex) => (
                  <input
                    key={imgIndex}
                    value={
                      editedSection.cards?.[i]?.images?.[imgIndex] || ""
                    }
                    onChange={(e) => {
                      const cards = [...(editedSection.cards || [])];
                      const images = [
                        ...(cards[i]?.images || []),
                      ];
                      images[imgIndex] = e.target.value;

                      cards[i] = {
                        ...cards[i],
                        images,
                      };

                      updateField("cards", cards);
                    }}
                    placeholder={`Image ${imgIndex + 1}`}
                    className="w-full border p-2 rounded"
                  />
                ))}
              </div>
            ))}

          {/* ESSENTIALS */}
          {isEssentials &&
            Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                value={editedSection.items?.[i] || ""}
                onChange={(e) =>
                  updateArrayField("items", i, e.target.value)
                }
                placeholder={`Item ${i + 1}`}
                className="w-full border p-2 rounded"
              />
            ))}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl">

          {/* HERO PREVIEW */}
          {isHero && editedSection.imageUrl && (
            <img
              src={editedSection.imageUrl}
              className="rounded mb-3 w-full h-52 object-cover"
            />
          )}

          {/* ACCOMODATION PREVIEW */}
          {isAccomodation &&
            editedSection.cards?.map((card, i) => (
              <div key={i} className="mb-5 border rounded p-2">

                {/* IMAGE STACK */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {card?.images?.length ? (
                    card.images.map((img, idx) =>
                      img ? (
                        <img
                          key={idx}
                          src={img}
                          className="h-20 w-full object-cover rounded"
                        />
                      ) : (
                        <div
                          key={idx}
                          className="h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded"
                        >
                          No image
                        </div>
                      )
                    )
                  ) : (
                    <div className="col-span-3 h-20 flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded">
                      No image set
                    </div>
                  )}
                </div>

                <h4 className="font-bold">{card?.title}</h4>
                <p className="text-sm text-gray-500">
                  {card?.subtitle}
                </p>
              </div>
            ))}

          {/* ESSENTIALS PREVIEW */}
          {isEssentials && (
            <ul className="list-disc pl-5 text-sm">
              {editedSection.items?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {/* MEETING ROOMS PREVIEW */}
          {isMeetingRooms && (
            <>
              <h3 className="font-bold text-lg">
                {editedSection.title}
              </h3>
              <p className="text-sm text-gray-500">
                {editedSection.subtitle}
              </p>
              <p className="text-sm mt-2">
                {editedSection.description}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}