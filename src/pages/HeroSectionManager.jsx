import { useEffect, useState } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  Building2,
  MapPin,
  Images,
  BadgeCheck,
  Layers,
  Home,
  BedDouble,
  UtensilsCrossed,
  Camera,
  Package,
  Users,
  Image,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const APP_URL = API_URL.replace(/\/api$/, "");

const STORAGE_URL = (
  import.meta.env.VITE_STORAGE_URL || `${APP_URL}/storage`
).replace(/\/$/, "");

const weddingGroups = [
  {
    key: "hero",
    title: "Wedding Hero Slides",
    subtitle: "Select and manage all wedding page sections from one clean place.",
    badge: "Hero",
    icon: Sparkles,
  },
  {
    key: "venues",
    title: "Wedding Venues",
    subtitle: "Manage wedding venues content and ceremony sections.",
    badge: "#1",
    icon: Building2,
  },
  {
    key: "services",
    title: "Wedding Services",
    subtitle: "Manage services, catering, and wedding experience content.",
    badge: "#2",
    icon: UtensilsCrossed,
  },
  {
    key: "packages",
    title: "Wedding Packages",
    subtitle: "Manage wedding packages, benefits, and bar packages.",
    badge: "#3",
    icon: Package,
  },
  {
    key: "room-blocks",
    title: "Wedding Room Blocks",
    subtitle: "Manage accommodation and room block content.",
    badge: "#4",
    icon: BedDouble,
  },
  {
    key: "gallery",
    title: "Wedding Gallery",
    subtitle: "Manage wedding gallery images and visual content.",
    badge: "#5",
    icon: Images,
  },
];

const weddingSectionCards = {
  hero: [
    {
      key: "hero-slides",
      title: "Hero Section",
      subtitle: "Manage wedding hero slider images and content.",
      badge: "Hero",
      icon: Sparkles,
      type: "slides",
    },
    {
      key: "special-day",
      title: "Envision Your Special Day Section",
      subtitle: "Manage special day introduction content.",
      badge: "#1",
      icon: Heart,
    },
    {
      key: "services-section",
      title: "Services Section",
      subtitle: "Manage wedding service details.",
      badge: "#2",
      icon: Layers,
    },
    {
      key: "why-choose",
      title: "Why Choose Luxury Garden Palace Section",
      subtitle: "Manage reasons and benefits.",
      badge: "#3",
      icon: BadgeCheck,
    },
    {
      key: "apartment",
      title: "Prime Luxury Apartment Living Section",
      subtitle: "Manage luxury apartment content.",
      badge: "#4",
      icon: Home,
    },
    {
      key: "accommodations",
      title: "Wedding Accommodations Section",
      subtitle: "Manage accommodation content.",
      badge: "#5",
      icon: Building2,
    },
    {
      key: "location",
      title: "Location Section",
      subtitle: "Manage wedding location content.",
      badge: "#6",
      icon: MapPin,
    },
    {
      key: "multiple-images",
      title: "Multiple Images Section",
      subtitle: "Manage wedding gallery images.",
      badge: "#7",
      icon: Images,
    },
  ],

  venues: [
    {
      key: "venues-hero",
      title: "Venues Hero",
      subtitle: "Manage the wedding venues hero section.",
      badge: "Hero",
      icon: Sparkles,
    },
    {
      key: "luxury-wedding-venues",
      title: "Luxury Wedding Venues in Kigali, Rwanda",
      subtitle: "Manage luxury wedding venue introduction content.",
      badge: "#1",
      icon: Building2,
    },
    {
      key: "garden-ceremony",
      title: "Garden Ceremony Venue",
      subtitle: "Manage garden ceremony venue content.",
      badge: "#2",
      icon: Heart,
    },
    {
      key: "reception-hall",
      title: "Wedding Reception Hall",
      subtitle: "Manage reception hall content and details.",
      badge: "#3",
      icon: Users,
    },
    {
      key: "bar-lounge",
      title: "Bar & Lounge",
      subtitle: "Manage wedding bar and lounge content.",
      badge: "#4",
      icon: UtensilsCrossed,
    },
  ],

  services: [
    {
      key: "services-hero",
      title: "Services Hero",
      subtitle: "Manage the wedding services hero section.",
      badge: "Hero",
      icon: Sparkles,
    },
    {
      key: "luxury-wedding-venues",
      title: "Luxury Wedding Venues",
      subtitle: "Manage service venue content.",
      badge: "#1",
      icon: Building2,
    },
    {
      key: "seamless-experience",
      title: "Seamless Experience",
      subtitle: "Manage seamless wedding experience content.",
      badge: "#2",
      icon: BadgeCheck,
    },
    {
      key: "catering",
      title: "Catering",
      subtitle: "Manage catering service content.",
      badge: "#3",
      icon: UtensilsCrossed,
    },
    {
      key: "culinary-enhancements",
      title: "Culinary Enhancements",
      subtitle: "Manage culinary enhancement content.",
      badge: "#4",
      icon: Layers,
    },
    {
      key: "what-you-get",
      title: "What You Get",
      subtitle: "Manage wedding service benefits and inclusions.",
      badge: "#5",
      icon: Check,
    },
  ],

  packages: [
    {
      key: "packages-hero",
      title: "Packages Hero",
      subtitle: "Manage the wedding packages hero section.",
      badge: "Hero",
      icon: Sparkles,
    },
    {
      key: "wedding-packages",
      title: "Wedding Packages",
      subtitle: "Manage wedding packages overview content.",
      badge: "#1",
      icon: Package,
    },
    {
      key: "classic-package",
      title: "Classic Package",
      subtitle: "Manage classic wedding package content.",
      badge: "#2",
      icon: Heart,
    },
    {
      key: "premium-package",
      title: "Premium Package",
      subtitle: "Manage premium wedding package content.",
      badge: "#3",
      icon: BadgeCheck,
    },
    {
      key: "included-benefits",
      title: "Included Benefits",
      subtitle: "Manage benefits included in wedding packages.",
      badge: "#4",
      icon: Layers,
    },
    {
      key: "bar-packages",
      title: "Bar Packages",
      subtitle: "Manage wedding bar package content.",
      badge: "#5",
      icon: UtensilsCrossed,
    },
  ],

  "room-blocks": [
    {
      key: "room-blocks-hero",
      title: "Room Blocks Hero",
      subtitle: "Manage the room blocks hero section.",
      badge: "Hero",
      icon: Sparkles,
    },
    {
      key: "meeting-rooms",
      title: "Meeting Rooms in California",
      subtitle: "Manage meeting room content.",
      badge: "#1",
      icon: Building2,
    },
    {
      key: "accommodation-types",
      title: "Accommodation Types",
      subtitle: "Manage accommodation type content.",
      badge: "#2",
      icon: BedDouble,
    },
    {
      key: "restful-essentials",
      title: "Restful Essentials",
      subtitle: "Manage restful essentials content.",
      badge: "#3",
      icon: Home,
    },
  ],

  gallery: [
    {
      key: "gallery-hero",
      title: "Gallery Hero",
      subtitle: "Manage the wedding gallery hero section.",
      badge: "Hero",
      icon: Sparkles,
    },
    {
      key: "gallery-overview",
      title: "Gallery Overview",
      subtitle: "Manage gallery overview content.",
      badge: "#1",
      icon: Image,
    },
    {
      key: "wedding-images",
      title: "Wedding Images",
      subtitle: "Manage wedding gallery images.",
      badge: "#2",
      icon: Camera,
    },
  ],
};

const getErrorMessage = (data, fallback = "Something went wrong") => {
  if (!data) return fallback;

  if (data.errors) {
    return Object.values(data.errors).flat().join(", ");
  }

  return data.message || data.error || fallback;
};

const apiRequest = async (
  url,
  method = "GET",
  body = null,
  token = null,
  isFormData = false
) => {
  const options = {
    method,
    headers: {
      Accept: "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    if (isFormData) {
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_URL}${url}`, options);
  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("Backend returned non-JSON response:");
    console.error(text);

    throw new Error(
      `Server returned non-JSON response. Status: ${response.status}. Check Laravel log.`
    );
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, `Request failed with status ${response.status}`)
    );
  }

  return data;
};

const getImageUrl = (path) => {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/storage/")) {
    return `${APP_URL}${path}`;
  }

  if (path.startsWith("storage/")) {
    return `${APP_URL}/${path}`;
  }

  return `${STORAGE_URL}/${path}`;
};

function MainWeddingCard({ group, active, onClick }) {
  const Icon = group.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 ${
        active
          ? "border-orange-300 bg-white shadow-md ring-2 ring-orange-100"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            active ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500"
          }`}
        >
          <Icon size={23} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            active
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {group.badge}
        </span>
      </div>

      <h3 className="text-[16px] font-bold text-slate-900">{group.title}</h3>

      <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500">
        {group.subtitle}
      </p>

      <div
        className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${
          active ? "text-orange-600" : "text-orange-500"
        }`}
      >
        Open Section
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}

function SectionCard({ section, active, onClick }) {
  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border p-6 text-left shadow-sm transition-all duration-200 ${
        active
          ? "border-orange-300 bg-white shadow-md ring-2 ring-orange-100"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
      }`}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            active ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500"
          }`}
        >
          <Icon size={23} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            active
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {section.badge}
        </span>
      </div>

      <h3 className="text-lg font-bold leading-7 text-slate-900">
        {section.title}
      </h3>

      <p className="mt-2 min-h-[50px] text-sm leading-7 text-slate-500">
        {section.subtitle}
      </p>

      <div
        className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
          active ? "text-orange-600" : "text-orange-500"
        }`}
      >
        Manage Section
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}

function EmptyEditor({ section, onBack }) {
  const Icon = section.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to section cards
      </button>

      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <Icon size={30} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          This button is now clean and organized like the Hero Section cards.
          You can connect this card to its own form and API when the backend
          endpoint is ready.
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-5 text-sm leading-7 text-orange-700">
          Current card: <span className="font-bold">{section.title}</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSectionManager() {
  const [activeGroup, setActiveGroup] = useState("hero");
  const [activeSectionKey, setActiveSectionKey] = useState(null);
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [slides, setSlides] = useState([]);

  const selectedGroup =
    weddingGroups.find((group) => group.key === activeGroup) ||
    weddingGroups[0];

  const currentCards = weddingSectionCards[activeGroup] || [];

  const selectedSection =
    currentCards.find((section) => section.key === activeSectionKey) || null;

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("authToken");

    if (storedToken) {
      setToken(storedToken);
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchSlides = async () => {
    try {
      const result = await apiRequest("/wedding/slides", "GET");

      if (result.success && Array.isArray(result.data)) {
        return [...result.data].sort(
          (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
        );
      }

      return [];
    } catch (err) {
      console.error("Fetch slides error:", err);
      setError(err.message || "Failed to fetch wedding slides");
      return [];
    }
  };

  const loadSlides = async () => {
    setListLoading(true);

    const fetchedSlides = await fetchSlides();

    setSlides(fetchedSlides);
    setEditedSection({
      images: fetchedSlides.map((slide) => slide.image_url),
    });

    setListLoading(false);
  };

  useEffect(() => {
    if (token) {
      const loadData = async () => {
        setLoading(true);
        await loadSlides();
        setLoading(false);
      };

      loadData();
    }
  }, [token]);

  const updateField = (field, value) => {
    setEditedSection((previous) => ({
      ...(previous || {}),
      [field]: value,
    }));

    setSaved(false);
    setError(null);
  };

  const openGroup = (groupKey) => {
    setActiveGroup(groupKey);
    setActiveSectionKey(null);
    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSaved(false);
  };

  const openSection = (section) => {
    setActiveSectionKey(section.key);
    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSaved(false);
  };

  const backToSectionCards = () => {
    setActiveSectionKey(null);
    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSaved(false);
  };

  const addNewSlide = () => {
    setEditingSlideIndex(-1);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSaved(false);

    setEditedSection({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      sort_order: slides.length + 1,
    });
  };

  const editSlide = (index) => {
    setEditingSlideIndex(index);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSaved(false);
    setEditedSection({ ...slides[index] });
  };

  const cancelEditSlide = () => {
    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);

    setEditedSection({
      images: slides.map((slide) => slide.image_url),
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image: JPEG, PNG, WebP, or GIF");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setSaved(false);
  };

  const saveSlide = async () => {
    setUploading(true);
    setError(null);

    try {
      const isNew = editingSlideIndex === -1;

      if (!editedSection?.title?.trim()) {
        setError("Title is required");
        return;
      }

      if (isNew && !selectedFile) {
        setError("Image is required when creating a new slide");
        return;
      }

      const formData = new FormData();

      formData.append("title", editedSection.title || "");
      formData.append("subtitle", editedSection.subtitle || "");
      formData.append("description", editedSection.description || "");
      formData.append(
        "sort_order",
        editedSection.sort_order || slides.length + 1
      );

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      let result;

      if (isNew) {
        result = await apiRequest(
          "/admin/wedding/slides",
          "POST",
          formData,
          token,
          true
        );
      } else {
        const slideId = slides[editingSlideIndex]?.id;

        if (!slideId) {
          setError("Slide ID not found");
          return;
        }

        formData.append("_method", "PUT");

        result = await apiRequest(
          `/admin/wedding/slides/${slideId}`,
          "POST",
          formData,
          token,
          true
        );
      }

      if (result.success) {
        const freshSlides = await fetchSlides();

        setSlides(freshSlides);
        setEditingSlideIndex(null);
        setSelectedFile(null);
        setImagePreview(null);
        setEditedSection({
          images: freshSlides.map((slide) => slide.image_url),
        });
        setSaved(true);

        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(getErrorMessage(result, "Error saving slide"));
      }
    } catch (err) {
      console.error("Save slide error:", err);
      setError(err.message || "Something went wrong while saving slide");
    } finally {
      setUploading(false);
    }
  };

  const deleteSlide = async (index) => {
    const slide = slides[index];

    if (!slide?.id) {
      setError("Slide ID not found");
      return;
    }

    if (!confirm("Delete this slide?")) return;

    setError(null);

    try {
      const result = await apiRequest(
        `/admin/wedding/slides/${slide.id}`,
        "DELETE",
        null,
        token
      );

      if (result.success) {
        const freshSlides = await fetchSlides();

        setSlides(freshSlides);
        setEditedSection({
          images: freshSlides.map((slideItem) => slideItem.image_url),
        });
        setSaved(true);

        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(getErrorMessage(result, "Error deleting slide"));
      }
    } catch (err) {
      console.error("Delete slide error:", err);
      setError(err.message || "Something went wrong while deleting slide");
    }
  };

  const moveSlide = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= slides.length) return;

    setError(null);
    setListLoading(true);

    try {
      const newSlides = [...slides];

      const temp = newSlides[index];
      newSlides[index] = newSlides[newIndex];
      newSlides[newIndex] = temp;

      setSlides(newSlides);

      for (let i = 0; i < newSlides.length; i++) {
        await apiRequest(
          `/admin/wedding/slides/${newSlides[i].id}`,
          "PUT",
          {
            title: newSlides[i].title,
            subtitle: newSlides[i].subtitle,
            description: newSlides[i].description,
            sort_order: i + 1,
          },
          token
        );
      }

      const freshSlides = await fetchSlides();

      setSlides(freshSlides);
      setEditedSection({
        images: freshSlides.map((slide) => slide.image_url),
      });
      setSaved(true);

      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Move slide error:", err);
      setError(err.message || "Something went wrong while moving slide");

      const freshSlides = await fetchSlides();
      setSlides(freshSlides);
    } finally {
      setListLoading(false);
    }
  };

  const handleReset = () => {
    setEditedSection({
      images: slides.map((slide) => slide.image_url),
    });

    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setSaved(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

          <h2 className="text-xl font-semibold text-slate-900">
            Authentication Required
          </h2>

          <p className="mt-2 text-slate-500">
            Please login to manage wedding content.
          </p>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  if (editingSlideIndex !== null) {
    const isNew = editingSlideIndex === -1;
    const previewImage = imagePreview || getImageUrl(editedSection?.image_url);

    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            onClick={cancelEditSlide}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Wedding Hero Slides
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isNew ? "Add New Wedding Slide" : "Edit Wedding Slide"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload an image from your computer for the wedding hero slider.
              </p>
            </div>

            <button
              onClick={cancelEditSlide}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600">
            <Check size={16} />
            Saved successfully!
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                Title <span className="text-red-500">*</span>
              </label>

              <input
                value={editedSection?.title || ""}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="e.g. Exclusive Wedding Experience"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                Subtitle
              </label>

              <input
                value={editedSection?.subtitle || ""}
                onChange={(event) =>
                  updateField("subtitle", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="e.g. Luxury Wedding Venue"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                Description
              </label>

              <textarea
                value={editedSection?.description || ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                rows={4}
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                Image {isNew && <span className="text-red-500">*</span>}
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                <Upload size={16} />
                Select Image from Computer

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <p className="mt-2 text-xs text-emerald-600">
                  Selected: {selectedFile.name}
                </p>
              )}

              {!isNew && !selectedFile && (
                <p className="mt-2 text-xs text-slate-400">
                  Leave empty if you do not want to change the current image.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                Display Order
              </label>

              <input
                type="number"
                min="1"
                value={editedSection?.sort_order || slides.length + 1}
                onChange={(event) =>
                  updateField("sort_order", Number(event.target.value))
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Order number"
              />

              <p className="mt-1 text-xs text-slate-400">
                Lower number appears first.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Preview</h3>

            {previewImage ? (
              <img
                src={previewImage}
                className="mb-4 h-72 w-full rounded-xl object-cover"
                alt="Wedding slide preview"
              />
            ) : (
              <div className="mb-4 flex h-72 w-full items-center justify-center rounded-xl border border-dashed bg-slate-50 text-sm text-slate-400">
                No image selected
              </div>
            )}

            {editedSection?.title && (
              <h3 className="text-lg font-bold text-slate-900">
                {editedSection.title}
              </h3>
            )}

            {editedSection?.subtitle && (
              <p className="text-sm font-semibold text-orange-600">
                {editedSection.subtitle}
              </p>
            )}

            {editedSection?.description && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {editedSection.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            onClick={cancelEditSlide}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            onClick={saveSlide}
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save size={15} />
            )}

            {isNew ? "Create Slide" : "Update Slide"}
          </button>
        </div>
      </div>
    );
  }

  const isSlideManager =
    selectedSection?.type === "slides" && activeGroup === "hero";

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
              <selectedGroup.icon size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {selectedGroup.title}
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {selectedGroup.subtitle}
              </p>
            </div>
          </div>

          <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            {currentCards.length} Sections
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {weddingGroups.map((group) => (
            <MainWeddingCard
              key={group.key}
              group={group}
              active={activeGroup === group.key}
              onClick={() => openGroup(group.key)}
            />
          ))}
        </div>
      </div>

      {!selectedSection && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {currentCards.map((section) => (
              <SectionCard
                key={section.key}
                section={section}
                active={activeSectionKey === section.key}
                onClick={() => openSection(section)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedSection && !isSlideManager && (
        <EmptyEditor section={selectedSection} onBack={backToSectionCards} />
      )}

      {isSlideManager && (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={backToSectionCards}
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to section cards
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Wedding Hero Slides
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your wedding hero slider images and content.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  onClick={addNewSlide}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <Plus size={16} />
                  Add New Slide
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600">
              <Check size={16} />
              Saved successfully!
            </div>
          )}

          {listLoading && (
            <div className="flex items-center gap-2 rounded-xl bg-orange-50 p-4 text-sm text-orange-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              Loading slides...
            </div>
          )}

          <div className="space-y-3">
            {slides?.map((slide, index) => {
              const imageUrl = getImageUrl(slide.image_url);

              return (
                <div
                  key={slide.id || index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={slide.title || "Wedding slide"}
                      className="h-32 w-full rounded-xl object-cover sm:h-24 sm:w-28"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:h-24 sm:w-28">
                      No image
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900">
                      {slide.title || "Untitled slide"}
                    </h3>

                    {slide.subtitle && (
                      <p className="text-sm font-semibold text-orange-600">
                        {slide.subtitle}
                      </p>
                    )}

                    {slide.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                        {slide.description}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-400">
                      Order: {slide.sort_order || index + 1}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {index > 0 && (
                      <button
                        onClick={() => moveSlide(index, "up")}
                        className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
                        title="Move Up"
                        disabled={listLoading}
                      >
                        <ArrowUp size={16} />
                      </button>
                    )}

                    {index < slides.length - 1 && (
                      <button
                        onClick={() => moveSlide(index, "down")}
                        className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
                        title="Move Down"
                        disabled={listLoading}
                      >
                        <ArrowDown size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => editSlide(index)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSlide(index)}
                      className="flex items-center gap-1 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {(!slides || slides.length === 0) && !listLoading && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                No slides yet. Click{" "}
                <span className="font-semibold text-slate-800">
                  Add New Slide
                </span>{" "}
                to create one.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}