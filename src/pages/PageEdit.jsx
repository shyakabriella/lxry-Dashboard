import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Eye,
  Image,
  Link2,
  Loader2,
  Save,
  ToggleLeft,
  Type,
} from "lucide-react";

const STORAGE_KEY = "luxury_homepage_sections";

const homeSections = [
  { id: 1, slug: "home-section-one", title: "Home Section One" },
  { id: 2, slug: "home-section-two", title: "Home Section Two" },
  { id: 3, slug: "home-section-three", title: "Home Section Three" },
  { id: 4, slug: "home-section-four", title: "Home Section Four" },
  { id: 5, slug: "home-section-five", title: "Home Section Five" },
  { id: 6, slug: "home-section-six", title: "Home Section Six" },
  { id: 7, slug: "home-section-seven", title: "Home Section Seven" },
  { id: 8, slug: "home-section-eight", title: "Home Section Eight" },
  { id: 9, slug: "home-section-nine", title: "Home Section Nine" },
  { id: 10, slug: "home-section-ten", title: "Home Section Ten" },
  { id: 11, slug: "home-section-eleven", title: "Home Section Eleven" },
];

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  buttonText: "",
  buttonLink: "",
  isActive: true,
};

function loadSections() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveSections(sections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
}

export default function PageEdit() {
  const { sectionSlug } = useParams();
  const navigate = useNavigate();

  const currentSection = useMemo(() => {
    return homeSections.find((section) => section.slug === sectionSlug);
  }, [sectionSlug]);

  const [form, setForm] = useState(emptyForm);
  const [savedData, setSavedData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (!currentSection) return;

    const allSections = loadSections();
    const existingData = allSections[currentSection.slug] || null;

    if (existingData) {
      setForm(existingData);
      setSavedData(existingData);
    } else {
      setForm(emptyForm);
      setSavedData(null);
    }
  }, [currentSection]);

  if (!currentSection) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => navigate("/admin/property/home")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Property Home
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-bold text-red-700">
            Section not found
          </h1>

          <p className="mt-1 text-sm text-red-600">
            The homepage section you opened does not exist.
          </p>
        </div>
      </div>
    );
  }

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const handleSave = () => {
    setSaving(true);

    const allSections = loadSections();

    const updatedSection = {
      ...form,
      sectionId: currentSection.id,
      sectionSlug: currentSection.slug,
      sectionName: currentSection.title,
      updatedAt: new Date().toISOString(),
    };

    const updatedSections = {
      ...allSections,
      [currentSection.slug]: updatedSection,
    };

    saveSections(updatedSections);

    setSavedData(updatedSection);
    setSaving(false);
    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  const handleClear = () => {
    if (!confirm("Clear this section form?")) return;

    setForm(emptyForm);
    setSavedMessage(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/property/home"
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft size={16} />
            Back to Property Home
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">
            {currentSection.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Edit this homepage section from the left side and see saved content
            on the right side.
          </p>
        </div>

        {savedMessage && (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <Check size={16} />
            Section saved successfully
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Update Section
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fill this form and click save.
            </p>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Type size={15} className="text-slate-400" />
                Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter section title"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Type size={15} className="text-slate-400" />
                Subtitle
              </label>

              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Enter section subtitle"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Type size={15} className="text-slate-400" />
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                placeholder="Enter section description"
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Image size={15} className="text-slate-400" />
                Image URL
              </label>

              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* Button Text + Button Link */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={15} className="text-slate-400" />
                  Button Text
                </label>

                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(e) => updateField("buttonText", e.target.value)}
                  placeholder="Example: Learn More"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={15} className="text-slate-400" />
                  Button Link
                </label>

                <input
                  type="text"
                  value={form.buttonLink}
                  onChange={(e) => updateField("buttonLink", e.target.value)}
                  placeholder="Example: /rooms or #about"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            {/* Active */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ToggleLeft size={16} className="text-slate-400" />
                Active Section
              </span>

              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
            </label>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-amber-500/25 transition hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}

                {saving ? "Saving..." : "Save Section"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Right Saved Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Saved Preview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This side shows what you saved.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Eye size={19} />
            </div>
          </div>

          {!savedData ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Save size={24} />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  No saved content yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Fill the form on the left and click “Save Section”. After
                  saving, your section preview will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {savedData.imageUrl ? (
                <div className="aspect-video bg-slate-100">
                  <img
                    src={savedData.imageUrl}
                    alt={savedData.title || currentSection.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900";
                    }}
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm text-slate-400">
                  No image saved
                </div>
              )}

              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    {currentSection.title}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      savedData.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {savedData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {savedData.subtitle && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                    {savedData.subtitle}
                  </p>
                )}

                <h3 className="text-2xl font-bold leading-tight text-slate-900">
                  {savedData.title || "No title saved"}
                </h3>

                {savedData.description && (
                  <p className="text-sm leading-7 text-slate-600">
                    {savedData.description}
                  </p>
                )}

                {savedData.buttonText && (
                  <div className="pt-2">
                    <span className="inline-flex rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white">
                      {savedData.buttonText}
                    </span>

                    {savedData.buttonLink && (
                      <p className="mt-2 text-xs text-slate-400">
                        Link: {savedData.buttonLink}
                      </p>
                    )}
                  </div>
                )}

                {savedData.updatedAt && (
                  <p className="border-t border-slate-100 pt-3 text-xs text-slate-400">
                    Last updated:{" "}
                    {new Date(savedData.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}