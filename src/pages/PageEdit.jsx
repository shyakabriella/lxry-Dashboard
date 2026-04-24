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
  { id: 1, slug: "home-section-one", title: "Home Section One" },
  { id: 2, slug: "home-section-two", title: "Home Section Two" },
  { id: 3, slug: "home-section-three", title: "Home Section Three" },
  { id: 4, slug: "home-section-four", title: "Home Section Four" },
  { id: 5, slug: "home-section-five", title: "Home Section Five" },
  { id: 6, slug: "home-section-six", title: "Home Section Six Gallery" },
  { id: 7, slug: "home-section-seven", title: "Home Section Seven Fitness" },
  { id: 8, slug: "home-section-eight", title: "Home Section Eight Parking" },
  { id: 9, slug: "home-section-nine", title: "Home Section Nine" },
  { id: 10, slug: "home-section-ten", title: "Home Section Ten" },
  { id: 11, slug: "home-section-eleven", title: "Home Section Eleven" },
];

const emptyGenericForm = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  buttonText: "",
  buttonLink: "",
  isActive: true,
};

const emptySectionThreeForm = {
  id: null,
  title_one: "",
  title_two: "",
  description: "",
  image: "",
  imageFile: null,
  imagePreview: "",
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
  imagePreview: "",
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
  return item?.image || item?.image_url || "";
}

export default function PageEdit() {
  const { sectionSlug } = useParams();
  const navigate = useNavigate();

  const currentSection = useMemo(() => {
    return homeSections.find((section) => section.slug === sectionSlug);
  }, [sectionSlug]);

  const isSectionThree = sectionSlug === "home-section-three";
  const isSectionFour = sectionSlug === "home-section-four";
  const isSectionFive = sectionSlug === "home-section-five";
  const isSectionSix = sectionSlug === "home-section-six";
  const isSectionSeven = sectionSlug === "home-section-seven";
  const isSectionEight = sectionSlug === "home-section-eight";

  const isLaravelApiSection =
    isSectionThree ||
    isSectionFour ||
    isSectionFive ||
    isSectionSix ||
    isSectionSeven ||
    isSectionEight;

  const [form, setForm] = useState(emptyGenericForm);

  const [sectionThreeForm, setSectionThreeForm] = useState(
    emptySectionThreeForm
  );

  const [sectionFourForm, setSectionFourForm] = useState(emptySectionFourForm);
  const [sectionFiveForm, setSectionFiveForm] = useState(emptySectionFiveForm);

  const [sectionSixForm, setSectionSixForm] = useState(emptySectionSixForm);
  const [sectionSixImages, setSectionSixImages] = useState([]);

  const [sectionSevenForm, setSectionSevenForm] =
    useState(emptyUrlContentForm);

  const [sectionEightForm, setSectionEightForm] =
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
      fetchSectionSeven();
      return;
    }

    if (isSectionEight) {
      fetchSectionEight();
      return;
    }

    const allSections = loadSections();
    const existingData = allSections[currentSection.slug] || null;

    if (existingData) {
      setForm(existingData);
      setSavedData(existingData);
    } else {
      setForm(emptyGenericForm);
      setSavedData(null);
    }
  }, [
    currentSection,
    isSectionThree,
    isSectionFour,
    isSectionFive,
    isSectionSix,
    isSectionSeven,
    isSectionEight,
  ]);

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

      const item = getItems(data)[0] || null;

      if (!item) {
        setSectionThreeForm(emptySectionThreeForm);
        setSavedData(null);
        return;
      }

      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        title_one: item.title_one || "",
        title_two: item.title_two || "",
        description: item.description || "",
        image: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
      };

      setSectionThreeForm(formatted);
      setSavedData(formatted);
    } catch (err) {
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

      setSectionFourForm(formatted);
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

      setSectionFiveForm(formatted);
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

      const response = await fetch(`${API_BASE_URL}/section-6-gallery/active`, {
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

  const fetchSectionSeven = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/section-7-fitness`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        setSectionSevenForm(emptyUrlContentForm);
        setSavedData(null);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Section 7 Fitness.");
      }

      const item = data?.data || null;

      if (!item) {
        setSectionSevenForm(emptyUrlContentForm);
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
      };

      setSectionSevenForm(formatted);
      setSavedData(formatted);
    } catch (err) {
      setError(err.message || "Something went wrong while loading fitness.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionEight = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/section-8-parking`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        setSectionEightForm(emptyUrlContentForm);
        setSavedData(null);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Section 8 Parking.");
      }

      const item = data?.data || null;

      if (!item) {
        setSectionEightForm(emptyUrlContentForm);
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
      };

      setSectionEightForm(formatted);
      setSavedData(formatted);
    } catch (err) {
      setError(err.message || "Something went wrong while loading parking.");
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
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const updateSectionThreeField = (field, value) => {
    setSectionThreeForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const updateSectionFourField = (field, value) => {
    setSectionFourForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const updateSectionFiveField = (field, value) => {
    setSectionFiveForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const updateSectionSixField = (field, value) => {
    setSectionSixForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const updateSectionSevenField = (field, value) => {
    setSectionSevenForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const updateSectionEightField = (field, value) => {
    setSectionEightForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  const handleSectionThreeImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSectionThreeForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));

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
    const file = e.target.files?.[0];

    if (!file) return;

    setSectionSixForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));

    setSavedMessage(false);
  };

  const handleSectionSevenImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSectionSevenForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));

    setSavedMessage(false);
  };

  const handleSectionEightImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSectionEightForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));

    setSavedMessage(false);
  };

  const handleGenericSave = () => {
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

  const handleSectionThreeSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const formData = new FormData();

      formData.append("title_one", sectionThreeForm.title_one);
      formData.append("title_two", sectionThreeForm.title_two);

      if (sectionThreeForm.description) {
        formData.append("description", sectionThreeForm.description);
      }

      if (sectionThreeForm.imageFile) {
        formData.append("image", sectionThreeForm.imageFile);
      }

      const isUpdate = Boolean(sectionThreeForm.id);

      const url = isUpdate
        ? `${API_BASE_URL}/home-section-threes/${sectionThreeForm.id}`
        : `${API_BASE_URL}/home-section-threes`;

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
          "Failed to save Home Section Three."
        );

        throw new Error(message);
      }

      const item = data?.data || data;
      const imageValue = getImageValue(item);

      const formatted = {
        id: item.id,
        title_one: item.title_one || "",
        title_two: item.title_two || "",
        description: item.description || "",
        image: imageValue,
        imageFile: null,
        imagePreview: buildImageUrl(imageValue),
        updatedAt: new Date().toISOString(),
      };

      setSectionThreeForm(formatted);
      setSavedData(formatted);
      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 2500);
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
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

      setSectionFourForm(formatted);
      setSavedData(formatted);
      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 2500);
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

      setSectionFiveForm(formatted);
      setSavedData(formatted);
      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 2500);
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleSectionSixSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      if (!sectionSixForm.imageFile && !sectionSixForm.id) {
        throw new Error("Please upload a gallery image first.");
      }

      const isUpdate = Boolean(sectionSixForm.id);

      const url = isUpdate
        ? `${API_BASE_URL}/section-6-gallery/${sectionSixForm.id}`
        : `${API_BASE_URL}/section-6-gallery`;

      const formData = new FormData();

      if (sectionSixForm.imageFile) {
        formData.append("image", sectionSixForm.imageFile);
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

      setSectionSixForm(emptySectionSixForm);
      await fetchSectionSix();

      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 2500);
    } catch (err) {
      setError(err.message || "Something went wrong while saving gallery.");
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
        `${API_BASE_URL}/section-6-gallery/${imageId}`,
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

      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 2500);
    } catch (err) {
      setError(err.message || "Something went wrong while deleting image.");
    } finally {
      setSaving(false);
    }
  };

  const handleUrlContentSave = async (sectionName) => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage(false);

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const activeForm =
        sectionName === "fitness" ? sectionSevenForm : sectionEightForm;

      const basePath =
        sectionName === "fitness" ? "section-7-fitness" : "section-8-parking";

      const isUpdate = Boolean(activeForm.id);

      if (!activeForm.imageFile && !isUpdate) {
        throw new Error("Please upload an image first.");
      }

      const url = isUpdate
        ? `${API_BASE_URL}/${basePath}/${activeForm.id}`
        : `${API_BASE_URL}/${basePath}`;

      const formData = new FormData();

      formData.append("title", activeForm.title);
      formData.append("subtitle", activeForm.subtitle);
      formData.append("description", activeForm.description);

      if (activeForm.imageFile) {
        formData.append("image", activeForm.imageFile);
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
          `Failed to save ${
            sectionName === "fitness" ? "Section 7 Fitness" : "Section 8 Parking"
          }.`
        );

        throw new Error(message);
      }

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

      if (sectionName === "fitness") {
        setSectionSevenForm(formatted);
      } else {
        setSectionEightForm(formatted);
      }

      setSavedData(formatted);
      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 2500);
    } catch (err) {
      setError(err.message || "Something went wrong while saving content.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
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

    handleGenericSave();
  };

  const handleClear = () => {
    if (!confirm("Clear this section form?")) return;

    if (isSectionThree) {
      setSectionThreeForm((prev) => ({
        ...emptySectionThreeForm,
        id: prev.id,
        image: prev.image,
        imagePreview: prev.imagePreview,
      }));
    } else if (isSectionFour) {
      setSectionFourForm((prev) => ({
        ...emptySectionFourForm,
        id: prev.id,
        image: prev.image,
        imagePreview: prev.imagePreview,
      }));
    } else if (isSectionFive) {
      setSectionFiveForm((prev) => ({
        ...emptySectionFiveForm,
        id: prev.id,
        image: prev.image,
        imagePreview: prev.imagePreview,
      }));
    } else if (isSectionSix) {
      setSectionSixForm(emptySectionSixForm);
    } else if (isSectionSeven) {
      setSectionSevenForm((prev) => ({
        ...emptyUrlContentForm,
        id: prev.id,
        image: prev.image,
        image_url: prev.image_url,
        imagePreview: prev.imagePreview,
      }));
    } else if (isSectionEight) {
      setSectionEightForm((prev) => ({
        ...emptyUrlContentForm,
        id: prev.id,
        image: prev.image,
        image_url: prev.image_url,
        imagePreview: prev.imagePreview,
      }));
    } else {
      setForm(emptyGenericForm);
    }

    setSavedMessage(false);
    setError("");
  };

  const renderSectionThreeForm = () => {
    return (
      <div className="space-y-5">
        <InputField
          label="Title One"
          value={sectionThreeForm.title_one}
          onChange={(value) => updateSectionThreeField("title_one", value)}
          placeholder="Enter first title"
        />

        <InputField
          label="Title Two"
          value={sectionThreeForm.title_two}
          onChange={(value) => updateSectionThreeField("title_two", value)}
          placeholder="Enter second title"
        />

        <TextareaField
          label="Description"
          value={sectionThreeForm.description}
          onChange={(value) => updateSectionThreeField("description", value)}
          placeholder="Enter section description"
        />

        <ImageUploadField
          preview={sectionThreeForm.imagePreview}
          onChange={handleSectionThreeImageChange}
          maxText="JPG, JPEG, PNG, WEBP. Max 2MB."
        />
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
    return (
      <div className="space-y-5">
        {sectionSixForm.id ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Editing gallery image #{sectionSixForm.id}. Click “Clear Form” to
            add a new image instead.
          </div>
        ) : (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Upload a new gallery image. Saved images will appear on the right.
          </div>
        )}

        <InputField
          label="Display Order"
          type="number"
          value={sectionSixForm.display_order}
          onChange={(value) => updateSectionSixField("display_order", value)}
          placeholder="Example: 1"
        />

        <ActiveToggle
          label="Active Image"
          checked={sectionSixForm.is_active}
          onChange={(value) => updateSectionSixField("is_active", value)}
        />

        <ImageUploadField
          preview={sectionSixForm.imagePreview}
          onChange={handleSectionSixImageChange}
          maxText="JPG, JPEG, PNG, WEBP."
        />
      </div>
    );
  };

  const renderUrlContentForm = (
    activeForm,
    updateField,
    labelPrefix,
    onImageChange
  ) => {
    return (
      <div className="space-y-5">
        <InputField
          label="Title"
          value={activeForm.title}
          onChange={(value) => updateField("title", value)}
          placeholder={`Enter ${labelPrefix} title`}
        />

        <InputField
          label="Subtitle"
          value={activeForm.subtitle}
          onChange={(value) => updateField("subtitle", value)}
          placeholder={`Enter ${labelPrefix} subtitle`}
        />

        <TextareaField
          label="Description"
          value={activeForm.description}
          onChange={(value) => updateField("description", value)}
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

        <ActiveToggle
          label="Active Section"
          checked={form.isActive}
          onChange={(value) => updateGenericField("isActive", value)}
        />
      </div>
    );
  };

  const renderSectionThreePreview = () => {
    if (!savedData) {
      return renderEmptyPreview("No saved section three content yet");
    }

    return (
      <PreviewCard image={savedData.imagePreview}>
        <SectionBadge>{currentSection.title}</SectionBadge>

        <h3 className="text-2xl font-bold leading-tight text-slate-900">
          {savedData.title_one || "No title one saved"}
        </h3>

        <h4 className="text-lg font-semibold leading-tight text-amber-600">
          {savedData.title_two || "No title two saved"}
        </h4>

        {savedData.description && (
          <p className="text-sm leading-7 text-slate-600">
            {savedData.description}
          </p>
        )}

        {savedData.updatedAt && <UpdatedAt date={savedData.updatedAt} />}
      </PreviewCard>
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

  const renderUrlContentPreview = (data, emptyTitle) => {
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

        {data.updatedAt && <UpdatedAt date={data.updatedAt} />}
      </PreviewCard>
    );
  };

  const renderGenericPreview = () => {
    if (!savedData) {
      return renderEmptyPreview("No saved content yet");
    }

    return (
      <PreviewCard image={savedData.imageUrl}>
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
    if (isSectionThree) return renderSectionThreeForm();
    if (isSectionFour) return renderSectionFourForm();
    if (isSectionFive) return renderSectionFiveForm();
    if (isSectionSix) return renderSectionSixForm();

    if (isSectionSeven) {
      return renderUrlContentForm(
        sectionSevenForm,
        updateSectionSevenField,
        "fitness",
        handleSectionSevenImageChange
      );
    }

    if (isSectionEight) {
      return renderUrlContentForm(
        sectionEightForm,
        updateSectionEightField,
        "parking",
        handleSectionEightImageChange
      );
    }

    return renderGenericForm();
  };

  const getPreview = () => {
    if (isSectionThree) return renderSectionThreePreview();
    if (isSectionFour) return renderSectionFourPreview();
    if (isSectionFive) return renderSectionFivePreview();
    if (isSectionSix) return renderSectionSixPreview();

    if (isSectionSeven) {
      return renderUrlContentPreview(
        savedData,
        "No saved fitness section content yet"
      );
    }

    if (isSectionEight) {
      return renderUrlContentPreview(
        savedData,
        "No saved parking section content yet"
      );
    }

    return renderGenericPreview();
  };

  const getSaveButtonText = () => {
    if (saving) return "Saving...";

    if (isSectionSix && sectionSixForm.id) return "Update Image";
    if (isSectionSix) return "Add Image";

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
                {isSectionSix ? "Manage Gallery Image" : "Update Section"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isSectionSix
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
                ) : isSectionSix && !sectionSixForm.id ? (
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

function ImageUploadField({ preview, onChange, maxText }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Image size={15} className="text-slate-400" />
        Image
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-amber-400 hover:bg-amber-50/40">
        <Upload size={24} className="mb-2 text-amber-500" />

        <span className="text-sm font-semibold text-slate-700">
          Click to upload image
        </span>

        <span className="mt-1 text-xs text-slate-400">{maxText}</span>

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={onChange}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <img
            src={preview}
            alt="Selected preview"
            className="h-48 w-full object-cover"
          />
        </div>
      )}
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