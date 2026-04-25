import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Eye,
  Image,
  Link2,
  Loader2,
  Pencil,
  Plus,
  Save,
  ToggleLeft,
  Trash2,
  Type,
  Upload,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const STORAGE_KEY = "luxury_homepage_sections";

const homeSections = [
  { id: 0, slug: "welcome-section", title: "Welcome Section" },
  { id: 1, slug: "home-section-one", title: "Home Section One" },
  { id: 2, slug: "home-section-two", title: "Home Section Two" },
  { id: 3, slug: "home-section-three", title: "Home Section Three" },
  { id: 4, slug: "home-section-four", title: "Home Section Four" },
  { id: 5, slug: "home-section-five", title: "Home Section Five" },
  { id: 6, slug: "home-section-six", title: "Home Section Six Gallery" },
  { id: 7, slug: "home-section-seven", title: "Home Section Seven Fitness" },
  { id: 8, slug: "home-section-eight", title: "Home Section Eight Parking" },
  { id: 9, slug: "home-section-nine", title: "Home Section Nine Restaurant Bar" },
  { id: 10, slug: "home-section-ten", title: "Home Section Ten Sauna" },
  { id: 11, slug: "home-section-eleven", title: "Home Section Eleven Pool" },
  { id: 12, slug: "home-section-twelve", title: "Home Section Twelve Family Kids" },
];

const emptyGenericForm = {
  id: null,
  title: "",
  subtitle: "",
  description: "",
  image: "",
  image_url: "",
  imageUrl: "",
  imageFile: null,
  imagePreview: "",
  buttonText: "",
  buttonLink: "",
  isActive: true,
};

const emptyWelcomeSlideForm = {
  id: null,
  title: "",
  subtitle: "",
  description: "",
  button_text: "",
  button_link: "",
  image: "",
  image_url: "",
  imageFile: null,
  imageFiles: [],
  imagePreview: "",
  imagePreviews: [],
  slideDrafts: [],
  sort_order: 0,
  is_active: true,
};

const emptySectionThreeForm = {
  id: null,
  title_one: "",
  title_two: "",
  description: "",
  image: "",
  image_url: "",
  imageFile: null,
  imageFiles: [],
  imagePreview: "",
  imagePreviews: [],
  slideDrafts: [],
};

const emptySectionFourForm = {
  id: null,
  eyebrow: "",
  title_line_one: "",
  title_line_two: "",
  description: "",
  image: "",
  imageFile: null,
  imagePreview: "",
  sort_order: 0,
  is_active: true,
};

const emptySectionFiveForm = {
  id: null,
  eyebrow: "",
  title: "",
  description: "",
  button_text: "",
  button_link: "",
  image: "",
  imageFile: null,
  imagePreview: "",
  is_active: true,
};

const emptySectionSixForm = {
  id: null,
  image: "",
  image_url: "",
  imageFile: null,
  imageFiles: [],
  imagePreview: "",
  imagePreviews: [],
  imageDrafts: [],
  display_order: "",
  is_active: true,
};

const emptyUrlContentForm = {
  id: null,
  title: "",
  subtitle: "",
  description: "",
  image: "",
  image_url: "",
  imageFile: null,
  imagePreview: "",
};

const emptySectionTenImageForm = {
  id: null,
  title: "",
  subtitle: "",
  description: "",
  image: "",
  image_url: "",
  imageFile: null,
  imageFiles: [],
  imagePreview: "",
  imagePreviews: [],
  slideDrafts: [],
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

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("auth_token");
}

function buildImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("blob:")) {
    return path;
  }

  if (path.startsWith("/storage/")) {
    return `${API_ROOT_URL}${path}`;
  }

  if (path.startsWith("storage/")) {
    return `${API_ROOT_URL}/${path}`;
  }

  return `${API_ROOT_URL}/storage/${path}`;
}

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function getItems(data) {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  if (data?.data) return [data.data];
  return [];
}

function getErrorMessage(data, fields, fallback) {
  for (const field of fields) {
    const message = data?.errors?.[field]?.[0];

    if (message) {
      return message;
    }
  }

  return data?.message || fallback;
}

function getImageValue(item) {
  return item?.image || item?.image_url || item?.image_path || "";
}

function formatHomeSectionOne(item) {
  if (!item) return null;

  const imageValue = getImageValue(item);

  return {
    id: item.id || null,
    title: item.title || "",
    subtitle: item.subtitle || "",
    description: item.description || "",
    image: imageValue,
    image_url: imageValue,
    imageUrl: buildImageUrl(imageValue),
    imageFile: null,
    imagePreview: buildImageUrl(imageValue),
    isActive: toBoolean(item.is_active ?? item.isActive ?? true),
    updatedAt: item.updated_at || item.updatedAt || "",
  };
}

function formatSectionThreeSlide(item) {
  if (!item) return null;

  const imageValue = getImageValue(item);

  return {
    id: item.id || null,
    title_one: item.title_one || "",
    title_two: item.title_two || "",
    description: item.description || "",
    image: imageValue,
    image_url: imageValue,
    imageFile: null,
    imagePreview: buildImageUrl(imageValue),
    updatedAt: item.updated_at || item.updatedAt || "",
  };
}

function formatSectionTenImage(item) {
  if (!item) return null;

  const imageValue = getImageValue(item);

  return {
    id: item.id || null,
    title: item.title || "",
    subtitle: item.subtitle || "",
    description: item.description || "",
    image: imageValue,
    image_url: imageValue,
    imageFile: null,
    imagePreview: buildImageUrl(imageValue),
    updatedAt: item.updated_at || item.updatedAt || "",
  };
}

function formatGenericStorageSection(item) {
  if (!item) return null;

  return {
    ...emptyGenericForm,
    ...item,
    imagePreview: item.imagePreview || item.imageUrl || "",
    isActive: item.isActive ?? true,
  };
}

function getPublicPath(sectionName) {
  const paths = {
    fitness: "section7/fitness",
    parking: "section8/parking",
    "restaurant-bar": "section9/restaurant-bar",
    sauna: "section10/sauna",
    pool: "section11/pool",
    "family-kids": "section12/family-kids",
  };

  return paths[sectionName];
}

function getAdminPath(sectionName) {
  const paths = {
    fitness: "admin/section7/fitness",
    parking: "admin/section8/parking",
    "restaurant-bar": "admin/section9/restaurant-bar",
    sauna: "admin/section10/sauna",
    pool: "admin/section11/pool",
    "family-kids": "admin/section12/family-kids",
  };

  return paths[sectionName];
}

function getSectionTitle(sectionName) {
  const titles = {
    fitness: "Section 7 Fitness",
    parking: "Section 8 Parking",
    "restaurant-bar": "Section 9 Restaurant Bar",
    sauna: "Section 10 Sauna",
    pool: "Section 11 Pool",
    "family-kids": "Section 12 Family Kids",
  };

  return titles[sectionName] || "Section";
}

export default function PageEdit() {
  const { sectionSlug } = useParams();
  const navigate = useNavigate();

  const currentSection = useMemo(() => {
    return homeSections.find((section) => section.slug === sectionSlug);
  }, [sectionSlug]);

  const isWelcomeSection = sectionSlug === "welcome-section";
  const isHomeSectionOne = sectionSlug === "home-section-one";
  const isHomeSectionTwo = sectionSlug === "home-section-two";
  const isSectionThree = sectionSlug === "home-section-three";
  const isSectionFour = sectionSlug === "home-section-four";
  const isSectionFive = sectionSlug === "home-section-five";
  const isSectionSix = sectionSlug === "home-section-six";
  const isSectionSeven = sectionSlug === "home-section-seven";
  const isSectionEight = sectionSlug === "home-section-eight";
  const isSectionNine = sectionSlug === "home-section-nine";
  const isSectionTen = sectionSlug === "home-section-ten";
  const isSectionEleven = sectionSlug === "home-section-eleven";
  const isSectionTwelve = sectionSlug === "home-section-twelve";

  const isLaravelApiSection =
    isWelcomeSection ||
    isHomeSectionOne ||
    isSectionThree ||
    isSectionFour ||
    isSectionFive ||
    isSectionSix ||
    isSectionSeven ||
    isSectionEight ||
    isSectionNine ||
    isSectionTen ||
    isSectionEleven ||
    isSectionTwelve;

  const [form, setForm] = useState(emptyGenericForm);

  const [welcomeSlideForm, setWelcomeSlideForm] = useState(
    emptyWelcomeSlideForm
  );
  const [welcomeSlides, setWelcomeSlides] = useState([]);

  const [sectionThreeForm, setSectionThreeForm] = useState(
    emptySectionThreeForm
  );
  const [sectionThreeSlides, setSectionThreeSlides] = useState([]);
  const [sectionFourForm, setSectionFourForm] = useState(emptySectionFourForm);
  const [sectionFiveForm, setSectionFiveForm] = useState(emptySectionFiveForm);

  const [sectionSixForm, setSectionSixForm] = useState(emptySectionSixForm);
  const [sectionSixImages, setSectionSixImages] = useState([]);

  const [sectionSevenForm, setSectionSevenForm] =
    useState(emptyUrlContentForm);
  const [sectionEightForm, setSectionEightForm] =
    useState(emptyUrlContentForm);
  const [sectionNineForm, setSectionNineForm] = useState(emptyUrlContentForm);
  const [sectionTenForm, setSectionTenForm] = useState(emptySectionTenImageForm);
  const [sectionTenImages, setSectionTenImages] = useState([]);
  const [sectionElevenForm, setSectionElevenForm] =
    useState(emptyUrlContentForm);
  const [sectionTwelveForm, setSectionTwelveForm] =
    useState(emptyUrlContentForm);

  const [savedData, setSavedData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [savedMessage, setSavedMessage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentSection) return;

    setError("");
    setSavedMessage(false);

    if (isWelcomeSection) {
      fetchWelcomeSlides();
      return;
    }

    if (isHomeSectionOne) {
      fetchHomeSectionOne();
      return;
    }

    if (isSectionThree) {
      fetchSectionThree();
      return;
    }

    if (isSectionFour) {
      fetchSectionFour();
      return;
    }

    if (isSectionFive) {
      fetchSectionFive();
      return;
    }

    if (isSectionSix) {
      fetchSectionSix();
      return;
    }

    if (isSectionSeven) {
      fetchUrlContentSection("fitness");
      return;
    }

    if (isSectionEight) {
      fetchUrlContentSection("parking");
      return;
    }

    if (isSectionNine) {
      fetchUrlContentSection("restaurant-bar");
      return;
    }

    if (isSectionTen) {
      fetchUrlContentSection("sauna");
      return;
    }

    if (isSectionEleven) {
      fetchUrlContentSection("pool");
      return;
    }

    if (isSectionTwelve) {
      fetchUrlContentSection("family-kids");
      return;
    }

    const allSections = loadSections();
    const existingData = allSections[currentSection.slug] || null;

    if (existingData) {
      const formattedGenericData = formatGenericStorageSection(existingData);

      setForm(emptyGenericForm);
      setSavedData(formattedGenericData);
    } else {
      setForm(emptyGenericForm);
      setSavedData(null);
    }
  }, [
    currentSection,
    isWelcomeSection,
    isHomeSectionOne,
    isHomeSectionTwo,
    isSectionThree,
    isSectionFour,
    isSectionFive,
    isSectionSix,
    isSectionSeven,
    isSectionEight,
    isSectionNine,
    isSectionTen,
    isSectionEleven,
    isSectionTwelve,
  ]);

  const setUrlContentFormBySection = (sectionName, data) => {
    if (sectionName === "fitness") setSectionSevenForm(data);
    if (sectionName === "parking") setSectionEightForm(data);
    if (sectionName === "restaurant-bar") setSectionNineForm(data);
    if (sectionName === "sauna") setSectionTenForm(data);
    if (sectionName === "pool") setSectionElevenForm(data);
    if (sectionName === "family-kids") setSectionTwelveForm(data);
  };

  const getUrlContentFormBySection = (sectionName) => {
    if (sectionName === "fitness") return sectionSevenForm;
    if (sectionName === "parking") return sectionEightForm;
    if (sectionName === "restaurant-bar") return sectionNineForm;
    if (sectionName === "sauna") return sectionTenForm;
    if (sectionName === "pool") return sectionElevenForm;
    if (sectionName === "family-kids") return sectionTwelveForm;

    return emptyUrlContentForm;
  };

  const showSavedSuccess = () => {
    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  const fetchHomeSectionOne = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/home-section-one`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Home Section One.");
      }

      const item = data?.data || null;
      const formatted = formatHomeSectionOne(item);

      setSavedData(formatted);
      setForm(emptyGenericForm);
    } catch (err) {
      setSavedData(null);
      setForm(emptyGenericForm);
      setError(err.message || "Something went wrong while loading Home Section One.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWelcomeSlides = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/welcome-slides`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Welcome Slides.");
      }

      const slides = getItems(data).map((item) => {
        const imageValue = getImageValue(item);

        return {
          ...item,
          image: imageValue,
          image_url: imageValue,
          imagePreview: buildImageUrl(imageValue),
          is_active: toBoolean(item.is_active),
        };
      });

      setWelcomeSlides(slides);
      setSavedData(slides);
      setWelcomeSlideForm(emptyWelcomeSlideForm);
    } catch (err) {
      setWelcomeSlides([]);
      setSavedData([]);
      setError(
        err.message || "Something went wrong while loading welcome slides."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionThree = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/home-section-threes`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Home Section Three.");
      }

      const slides = getItems(data)
        .map(formatSectionThreeSlide)
        .filter(Boolean);

      setSectionThreeSlides(slides);
      setSavedData(slides);
      setSectionThreeForm(emptySectionThreeForm);
    } catch (err) {
      setSectionThreeSlides([]);
      setSavedData([]);
      setSectionThreeForm(emptySectionThreeForm);
      setError(err.message || "Something went wrong while loading data.");
    } finally {
      setLoading(false);
    }
  };
  const fetchSectionFour = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/home-section-fours`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Home Section Four.");
      }

      const item = getItems(data)[0] || null;

      if (!item) {
        setSectionFourForm(emptySectionFourForm);
        setSavedData(null);
        return;
      }

      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        eyebrow: item.eyebrow || "",
        title_line_one: item.title_line_one || "",
        title_line_two: item.title_line_two || "",
        description: item.description || "",
        image: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
        sort_order: item.sort_order ?? 0,
        is_active: toBoolean(item.is_active),
      };

      setSectionFourForm(emptySectionFourForm);
      setSavedData(formatted);
    } catch (err) {
      setError(err.message || "Something went wrong while loading data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionFive = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/home-section-fives`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Home Section Five.");
      }

      const item = getItems(data)[0] || null;

      if (!item) {
        setSectionFiveForm(emptySectionFiveForm);
        setSavedData(null);
        return;
      }

      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        eyebrow: item.eyebrow || "",
        title: item.title || "",
        description: item.description || "",
        button_text: item.button_text || "",
        button_link: item.button_link || "",
        image: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
        is_active: toBoolean(item.is_active),
      };

      setSectionFiveForm(emptySectionFiveForm);
      setSavedData(formatted);
    } catch (err) {
      setError(err.message || "Something went wrong while loading data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionSix = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/section6/gallery`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Section 6 Gallery.");
      }

      const images = getItems(data).map((item) => {
        const imageValue = getImageValue(item);

        return {
          ...item,
          image: imageValue,
          image_url: imageValue,
          imagePreview: buildImageUrl(imageValue),
        };
      });

      setSectionSixImages(images);
      setSavedData(images);
      setSectionSixForm(emptySectionSixForm);
    } catch (err) {
      setSectionSixImages([]);
      setSavedData([]);
      setError(err.message || "Something went wrong while loading gallery.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUrlContentSection = async (sectionName) => {
    try {
      setLoading(true);
      setError("");

      const publicPath = getPublicPath(sectionName);
      const response = await fetch(`${API_BASE_URL}/${publicPath}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        if (sectionName === "sauna") {
          setSectionTenForm(emptySectionTenImageForm);
          setSectionTenImages([]);
        } else {
          setUrlContentFormBySection(sectionName, emptyUrlContentForm);
        }
        setSavedData(null);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || `Failed to load ${getSectionTitle(sectionName)}.`
        );
      }

      if (sectionName === "sauna") {
        const images = getItems(data).map(formatSectionTenImage).filter(Boolean);
        setSectionTenImages(images);
        setSectionTenForm(emptySectionTenImageForm);
        setSavedData(images);
        return;
      }

      const item = data?.data || null;

      if (!item) {
        setUrlContentFormBySection(sectionName, emptyUrlContentForm);
        setSavedData(null);
        return;
      }

      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        title: item.title || "",
        subtitle: item.subtitle || "",
        description: item.description || "",
        image: imageValue,
        image_url: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
        updatedAt: item.updated_at || item.updatedAt || "",
      };

      setUrlContentFormBySection(sectionName, emptyUrlContentForm);
      setSavedData(formatted);
    } catch (err) {
      if (sectionName === "sauna") {
        setSectionTenImages([]);
        setSectionTenForm(emptySectionTenImageForm);
      }
      setError(
        err.message ||
          `Something went wrong while loading ${getSectionTitle(sectionName)}.`
      );
    } finally {
      setLoading(false);
    }
  };

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

  const updateGenericField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSavedMessage(false);
  };

  const updateWelcomeSlideField = (field, value) => {
    setWelcomeSlideForm((prev) => ({ ...prev, [field]: value }));
    setSavedMessage(false);
  };

  const updateWelcomeSlideDraft = (index, field, value) => {
    setWelcomeSlideForm((prev) => {
      const slideDrafts = [...(prev.slideDrafts || [])];

      slideDrafts[index] = {
        ...slideDrafts[index],
        [field]: value,
      };

      return {
        ...prev,
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };

  const removeWelcomeSlideDraft = (index) => {
    setWelcomeSlideForm((prev) => {
      const slideDrafts = (prev.slideDrafts || []).filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...prev,
        imageFiles: slideDrafts.map((draft) => draft.file),
        imageFile: slideDrafts[0]?.file || null,
        imagePreview: slideDrafts[0]?.preview || "",
        imagePreviews: slideDrafts.map((draft) => draft.preview),
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };

  const updateSectionThreeField = (field, value) => {
    setSectionThreeForm((prev) => ({ ...prev, [field]: value }));
    setSavedMessage(false);
  };

  const updateSectionThreeDraft = (index, field, value) => {
    setSectionThreeForm((prev) => {
      const slideDrafts = [...(prev.slideDrafts || [])];

      slideDrafts[index] = {
        ...slideDrafts[index],
        [field]: value,
      };

      return {
        ...prev,
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };

  const removeSectionThreeDraft = (index) => {
    setSectionThreeForm((prev) => {
      const slideDrafts = (prev.slideDrafts || []).filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...prev,
        imageFiles: slideDrafts.map((draft) => draft.file),
        imageFile: slideDrafts[0]?.file || null,
        imagePreview: slideDrafts[0]?.preview || "",
        imagePreviews: slideDrafts.map((draft) => draft.preview),
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };

  const updateSectionFourField = (field, value) => {
    setSectionFourForm((prev) => ({ ...prev, [field]: value }));
    setSavedMessage(false);
  };

  const updateSectionFiveField = (field, value) => {
    setSectionFiveForm((prev) => ({ ...prev, [field]: value }));
    setSavedMessage(false);
  };

  const updateSectionSixField = (field, value) => {
    setSectionSixForm((prev) => ({ ...prev, [field]: value }));
    setSavedMessage(false);
  };

  const removeSectionSixDraft = (index) => {
    setSectionSixForm((prev) => {
      const imageDrafts = (prev.imageDrafts || []).filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...prev,
        imageFiles: imageDrafts.map((draft) => draft.file),
        imageFile: imageDrafts[0]?.file || null,
        imagePreview: imageDrafts[0]?.preview || "",
        imagePreviews: imageDrafts.map((draft) => draft.preview),
        imageDrafts,
      };
    });

    setSavedMessage(false);
  };

  const updateSectionTenDraft = (index, field, value) => {
    setSectionTenForm((prev) => {
      const slideDrafts = [...(prev.slideDrafts || [])];

      slideDrafts[index] = {
        ...slideDrafts[index],
        [field]: value,
      };

      return {
        ...prev,
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };

  const removeSectionTenDraft = (index) => {
    setSectionTenForm((prev) => {
      const slideDrafts = (prev.slideDrafts || []).filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...prev,
        imageFiles: slideDrafts.map((draft) => draft.file),
        imageFile: slideDrafts[0]?.file || null,
        imagePreview: slideDrafts[0]?.preview || "",
        imagePreviews: slideDrafts.map((draft) => draft.preview),
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };

  const updateUrlContentField = (sectionName, field, value) => {
    const currentForm = getUrlContentFormBySection(sectionName);

    setUrlContentFormBySection(sectionName, {
      ...currentForm,
      [field]: value,
    });

    setSavedMessage(false);
  };

  const handleWelcomeSlideImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setWelcomeSlideForm((prev) => {
      const slideDrafts = files.map((file, index) => {
        const preview = URL.createObjectURL(file);

        return {
          file,
          preview,
          title: "",
          subtitle: "",
          description: "",
          button_text: "",
          button_link: "",
          sort_order: index + 1,
          is_active: true,
        };
      });

      return {
        ...prev,
        imageFile: files[0],
        imageFiles: files,
        imagePreview: slideDrafts[0]?.preview || "",
        imagePreviews: slideDrafts.map((draft) => draft.preview),
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };

  const handleSectionThreeImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (sectionThreeForm.id) {
      const file = files[0];

      setSectionThreeForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));

      setSavedMessage(false);
      return;
    }

    setSectionThreeForm((prev) => {
      const slideDrafts = files.map((file) => {
        const preview = URL.createObjectURL(file);

        return {
          file,
          preview,
          title_one: "",
          title_two: "",
          description: "",
        };
      });

      return {
        ...prev,
        imageFile: files[0],
        imageFiles: files,
        imagePreview: slideDrafts[0]?.preview || "",
        imagePreviews: slideDrafts.map((draft) => draft.preview),
        slideDrafts,
      };
    });

    setSavedMessage(false);
  };
  const handleSectionFourImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSectionFourForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));

    setSavedMessage(false);
  };

  const handleSectionFiveImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSectionFiveForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));

    setSavedMessage(false);
  };

  const handleSectionSixImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (sectionSixForm.id) {
      const file = files[0];

      setSectionSixForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));

      setSavedMessage(false);
      return;
    }

    setSectionSixForm((prev) => {
      const imageDrafts = files.map((file) => {
        const preview = URL.createObjectURL(file);

        return {
          file,
          preview,
        };
      });

      return {
        ...prev,
        imageFile: files[0],
        imageFiles: files,
        imagePreview: imageDrafts[0]?.preview || "",
        imagePreviews: imageDrafts.map((draft) => draft.preview),
        imageDrafts,
      };
    });

    setSavedMessage(false);
  };

  const handleUrlContentImageChange = (sectionName, e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (sectionName === "sauna") {
      if (sectionTenForm.id) {
        const file = files[0];

        setSectionTenForm((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: URL.createObjectURL(file),
        }));

        setSavedMessage(false);
        return;
      }

      setSectionTenForm((prev) => {
        const slideDrafts = files.map((file) => {
          const preview = URL.createObjectURL(file);

          return {
            file,
            preview,
            title: "",
            subtitle: "",
            description: "",
          };
        });

        return {
          ...prev,
          imageFile: files[0],
          imageFiles: files,
          imagePreview: slideDrafts[0]?.preview || "",
          imagePreviews: slideDrafts.map((draft) => draft.preview),
          slideDrafts,
        };
      });

      setSavedMessage(false);
      return;
    }

    const file = files[0];
    const currentForm = getUrlContentFormBySection(sectionName);

    setUrlContentFormBySection(sectionName, {
      ...currentForm,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });

    setSavedMessage(false);
  };

  const handleGenericImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const preview = reader.result || "";

      setForm((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: preview,
        imagePreview: preview,
      }));

      setSavedMessage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleHomeSectionOneSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const isUpdate = Boolean(form.id);
      const url = isUpdate
        ? `${API_BASE_URL}/admin/home-section-one/${form.id}`
        : `${API_BASE_URL}/admin/home-section-one`;

      const formData = new FormData();

      formData.append("title", form.title || "");
      formData.append("subtitle", form.subtitle || "");
      formData.append("description", form.description || "");
      formData.append("is_active", form.isActive ? "1" : "0");

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (isUpdate) {
        formData.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          ["title", "subtitle", "description", "image", "is_active"],
          "Failed to save Home Section One."
        );

        throw new Error(message);
      }

      const formatted = formatHomeSectionOne(data?.data || data);

      setSavedData(formatted);
      setForm(emptyGenericForm);
      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while saving Home Section One.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenericSave = () => {
    setSaving(true);

    const allSections = loadSections();
    const { imageFile, ...safeForm } = form;

    const genericPayload = isHomeSectionTwo
      ? {
          id: safeForm.id || null,
          title: safeForm.title || "",
          subtitle: safeForm.subtitle || "",
          description: safeForm.description || "",
          image: safeForm.image || "",
          image_url: safeForm.image_url || "",
          imageUrl: safeForm.imageUrl || safeForm.imagePreview || "",
          imagePreview: safeForm.imagePreview || safeForm.imageUrl || "",
          isActive: safeForm.isActive,
        }
      : safeForm;

    const updatedSection = {
      ...genericPayload,
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
    setForm(emptyGenericForm);
    setSaving(false);
    showSavedSuccess();
  };

  const saveSingleWelcomeSlide = async ({ file, isUpdate, draft = null }) => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in. Please login again.");
    }

    const activeSlide = draft || welcomeSlideForm;

    const url = isUpdate
      ? `${API_BASE_URL}/admin/welcome-slides/${welcomeSlideForm.id}`
      : `${API_BASE_URL}/admin/welcome-slides`;

    const formData = new FormData();

    formData.append("title", activeSlide.title || "");
    formData.append("subtitle", activeSlide.subtitle || "");

    if (activeSlide.description) {
      formData.append("description", activeSlide.description);
    }

    if (activeSlide.button_text) {
      formData.append("button_text", activeSlide.button_text);
    }

    if (activeSlide.button_link) {
      formData.append("button_link", activeSlide.button_link);
    }

    formData.append("sort_order", activeSlide.sort_order || 0);
    formData.append("is_active", activeSlide.is_active ? "1" : "0");

    if (file) {
      formData.append("image", file);
    }

    if (isUpdate) {
      formData.append("_method", "PUT");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = getErrorMessage(
        data,
        [
          "title",
          "subtitle",
          "description",
          "button_text",
          "button_link",
          "image",
          "sort_order",
          "is_active",
        ],
        "Failed to save Welcome Slide."
      );

      throw new Error(message);
    }

    return data;
  };

  const handleWelcomeSlideSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const isUpdate = Boolean(welcomeSlideForm.id);
      const slideDrafts = welcomeSlideForm.slideDrafts || [];

      if (isUpdate) {
        if (!welcomeSlideForm.title.trim()) {
          throw new Error("Please enter the slide title.");
        }

        await saveSingleWelcomeSlide({
          file: welcomeSlideForm.imageFile,
          isUpdate: true,
        });
      } else {
        if (!slideDrafts.length) {
          throw new Error("Please upload at least one welcome image first.");
        }

        const missingTitleIndex = slideDrafts.findIndex(
          (draft) => !draft.title?.trim()
        );

        if (missingTitleIndex !== -1) {
          throw new Error(
            `Please enter a title for welcome image #${missingTitleIndex + 1}.`
          );
        }

        for (const draft of slideDrafts) {
          await saveSingleWelcomeSlide({
            file: draft.file,
            isUpdate: false,
            draft,
          });
        }
      }

      setWelcomeSlideForm(emptyWelcomeSlideForm);
      await fetchWelcomeSlides();

      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while saving welcome slide.");
    } finally {
      setSaving(false);
    }
  };

  const saveSingleSectionThreeSlide = async ({ file, isUpdate, draft = null }) => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in. Please login again.");
    }

    const activeSlide = draft || sectionThreeForm;
    const url = isUpdate
      ? `${API_BASE_URL}/home-section-threes/${sectionThreeForm.id}`
      : `${API_BASE_URL}/home-section-threes`;

    const formData = new FormData();

    formData.append("title_one", activeSlide.title_one || "");
    formData.append("title_two", activeSlide.title_two || "");
    formData.append("description", activeSlide.description || "");

    if (file) {
      formData.append("image", file);
    }

    if (isUpdate) {
      formData.append("_method", "PUT");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = getErrorMessage(
        data,
        ["title_one", "title_two", "description", "image"],
        "Failed to save Home Section Three slide."
      );

      throw new Error(message);
    }

    return data;
  };

  const handleSectionThreeSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const isUpdate = Boolean(sectionThreeForm.id);
      const slideDrafts = sectionThreeForm.slideDrafts || [];

      if (isUpdate) {
        if (!sectionThreeForm.title_one.trim()) {
          throw new Error("Please enter the slide title line one.");
        }

        await saveSingleSectionThreeSlide({
          file: sectionThreeForm.imageFile,
          isUpdate: true,
        });
      } else {
        if (!slideDrafts.length) {
          throw new Error("Please upload at least one Home Section Three image first.");
        }

        const missingTitleIndex = slideDrafts.findIndex(
          (draft) => !draft.title_one?.trim()
        );

        if (missingTitleIndex !== -1) {
          throw new Error(
            `Please enter title line one for section image #${missingTitleIndex + 1}.`
          );
        }

        for (const draft of slideDrafts) {
          await saveSingleSectionThreeSlide({
            file: draft.file,
            isUpdate: false,
            draft,
          });
        }
      }

      setSectionThreeForm(emptySectionThreeForm);
      await fetchSectionThree();
      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while saving Home Section Three.");
    } finally {
      setSaving(false);
    }
  };
  const handleSectionFourSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const formData = new FormData();

      if (sectionFourForm.eyebrow) {
        formData.append("eyebrow", sectionFourForm.eyebrow);
      }

      formData.append("title_line_one", sectionFourForm.title_line_one);
      formData.append("title_line_two", sectionFourForm.title_line_two);

      if (sectionFourForm.description) {
        formData.append("description", sectionFourForm.description);
      }

      formData.append("sort_order", sectionFourForm.sort_order || 0);
      formData.append("is_active", sectionFourForm.is_active ? "1" : "0");

      if (sectionFourForm.imageFile) {
        formData.append("image", sectionFourForm.imageFile);
      }

      const isUpdate = Boolean(sectionFourForm.id);

      const url = isUpdate
        ? `${API_BASE_URL}/home-section-fours/${sectionFourForm.id}`
        : `${API_BASE_URL}/home-section-fours`;

      if (isUpdate) {
        formData.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          [
            "eyebrow",
            "title_line_one",
            "title_line_two",
            "description",
            "image",
            "sort_order",
            "is_active",
          ],
          "Failed to save Home Section Four."
        );

        throw new Error(message);
      }

      const item = data?.data || data;
      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        eyebrow: item.eyebrow || "",
        title_line_one: item.title_line_one || "",
        title_line_two: item.title_line_two || "",
        description: item.description || "",
        image: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
        sort_order: item.sort_order ?? 0,
        is_active: toBoolean(item.is_active),
        updatedAt: new Date().toISOString(),
      };

      setSectionFourForm(emptySectionFourForm);
      setSavedData(formatted);
      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleSectionFiveSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const formData = new FormData();

      if (sectionFiveForm.eyebrow) {
        formData.append("eyebrow", sectionFiveForm.eyebrow);
      }

      formData.append("title", sectionFiveForm.title);

      if (sectionFiveForm.description) {
        formData.append("description", sectionFiveForm.description);
      }

      if (sectionFiveForm.button_text) {
        formData.append("button_text", sectionFiveForm.button_text);
      }

      if (sectionFiveForm.button_link) {
        formData.append("button_link", sectionFiveForm.button_link);
      }

      formData.append("is_active", sectionFiveForm.is_active ? "1" : "0");

      if (sectionFiveForm.imageFile) {
        formData.append("image", sectionFiveForm.imageFile);
      }

      const isUpdate = Boolean(sectionFiveForm.id);

      const url = isUpdate
        ? `${API_BASE_URL}/home-section-fives/${sectionFiveForm.id}`
        : `${API_BASE_URL}/home-section-fives`;

      if (isUpdate) {
        formData.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          [
            "eyebrow",
            "title",
            "description",
            "button_text",
            "button_link",
            "image",
            "is_active",
          ],
          "Failed to save Home Section Five."
        );

        throw new Error(message);
      }

      const item = data?.data || data;
      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        eyebrow: item.eyebrow || "",
        title: item.title || "",
        description: item.description || "",
        button_text: item.button_text || "",
        button_link: item.button_link || "",
        image: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
        is_active: toBoolean(item.is_active),
        updatedAt: new Date().toISOString(),
      };

      setSectionFiveForm(emptySectionFiveForm);
      setSavedData(formatted);
      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const saveSingleSectionSixImage = async ({ file, isUpdate }) => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in. Please login again.");
    }

    const url = isUpdate
      ? `${API_BASE_URL}/admin/section6/gallery/${sectionSixForm.id}`
      : `${API_BASE_URL}/admin/section6/gallery`;

    const formData = new FormData();

    if (file) {
      formData.append("image", file);
    }

    if (sectionSixForm.display_order !== "") {
      formData.append("display_order", sectionSixForm.display_order);
    }

    formData.append("is_active", sectionSixForm.is_active ? "1" : "0");

    if (isUpdate) {
      formData.append("_method", "PUT");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = getErrorMessage(
        data,
        ["image", "display_order", "is_active"],
        "Failed to save Section 6 Gallery image."
      );

      throw new Error(message);
    }

    return data;
  };

  const handleSectionSixSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const isUpdate = Boolean(sectionSixForm.id);
      const imageDrafts = sectionSixForm.imageDrafts || [];

      if (isUpdate) {
        if (!sectionSixForm.imageFile && !sectionSixForm.id) {
          throw new Error("Please upload a gallery image first.");
        }

        await saveSingleSectionSixImage({
          file: sectionSixForm.imageFile,
          isUpdate: true,
        });
      } else {
        if (!imageDrafts.length) {
          throw new Error("Please select one or more gallery images first.");
        }

        for (const draft of imageDrafts) {
          await saveSingleSectionSixImage({
            file: draft.file,
            isUpdate: false,
          });
        }
      }

      setSectionSixForm(emptySectionSixForm);
      await fetchSectionSix();
      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while saving gallery.");
    } finally {
      setSaving(false);
    }
  };

  const saveSingleUrlContentImage = async ({ sectionName, file, isUpdate, draft = null }) => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in. Please login again.");
    }

    const adminPath = getAdminPath(sectionName);
    const activeForm = draft || getUrlContentFormBySection(sectionName);
    const currentId = activeForm.id;
    const url = isUpdate
      ? `${API_BASE_URL}/${adminPath}/${currentId}`
      : `${API_BASE_URL}/${adminPath}`;

    const formData = new FormData();

    formData.append("title", activeForm.title || "");
    formData.append("subtitle", activeForm.subtitle || "");
    formData.append("description", activeForm.description || "");

    if (file) {
      formData.append("image", file);
    }

    if (isUpdate) {
      formData.append("_method", "PUT");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = getErrorMessage(
        data,
        ["title", "subtitle", "description", "image"],
        `Failed to save ${getSectionTitle(sectionName)}.`
      );

      throw new Error(message);
    }

    return data;
  };

  const handleUrlContentSave = async (sectionName) => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      if (sectionName === "sauna") {
        const isUpdate = Boolean(sectionTenForm.id);
        const slideDrafts = sectionTenForm.slideDrafts || [];

        if (isUpdate) {
          if (!sectionTenForm.title.trim()) {
            throw new Error("Please enter the sauna image title.");
          }

          await saveSingleUrlContentImage({
            sectionName,
            file: sectionTenForm.imageFile,
            isUpdate: true,
          });
        } else {
          if (!slideDrafts.length) {
            throw new Error("Please upload at least one sauna image first.");
          }

          const missingTitleIndex = slideDrafts.findIndex(
            (draft) => !draft.title?.trim()
          );

          if (missingTitleIndex !== -1) {
            throw new Error(
              `Please enter a title for sauna image #${missingTitleIndex + 1}.`
            );
          }

          for (const draft of slideDrafts) {
            await saveSingleUrlContentImage({
              sectionName,
              file: draft.file,
              isUpdate: false,
              draft,
            });
          }
        }

        setSectionTenForm(emptySectionTenImageForm);
        await fetchUrlContentSection("sauna");
        showSavedSuccess();
        return;
      }

      const activeForm = getUrlContentFormBySection(sectionName);
      const isUpdate = Boolean(activeForm.id);

      if (!activeForm.imageFile && !isUpdate) {
        throw new Error("Please upload an image first.");
      }

      const data = await saveSingleUrlContentImage({
        sectionName,
        file: activeForm.imageFile,
        isUpdate,
      });

      const item = data?.data || data;
      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        title: item.title || "",
        subtitle: item.subtitle || "",
        description: item.description || "",
        image: imageValue,
        image_url: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
        updatedAt: new Date().toISOString(),
      };

      setUrlContentFormBySection(sectionName, emptyUrlContentForm);
      setSavedData(formatted);
      showSavedSuccess();
    } catch (err) {
      setError(
        err.message ||
          `Something went wrong while saving ${getSectionTitle(sectionName)}.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleWelcomeSlideEdit = (slide) => {
    const imageValue = getImageValue(slide);

    setWelcomeSlideForm({
      id: slide.id,
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      button_text: slide.button_text || "",
      button_link: slide.button_link || "",
      image: imageValue,
      image_url: imageValue,
      imageFile: null,
      imageFiles: [],
      imagePreview: buildImageUrl(imageValue),
      imagePreviews: [],
      sort_order: slide.sort_order ?? 0,
      is_active: toBoolean(slide.is_active),
    });

    setSavedMessage(false);
    setError("");
  };

  const handleWelcomeSlideDelete = async (slideId) => {
    if (!confirm("Delete this welcome slide?")) return;

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/welcome-slides/${slideId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete welcome slide.");
      }

      setWelcomeSlideForm(emptyWelcomeSlideForm);
      await fetchWelcomeSlides();

      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while deleting welcome slide.");
    } finally {
      setSaving(false);
    }
  };

  const handleSectionSixEdit = (image) => {
    const imageValue = getImageValue(image);

    setSectionSixForm({
      id: image.id,
      image: imageValue,
      image_url: imageValue,
      imageFile: null,
      imagePreview: buildImageUrl(imageValue),
      display_order: image.display_order ?? "",
      is_active: toBoolean(image.is_active),
    });

    setSavedMessage(false);
    setError("");
  };

  const handleSectionSixDelete = async (imageId) => {
    if (!confirm("Delete this gallery image?")) return;

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/section6/gallery/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete gallery image.");
      }

      setSectionSixForm(emptySectionSixForm);
      await fetchSectionSix();

      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while deleting image.");
    } finally {
      setSaving(false);
    }
  };


  const handleHomeSectionOneEdit = () => {
    if (!savedData) return;

    setForm({
      ...emptyGenericForm,
      ...savedData,
      imageFile: null,
      imagePreview: savedData.imagePreview || savedData.imageUrl || "",
      imageUrl: savedData.imageUrl || savedData.imagePreview || "",
      isActive: savedData.isActive ?? true,
    });

    setSavedMessage(false);
    setError("");
  };

  const handleHomeSectionOneDelete = async () => {
    if (!savedData?.id) return;
    if (!confirm("Delete Home Section One content?")) return;

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/home-section-one/${savedData.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete Home Section One.");
      }

      setForm(emptyGenericForm);
      setSavedData(null);
      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while deleting Home Section One.");
    } finally {
      setSaving(false);
    }
  };

  const handleSingleSectionEdit = (sectionKey, data) => {
    if (!data) return;

    if (sectionKey === "section-three") {
      setSectionThreeForm({
        ...emptySectionThreeForm,
        ...data,
        imageFile: null,
        imagePreview: data.imagePreview || buildImageUrl(data.image || data.image_url || ""),
      });
    }

    if (sectionKey === "section-four") {
      setSectionFourForm({
        ...emptySectionFourForm,
        ...data,
        imageFile: null,
        imagePreview: data.imagePreview || buildImageUrl(data.image || data.image_url || ""),
        is_active: toBoolean(data.is_active),
      });
    }

    if (sectionKey === "section-five") {
      setSectionFiveForm({
        ...emptySectionFiveForm,
        ...data,
        imageFile: null,
        imagePreview: data.imagePreview || buildImageUrl(data.image || data.image_url || ""),
        is_active: toBoolean(data.is_active),
      });
    }

    setSavedMessage(false);
    setError("");
  };

  const handleSingleSectionDelete = async (sectionKey, id) => {
    if (!id) return;
    if (!confirm("Delete this section content?")) return;

    const endpointMap = {
      "section-three": `home-section-threes/${id}`,
      "section-four": `home-section-fours/${id}`,
      "section-five": `home-section-fives/${id}`,
    };

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/${endpointMap[sectionKey]}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete section content.");
      }

      if (sectionKey === "section-three") {
        setSectionThreeForm(emptySectionThreeForm);
        await fetchSectionThree();
      } else {
        if (sectionKey === "section-four") setSectionFourForm(emptySectionFourForm);
        if (sectionKey === "section-five") setSectionFiveForm(emptySectionFiveForm);

        setSavedData(null);
      }

      showSavedSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong while deleting section content.");
    } finally {
      setSaving(false);
    }
  };

  const handleUrlContentEdit = (sectionName, data) => {
    if (!data) return;

    if (sectionName === "sauna") {
      setSectionTenForm({
        ...emptySectionTenImageForm,
        ...data,
        imageFile: null,
        imageFiles: [],
        imagePreview: data.imagePreview || buildImageUrl(data.image || data.image_url || ""),
        imagePreviews: [],
        slideDrafts: [],
      });

      setSavedMessage(false);
      setError("");
      return;
    }

    setUrlContentFormBySection(sectionName, {
      ...emptyUrlContentForm,
      ...data,
      imageFile: null,
      imagePreview: data.imagePreview || buildImageUrl(data.image || data.image_url || ""),
    });

    setSavedMessage(false);
    setError("");
  };

  const handleUrlContentDelete = async (sectionName, id) => {
    if (!id) return;
    if (!confirm(`Delete ${getSectionTitle(sectionName)} content?`)) return;

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const adminPath = getAdminPath(sectionName);
      const response = await fetch(`${API_BASE_URL}/${adminPath}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Failed to delete ${getSectionTitle(sectionName)}.`);
      }

      if (sectionName === "sauna") {
        setSectionTenForm(emptySectionTenImageForm);
        await fetchUrlContentSection("sauna");
      } else {
        setUrlContentFormBySection(sectionName, emptyUrlContentForm);
        setSavedData(null);
      }
      showSavedSuccess();
    } catch (err) {
      setError(
        err.message ||
          `Something went wrong while deleting ${getSectionTitle(sectionName)}.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleGenericEdit = () => {
    if (!savedData) return;

    setForm(formatGenericStorageSection(savedData));
    setSavedMessage(false);
    setError("");
  };

  const handleGenericDelete = () => {
    if (!savedData) return;
    if (!confirm("Delete this section content?")) return;

    const allSections = loadSections();
    delete allSections[currentSection.slug];
    saveSections(allSections);

    setForm(emptyGenericForm);
    setSavedData(null);
    showSavedSuccess();
  };

  const handleSave = () => {
    if (isWelcomeSection) {
      handleWelcomeSlideSave();
      return;
    }

    if (isHomeSectionOne) {
      handleHomeSectionOneSave();
      return;
    }

    if (isSectionThree) {
      handleSectionThreeSave();
      return;
    }

    if (isSectionFour) {
      handleSectionFourSave();
      return;
    }

    if (isSectionFive) {
      handleSectionFiveSave();
      return;
    }

    if (isSectionSix) {
      handleSectionSixSave();
      return;
    }

    if (isSectionSeven) {
      handleUrlContentSave("fitness");
      return;
    }

    if (isSectionEight) {
      handleUrlContentSave("parking");
      return;
    }

    if (isSectionNine) {
      handleUrlContentSave("restaurant-bar");
      return;
    }

    if (isSectionTen) {
      handleUrlContentSave("sauna");
      return;
    }

    if (isSectionEleven) {
      handleUrlContentSave("pool");
      return;
    }

    if (isSectionTwelve) {
      handleUrlContentSave("family-kids");
      return;
    }

    handleGenericSave();
  };

  const handleClear = () => {
    if (!confirm("Clear this section form?")) return;

    if (isWelcomeSection) {
      setWelcomeSlideForm(emptyWelcomeSlideForm);
    } else if (isHomeSectionOne) {
      setForm(emptyGenericForm);
    } else if (isSectionThree) {
      setSectionThreeForm(emptySectionThreeForm);
    } else if (isSectionFour) {
      setSectionFourForm(emptySectionFourForm);
    } else if (isSectionFive) {
      setSectionFiveForm(emptySectionFiveForm);
    } else if (isSectionSix) {
      setSectionSixForm(emptySectionSixForm);
    } else if (isSectionSeven) {
      keepUrlImageOnClear("fitness");
    } else if (isSectionEight) {
      keepUrlImageOnClear("parking");
    } else if (isSectionNine) {
      keepUrlImageOnClear("restaurant-bar");
    } else if (isSectionTen) {
      setSectionTenForm(emptySectionTenImageForm);
    } else if (isSectionEleven) {
      keepUrlImageOnClear("pool");
    } else if (isSectionTwelve) {
      keepUrlImageOnClear("family-kids");
    } else {
      setForm(emptyGenericForm);
    }

    setSavedMessage(false);
    setError("");
  };

  const keepUrlImageOnClear = (sectionName) => {
    setUrlContentFormBySection(sectionName, emptyUrlContentForm);
  };

  const renderWelcomeSlideForm = () => {
    const selectedDrafts = welcomeSlideForm.slideDrafts || [];

    return (
      <div className="space-y-5">
        {welcomeSlideForm.id ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Editing welcome slide #{welcomeSlideForm.id}. Click “Clear Form” to
            add new slides instead.
          </div>
        ) : (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Upload one or more welcome images. After upload, add a different
            title and subtitle for each image.
          </div>
        )}

        {welcomeSlideForm.id && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Title"
                value={welcomeSlideForm.title}
                onChange={(value) => updateWelcomeSlideField("title", value)}
                placeholder="Enter welcome title"
              />

              <InputField
                label="Subtitle"
                value={welcomeSlideForm.subtitle}
                onChange={(value) => updateWelcomeSlideField("subtitle", value)}
                placeholder="Enter welcome subtitle"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Sort Order"
                type="number"
                value={welcomeSlideForm.sort_order}
                onChange={(value) => updateWelcomeSlideField("sort_order", value)}
                placeholder="Example: 1"
              />

              <ActiveToggle
                label="Active Slide"
                checked={welcomeSlideForm.is_active}
                onChange={(value) => updateWelcomeSlideField("is_active", value)}
              />
            </div>
          </>
        )}

        <ImageUploadField
          multiple={!welcomeSlideForm.id}
          preview={welcomeSlideForm.imagePreview}
          previews={welcomeSlideForm.id ? [] : welcomeSlideForm.imagePreviews}
          onChange={handleWelcomeSlideImageChange}
          maxText={
            welcomeSlideForm.id
              ? "JPG, JPEG, PNG, WEBP."
              : "JPG, JPEG, PNG, WEBP. Multiple images allowed."
          }
        />

        {!welcomeSlideForm.id && selectedDrafts.length > 0 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Selected welcome images
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Each image will be saved as its own slide with its own title
                and subtitle.
              </p>
            </div>

            {selectedDrafts.map((draft, index) => (
              <div
                key={`${draft.preview}-${index}`}
                className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[180px_minmax(0,1fr)]"
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img
                    src={draft.preview}
                    alt={`Welcome slide draft ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">
                      Welcome Image #{index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeWelcomeSlideDraft(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Image Title"
                      value={draft.title}
                      onChange={(value) =>
                        updateWelcomeSlideDraft(index, "title", value)
                      }
                      placeholder="Example: Unforgettable"
                    />

                    <InputField
                      label="Image Subtitle"
                      value={draft.subtitle}
                      onChange={(value) =>
                        updateWelcomeSlideDraft(index, "subtitle", value)
                      }
                      placeholder="Example: Charm & Adventure"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Sort Order"
                      type="number"
                      value={draft.sort_order}
                      onChange={(value) =>
                        updateWelcomeSlideDraft(index, "sort_order", value)
                      }
                      placeholder="1"
                    />

                    <ActiveToggle
                      label="Active Slide"
                      checked={draft.is_active}
                      onChange={(value) =>
                        updateWelcomeSlideDraft(index, "is_active", value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSectionThreeForm = () => {
    const selectedDrafts = sectionThreeForm.slideDrafts || [];

    return (
      <div className="space-y-5">
        {sectionThreeForm.id ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Editing Home Section Three slide #{sectionThreeForm.id}. Click “Clear Form” to add new slides instead.
          </div>
        ) : (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Upload one or more images. Each image will have its own title and description.
          </div>
        )}

        {sectionThreeForm.id && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Title Line One"
                value={sectionThreeForm.title_one}
                onChange={(value) => updateSectionThreeField("title_one", value)}
                placeholder="Example: Unforgettable"
              />

              <InputField
                label="Title Line Two"
                value={sectionThreeForm.title_two}
                onChange={(value) => updateSectionThreeField("title_two", value)}
                placeholder="Example: Weddings"
              />
            </div>

            <TextareaField
              label="Description"
              value={sectionThreeForm.description}
              onChange={(value) => updateSectionThreeField("description", value)}
              placeholder="Enter slide description"
            />
          </>
        )}

        <ImageUploadField
          multiple={!sectionThreeForm.id}
          preview={sectionThreeForm.imagePreview}
          previews={sectionThreeForm.id ? [] : sectionThreeForm.imagePreviews}
          onChange={handleSectionThreeImageChange}
          maxText={
            sectionThreeForm.id
              ? "JPG, JPEG, PNG, WEBP."
              : "JPG, JPEG, PNG, WEBP. Multiple images allowed."
          }
        />

        {!sectionThreeForm.id && selectedDrafts.length > 0 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Selected Home Section Three images
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Add a title and description for each image before saving.
              </p>
            </div>

            {selectedDrafts.map((draft, index) => (
              <div
                key={`${draft.preview}-${index}`}
                className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[180px_minmax(0,1fr)]"
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img
                    src={draft.preview}
                    alt={`Home Section Three draft ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">
                      Section Three Image #{index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeSectionThreeDraft(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Title Line One"
                      value={draft.title_one}
                      onChange={(value) =>
                        updateSectionThreeDraft(index, "title_one", value)
                      }
                      placeholder="Example: Unforgettable"
                    />

                    <InputField
                      label="Title Line Two"
                      value={draft.title_two}
                      onChange={(value) =>
                        updateSectionThreeDraft(index, "title_two", value)
                      }
                      placeholder="Example: Weddings"
                    />
                  </div>

                  <TextareaField
                    label="Description"
                    value={draft.description}
                    onChange={(value) =>
                      updateSectionThreeDraft(index, "description", value)
                    }
                    placeholder="Enter image description"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  const renderSectionFourForm = () => {
    return (
      <div className="space-y-5">
        <InputField
          label="Eyebrow"
          value={sectionFourForm.eyebrow}
          onChange={(value) => updateSectionFourField("eyebrow", value)}
          placeholder="Example: Luxury Experience"
        />

        <InputField
          label="Title Line One"
          value={sectionFourForm.title_line_one}
          onChange={(value) =>
            updateSectionFourField("title_line_one", value)
          }
          placeholder="Enter first title line"
        />

        <InputField
          label="Title Line Two"
          value={sectionFourForm.title_line_two}
          onChange={(value) =>
            updateSectionFourField("title_line_two", value)
          }
          placeholder="Enter second title line"
        />

        <TextareaField
          label="Description"
          value={sectionFourForm.description}
          onChange={(value) => updateSectionFourField("description", value)}
          placeholder="Enter slide description"
        />

        <InputField
          label="Sort Order"
          type="number"
          value={sectionFourForm.sort_order}
          onChange={(value) => updateSectionFourField("sort_order", value)}
          placeholder="0"
        />

        <ActiveToggle
          label="Active Slide"
          checked={sectionFourForm.is_active}
          onChange={(value) => updateSectionFourField("is_active", value)}
        />

        <ImageUploadField
          preview={sectionFourForm.imagePreview}
          onChange={handleSectionFourImageChange}
          maxText="JPG, JPEG, PNG, WEBP. Max 4MB."
        />
      </div>
    );
  };

  const renderSectionFiveForm = () => {
    return (
      <div className="space-y-5">
        <InputField
          label="Eyebrow"
          value={sectionFiveForm.eyebrow}
          onChange={(value) => updateSectionFiveField("eyebrow", value)}
          placeholder="Example: Welcome to Luxury Garden Palace"
        />

        <InputField
          label="Title"
          value={sectionFiveForm.title}
          onChange={(value) => updateSectionFiveField("title", value)}
          placeholder="Enter section title"
        />

        <TextareaField
          label="Description"
          value={sectionFiveForm.description}
          onChange={(value) => updateSectionFiveField("description", value)}
          placeholder="Enter section description"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Button Text"
            value={sectionFiveForm.button_text}
            onChange={(value) =>
              updateSectionFiveField("button_text", value)
            }
            placeholder="Example: Learn More"
          />

          <InputField
            label="Button Link"
            icon={Link2}
            value={sectionFiveForm.button_link}
            onChange={(value) =>
              updateSectionFiveField("button_link", value)
            }
            placeholder="Example: /rooms or #about"
          />
        </div>

        <ActiveToggle
          label="Active Section"
          checked={sectionFiveForm.is_active}
          onChange={(value) => updateSectionFiveField("is_active", value)}
        />

        <ImageUploadField
          preview={sectionFiveForm.imagePreview}
          onChange={handleSectionFiveImageChange}
          maxText="JPG, JPEG, PNG, WEBP. Max 4MB."
        />
      </div>
    );
  };

  const renderSectionSixForm = () => {
    const selectedDrafts = sectionSixForm.imageDrafts || [];

    return (
      <div className="space-y-5">
        {sectionSixForm.id ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Editing gallery image #{sectionSixForm.id}. Click “Clear Form” to
            add new images instead.
          </div>
        ) : (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Select one or more gallery photos. No title or description is needed.
          </div>
        )}

        <InputField
          label="Display Order"
          type="number"
          value={sectionSixForm.display_order}
          onChange={(value) => updateSectionSixField("display_order", value)}
          placeholder="Optional"
        />

        <ActiveToggle
          label="Active Image"
          checked={sectionSixForm.is_active}
          onChange={(value) => updateSectionSixField("is_active", value)}
        />

        <ImageUploadField
          multiple={!sectionSixForm.id}
          preview={sectionSixForm.imagePreview}
          previews={sectionSixForm.id ? [] : sectionSixForm.imagePreviews}
          onChange={handleSectionSixImageChange}
          maxText={
            sectionSixForm.id
              ? "JPG, JPEG, PNG, WEBP."
              : "JPG, JPEG, PNG, WEBP. Multiple photos allowed."
          }
        />

        {!sectionSixForm.id && selectedDrafts.length > 0 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Selected gallery photos
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                These photos will be saved as separate gallery images.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {selectedDrafts.map((draft, index) => (
                <div
                  key={`${draft.preview}-${index}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={draft.preview}
                    alt={`Gallery draft ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />

                  <div className="p-3">
                    <div className="mb-2 text-xs font-bold text-slate-700">
                      Gallery Photo #{index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSectionSixDraft(index)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSectionTenForm = () => {
    const selectedDrafts = sectionTenForm.slideDrafts || [];

    return (
      <div className="space-y-5">
        {sectionTenForm.id ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Editing sauna image #{sectionTenForm.id}. Click “Clear Form” to add new images instead.
          </div>
        ) : (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Upload one or more sauna images. Each image will have its own title, subtitle, and description.
          </div>
        )}

        {sectionTenForm.id && (
          <>
            <InputField
              label="Title"
              value={sectionTenForm.title}
              onChange={(value) => updateUrlContentField("sauna", "title", value)}
              placeholder="Enter sauna image title"
            />

            <InputField
              label="Subtitle"
              value={sectionTenForm.subtitle}
              onChange={(value) => updateUrlContentField("sauna", "subtitle", value)}
              placeholder="Enter sauna image subtitle"
            />

            <TextareaField
              label="Description"
              value={sectionTenForm.description}
              onChange={(value) => updateUrlContentField("sauna", "description", value)}
              placeholder="Enter sauna image description"
            />
          </>
        )}

        <ImageUploadField
          multiple={!sectionTenForm.id}
          preview={sectionTenForm.imagePreview}
          previews={sectionTenForm.id ? [] : sectionTenForm.imagePreviews}
          onChange={(e) => handleUrlContentImageChange("sauna", e)}
          maxText={
            sectionTenForm.id
              ? "JPG, JPEG, PNG, WEBP."
              : "JPG, JPEG, PNG, WEBP. Multiple images allowed."
          }
        />

        {!sectionTenForm.id && selectedDrafts.length > 0 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Selected sauna images
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Add title, subtitle, and description for each image before saving.
              </p>
            </div>

            {selectedDrafts.map((draft, index) => (
              <div
                key={`${draft.preview}-${index}`}
                className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[180px_minmax(0,1fr)]"
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img
                    src={draft.preview}
                    alt={`Sauna draft ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">
                      Sauna Image #{index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeSectionTenDraft(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>

                  <InputField
                    label="Title"
                    value={draft.title}
                    onChange={(value) => updateSectionTenDraft(index, "title", value)}
                    placeholder="Example: Relaxing Sauna"
                  />

                  <InputField
                    label="Subtitle"
                    value={draft.subtitle}
                    onChange={(value) => updateSectionTenDraft(index, "subtitle", value)}
                    placeholder="Example: Wellness and calm"
                  />

                  <TextareaField
                    label="Description"
                    value={draft.description}
                    onChange={(value) => updateSectionTenDraft(index, "description", value)}
                    placeholder="Enter image description"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUrlContentForm = (
    activeForm,
    sectionName,
    labelPrefix,
    onImageChange
  ) => {
    return (
      <div className="space-y-5">
        <InputField
          label="Title"
          value={activeForm.title}
          onChange={(value) => updateUrlContentField(sectionName, "title", value)}
          placeholder={`Enter ${labelPrefix} title`}
        />

        <InputField
          label="Subtitle"
          value={activeForm.subtitle}
          onChange={(value) =>
            updateUrlContentField(sectionName, "subtitle", value)
          }
          placeholder={`Enter ${labelPrefix} subtitle`}
        />

        <TextareaField
          label="Description"
          value={activeForm.description}
          onChange={(value) =>
            updateUrlContentField(sectionName, "description", value)
          }
          placeholder={`Enter ${labelPrefix} description`}
        />

        <ImageUploadField
          preview={activeForm.imagePreview}
          onChange={onImageChange}
          maxText="JPG, JPEG, PNG, WEBP."
        />
      </div>
    );
  };

  const renderGenericForm = () => {
    return (
      <div className="space-y-5">
        <InputField
          label="Title"
          value={form.title}
          onChange={(value) => updateGenericField("title", value)}
          placeholder="Enter section title"
        />

        <InputField
          label="Subtitle"
          value={form.subtitle}
          onChange={(value) => updateGenericField("subtitle", value)}
          placeholder="Enter section subtitle"
        />

        <TextareaField
          label="Description"
          value={form.description}
          onChange={(value) => updateGenericField("description", value)}
          placeholder="Enter section description"
        />

        {isHomeSectionOne || isHomeSectionTwo ? (
          <ImageUploadField
            preview={form.imagePreview || form.imageUrl}
            onChange={handleGenericImageChange}
            maxText="JPG, JPEG, PNG, WEBP. Upload image file, not URL."
          />
        ) : (
          <>
            <InputField
              label="Image URL"
              icon={Image}
              type="url"
              value={form.imageUrl}
              onChange={(value) => updateGenericField("imageUrl", value)}
              placeholder="https://example.com/image.jpg"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Button Text"
                value={form.buttonText}
                onChange={(value) => updateGenericField("buttonText", value)}
                placeholder="Example: Learn More"
              />

              <InputField
                label="Button Link"
                icon={Link2}
                value={form.buttonLink}
                onChange={(value) => updateGenericField("buttonLink", value)}
                placeholder="Example: /rooms or #about"
              />
            </div>
          </>
        )}

        <ActiveToggle
          label="Active Section"
          checked={form.isActive}
          onChange={(value) => updateGenericField("isActive", value)}
        />
      </div>
    );
  };

  const renderWelcomeSlidePreview = () => {
    if (!welcomeSlides.length) {
      return renderEmptyPreview("No welcome slides saved yet");
    }

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">
            Saved Welcome Slides: {welcomeSlides.length}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Click edit to update a welcome slide, or delete to remove it.
          </p>
        </div>

        <div className="grid gap-4">
          {welcomeSlides.map((slide) => (
            <div
              key={slide.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-video bg-slate-100">
                <img
                  src={slide.imagePreview}
                  alt={slide.title || `Welcome slide ${slide.id}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900";
                  }}
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SectionBadge>Welcome #{slide.id}</SectionBadge>

                  <StatusBadge active={toBoolean(slide.is_active)} />

                  {slide.sort_order !== undefined && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Sort: {slide.sort_order}
                    </span>
                  )}
                </div>

                {slide.subtitle && <EyebrowText>{slide.subtitle}</EyebrowText>}

                <h3 className="text-xl font-bold text-slate-900">
                  {slide.title || "No title saved"}
                </h3>

                {slide.description && (
                  <p className="text-sm leading-7 text-slate-600">
                    {slide.description}
                  </p>
                )}

                {slide.button_text && (
                  <div className="pt-2">
                    <span className="inline-flex rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white">
                      {slide.button_text}
                    </span>

                    {slide.button_link && (
                      <p className="mt-2 text-xs text-slate-400">
                        Link: {slide.button_link}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleWelcomeSlideEdit(slide)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWelcomeSlideDelete(slide.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSectionThreePreview = () => {
    if (!sectionThreeSlides.length) {
      return renderEmptyPreview("No Home Section Three slides saved yet");
    }

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">
            Saved Home Section Three Slides: {sectionThreeSlides.length}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Click edit to update one image, or delete to remove it.
          </p>
        </div>

        <div className="grid gap-4">
          {sectionThreeSlides.map((slide) => (
            <div
              key={slide.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-video bg-slate-100">
                <img
                  src={slide.imagePreview}
                  alt={slide.title_one || `Home Section Three slide ${slide.id}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900";
                  }}
                />
              </div>

              <div className="space-y-3 p-4">
                <SectionBadge>Section Three #{slide.id}</SectionBadge>

                <h3 className="text-2xl font-bold leading-tight text-slate-900">
                  {slide.title_one || "No title line one saved"}
                </h3>

                {slide.title_two && (
                  <h4 className="text-lg font-semibold leading-tight text-amber-600">
                    {slide.title_two}
                  </h4>
                )}

                {slide.description && (
                  <p className="text-sm leading-7 text-slate-600">
                    {slide.description}
                  </p>
                )}

                <PreviewActions
                  onEdit={() => handleSingleSectionEdit("section-three", slide)}
                  onDelete={() => handleSingleSectionDelete("section-three", slide.id)}
                />

                {slide.updatedAt && <UpdatedAt date={slide.updatedAt} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const renderSectionFourPreview = () => {
    if (!savedData) {
      return renderEmptyPreview("No saved section four slide yet");
    }

    return (
      <PreviewCard image={savedData.imagePreview}>
        <div className="flex flex-wrap items-center gap-2">
          <SectionBadge>{currentSection.title}</SectionBadge>

          <StatusBadge active={savedData.is_active} />

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            Sort: {savedData.sort_order ?? 0}
          </span>
        </div>

        {savedData.eyebrow && (
          <EyebrowText>{savedData.eyebrow}</EyebrowText>
        )}

        <h3 className="text-2xl font-bold leading-tight text-slate-900">
          {savedData.title_line_one || "No title line one saved"}
        </h3>

        <h4 className="text-lg font-semibold leading-tight text-amber-600">
          {savedData.title_line_two || "No title line two saved"}
        </h4>

        {savedData.description && (
          <p className="text-sm leading-7 text-slate-600">
            {savedData.description}
          </p>
        )}

        <PreviewActions
          onEdit={() => handleSingleSectionEdit("section-four", savedData)}
          onDelete={() => handleSingleSectionDelete("section-four", savedData.id)}
        />

        {savedData.updatedAt && <UpdatedAt date={savedData.updatedAt} />}
      </PreviewCard>
    );
  };

  const renderSectionFivePreview = () => {
    if (!savedData) {
      return renderEmptyPreview("No saved section five content yet");
    }

    return (
      <PreviewCard image={savedData.imagePreview}>
        <div className="flex flex-wrap items-center gap-2">
          <SectionBadge>{currentSection.title}</SectionBadge>
          <StatusBadge active={savedData.is_active} />
        </div>

        {savedData.eyebrow && (
          <EyebrowText>{savedData.eyebrow}</EyebrowText>
        )}

        <h3 className="text-2xl font-bold leading-tight text-slate-900">
          {savedData.title || "No title saved"}
        </h3>

        {savedData.description && (
          <p className="text-sm leading-7 text-slate-600">
            {savedData.description}
          </p>
        )}

        {savedData.button_text && (
          <div className="pt-2">
            <span className="inline-flex rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white">
              {savedData.button_text}
            </span>

            {savedData.button_link && (
              <p className="mt-2 text-xs text-slate-400">
                Link: {savedData.button_link}
              </p>
            )}
          </div>
        )}

        <PreviewActions
          onEdit={() => handleSingleSectionEdit("section-five", savedData)}
          onDelete={() => handleSingleSectionDelete("section-five", savedData.id)}
        />

        {savedData.updatedAt && <UpdatedAt date={savedData.updatedAt} />}
      </PreviewCard>
    );
  };

  const renderSectionSixPreview = () => {
    if (!sectionSixImages.length) {
      return renderEmptyPreview("No gallery images saved yet");
    }

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">
            Saved Gallery Images: {sectionSixImages.length}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Click edit to replace an image, or delete to remove it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sectionSixImages.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-video bg-slate-100">
                <img
                  src={image.imagePreview}
                  alt={`Gallery ${image.id}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900";
                  }}
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SectionBadge>Gallery #{image.id}</SectionBadge>

                  {image.display_order !== undefined && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Order: {image.display_order}
                    </span>
                  )}

                  <StatusBadge active={toBoolean(image.is_active)} />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSectionSixEdit(image)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSectionSixDelete(image.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSectionTenPreview = () => {
    if (!sectionTenImages.length) {
      return renderEmptyPreview("No saved sauna images yet");
    }

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">
            Saved Sauna Images: {sectionTenImages.length}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Each image can have its own title, subtitle, and description.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sectionTenImages.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-video bg-slate-100">
                <img
                  src={image.imagePreview}
                  alt={image.title || `Sauna image ${image.id}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900";
                  }}
                />
              </div>

              <div className="space-y-3 p-4">
                <SectionBadge>Sauna #{image.id}</SectionBadge>

                {image.subtitle && <EyebrowText>{image.subtitle}</EyebrowText>}

                <h3 className="text-xl font-bold text-slate-900">
                  {image.title || "No title saved"}
                </h3>

                {image.description && (
                  <p className="text-sm leading-7 text-slate-600">
                    {image.description}
                  </p>
                )}

                <PreviewActions
                  onEdit={() => handleUrlContentEdit("sauna", image)}
                  onDelete={() => handleUrlContentDelete("sauna", image.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUrlContentPreview = (data, emptyTitle, sectionName = null) => {
    if (!data) {
      return renderEmptyPreview(emptyTitle);
    }

    return (
      <PreviewCard image={data.imagePreview}>
        <SectionBadge>{currentSection.title}</SectionBadge>

        {data.subtitle && <EyebrowText>{data.subtitle}</EyebrowText>}

        <h3 className="text-2xl font-bold leading-tight text-slate-900">
          {data.title || "No title saved"}
        </h3>

        {data.description && (
          <p className="text-sm leading-7 text-slate-600">
            {data.description}
          </p>
        )}

        {sectionName && (
          <PreviewActions
            onEdit={() => handleUrlContentEdit(sectionName, data)}
            onDelete={() => handleUrlContentDelete(sectionName, data.id)}
          />
        )}

        {data.updatedAt && <UpdatedAt date={data.updatedAt} />}
      </PreviewCard>
    );
  };

  const renderGenericPreview = () => {
    if (!savedData) {
      return renderEmptyPreview("No saved content yet");
    }

    const editHandler = isHomeSectionOne ? handleHomeSectionOneEdit : handleGenericEdit;
    const deleteHandler = isHomeSectionOne ? handleHomeSectionOneDelete : handleGenericDelete;

    return (
      <PreviewCard image={savedData.imagePreview || savedData.imageUrl}>
        <div className="flex flex-wrap items-center gap-2">
          <SectionBadge>{currentSection.title}</SectionBadge>
          <StatusBadge active={savedData.isActive} />
        </div>

        {savedData.subtitle && <EyebrowText>{savedData.subtitle}</EyebrowText>}

        <h3 className="text-2xl font-bold leading-tight text-slate-900">
          {savedData.title || "No title saved"}
        </h3>

        {savedData.description && (
          <p className="text-sm leading-7 text-slate-600">
            {savedData.description}
          </p>
        )}

        {!isHomeSectionOne && !isHomeSectionTwo && savedData.buttonText && (
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

        <PreviewActions onEdit={editHandler} onDelete={deleteHandler} />

        {savedData.updatedAt && <UpdatedAt date={savedData.updatedAt} />}
      </PreviewCard>
    );
  };

  const renderEmptyPreview = (title) => {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Save size={24} />
          </div>

          <h3 className="text-base font-bold text-slate-900">{title}</h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Fill the form on the left and click “Save Section”.
          </p>
        </div>
      </div>
    );
  };

  const getForm = () => {
    if (isWelcomeSection) return renderWelcomeSlideForm();
    if (isSectionThree) return renderSectionThreeForm();
    if (isSectionFour) return renderSectionFourForm();
    if (isSectionFive) return renderSectionFiveForm();
    if (isSectionSix) return renderSectionSixForm();

    if (isSectionSeven) {
      return renderUrlContentForm(
        sectionSevenForm,
        "fitness",
        "fitness",
        (e) => handleUrlContentImageChange("fitness", e)
      );
    }

    if (isSectionEight) {
      return renderUrlContentForm(
        sectionEightForm,
        "parking",
        "parking",
        (e) => handleUrlContentImageChange("parking", e)
      );
    }

    if (isSectionNine) {
      return renderUrlContentForm(
        sectionNineForm,
        "restaurant-bar",
        "restaurant and bar",
        (e) => handleUrlContentImageChange("restaurant-bar", e)
      );
    }

    if (isSectionTen) return renderSectionTenForm();

    if (isSectionEleven) {
      return renderUrlContentForm(
        sectionElevenForm,
        "pool",
        "pool",
        (e) => handleUrlContentImageChange("pool", e)
      );
    }

    if (isSectionTwelve) {
      return renderUrlContentForm(
        sectionTwelveForm,
        "family-kids",
        "family and kids",
        (e) => handleUrlContentImageChange("family-kids", e)
      );
    }

    return renderGenericForm();
  };

  const getPreview = () => {
    if (isWelcomeSection) return renderWelcomeSlidePreview();
    if (isSectionThree) return renderSectionThreePreview();
    if (isSectionFour) return renderSectionFourPreview();
    if (isSectionFive) return renderSectionFivePreview();
    if (isSectionSix) return renderSectionSixPreview();

    if (isSectionSeven) {
      return renderUrlContentPreview(
        savedData,
        "No saved fitness section content yet",
        "fitness"
      );
    }

    if (isSectionEight) {
      return renderUrlContentPreview(
        savedData,
        "No saved parking section content yet",
        "parking"
      );
    }

    if (isSectionNine) {
      return renderUrlContentPreview(
        savedData,
        "No saved restaurant and bar section content yet",
        "restaurant-bar"
      );
    }

    if (isSectionTen) return renderSectionTenPreview();

    if (isSectionEleven) {
      return renderUrlContentPreview(
        savedData,
        "No saved pool section content yet",
        "pool"
      );
    }

    if (isSectionTwelve) {
      return renderUrlContentPreview(
        savedData,
        "No saved family and kids section content yet",
        "family-kids"
      );
    }

    return renderGenericPreview();
  };

  const getSaveButtonText = () => {
    if (saving) return "Saving...";

    if (isWelcomeSection && welcomeSlideForm.id) return "Update Slide";
    if (isWelcomeSection) {
      const count = welcomeSlideForm.slideDrafts?.length || 0;
      return count > 1 ? `Add ${count} Slides` : "Add Slide";
    }

    if (isSectionSix && sectionSixForm.id) return "Update Image";
    if (isSectionSix) {
      const count = sectionSixForm.imageDrafts?.length || 0;
      return count > 1 ? `Add ${count} Images` : "Add Image";
    }

    if (isSectionTen && sectionTenForm.id) return "Update Sauna Image";
    if (isSectionTen) {
      const count = sectionTenForm.slideDrafts?.length || 0;
      return count > 1 ? `Add ${count} Sauna Images` : "Add Sauna Image";
    }

    if (isHomeSectionOne && form.id) return "Update Section";
    if (isHomeSectionTwo && form.id) return "Update Section";

    return "Save Section";
  };

  return (
    <div className="space-y-6">
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
            {isLaravelApiSection
              ? "This section is connected to Laravel API."
              : "This section is still using local browser storage until API is connected."}
          </p>
        </div>

        {savedMessage && (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <Check size={16} />
            Saved successfully
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            <Loader2 size={18} className="animate-spin text-amber-500" />
            Loading section data...
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {isWelcomeSection
                  ? "Manage Welcome Slide"
                  : isSectionSix
                  ? "Manage Gallery Image"
                  : "Update Section"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isWelcomeSection
                  ? "Add, update, or remove welcome slides."
                  : isSectionSix
                  ? "Upload, update, or remove gallery images."
                  : "Fill this form and click save."}
              </p>
            </div>

            {getForm()}

            <div className="mt-6 flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-amber-500/25 transition hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (isWelcomeSection && !welcomeSlideForm.id) ||
                  (isSectionSix && !sectionSixForm.id) ||
                  (isSectionTen && !sectionTenForm.id) ? (
                  <Plus size={16} />
                ) : (
                  <Save size={16} />
                )}

                {getSaveButtonText()}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear Form
              </button>
            </div>
          </div>

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

            {getPreview()}
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon = Type,
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={15} className="text-slate-400" />
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Type size={15} className="text-slate-400" />
        {label}
      </label>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
      />
    </div>
  );
}

function ImageUploadField({
  preview,
  previews = [],
  onChange,
  maxText,
  multiple = false,
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Image size={15} className="text-slate-400" />
        Image
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-amber-400 hover:bg-amber-50/40">
        <Upload size={24} className="mb-2 text-amber-500" />

        <span className="text-sm font-semibold text-slate-700">
          {multiple ? "Click to upload images" : "Click to upload image"}
        </span>

        <span className="mt-1 text-xs text-slate-400">{maxText}</span>

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={onChange}
          multiple={multiple}
          className="hidden"
        />
      </label>

      {previews.length > 1 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {previews.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <img
                src={item}
                alt={`Selected preview ${index + 1}`}
                className="h-32 w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : preview ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <img
            src={preview}
            alt="Selected preview"
            className="h-48 w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}

function ActiveToggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <ToggleLeft size={16} className="text-slate-400" />
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
      />
    </label>
  );
}

function PreviewCard({ image, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      {image ? (
        <div className="aspect-video bg-slate-100">
          <img
            src={image}
            alt="Section preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900";
            }}
          />
        </div>
      ) : (
        <NoImage />
      )}

      <div className="space-y-3 p-5">{children}</div>
    </div>
  );
}

function PreviewActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2 pt-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
      >
        <Pencil size={14} />
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}

function SectionBadge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
      {children}
    </span>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function EyebrowText({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
      {children}
    </p>
  );
}

function NoImage() {
  return (
    <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm text-slate-400">
      No image saved
    </div>
  );
}

function UpdatedAt({ date }) {
  return (
    <p className="border-t border-slate-100 pt-3 text-xs text-slate-400">
      Last updated: {new Date(date).toLocaleString()}
    </p>
  );
}