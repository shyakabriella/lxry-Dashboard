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
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const APP_URL = API_URL.replace(/\/api$/, "");

const STORAGE_URL = (
  import.meta.env.VITE_STORAGE_URL || `${APP_URL}/storage`
).replace(/\/$/, "");

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

export default function HeroSectionManager() {
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [slides, setSlides] = useState([]);

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

    setHasChanges(true);
    setSaved(false);
    setError(null);
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

    setHasChanges(true);
  };

  const editSlide = (index) => {
    setEditingSlideIndex(index);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSaved(false);
    setEditedSection({ ...slides[index] });
    setHasChanges(false);
  };

  const cancelEditSlide = () => {
    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);

    setEditedSection({
      images: slides.map((slide) => slide.image_url),
    });

    setHasChanges(false);
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
    setHasChanges(true);
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
      formData.append("sort_order", editedSection.sort_order || slides.length + 1);

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
        setHasChanges(false);
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

  const handleSave = () => {
    if (editingSlideIndex !== null) {
      saveSlide();
    }
  };

  const handleReset = () => {
    setEditedSection({
      images: slides.map((slide) => slide.image_url),
    });

    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setHasChanges(false);
    setSaved(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-gray-500 mt-2">
            Please login to manage wedding content
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (editingSlideIndex !== null) {
    const isNew = editingSlideIndex === -1;
    const previewImage = imagePreview || getImageUrl(editedSection?.image_url);

    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={cancelEditSlide}
              className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to slides
            </button>

            <h2 className="text-xl font-bold">
              {isNew ? "Add New Wedding Slide" : "Edit Wedding Slide"}
            </h2>

            <p className="text-sm text-gray-500">
              Upload an image from your computer for the wedding hero slider.
            </p>
          </div>

          <button
            onClick={cancelEditSlide}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">
            <Check size={16} />
            Saved successfully!
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>

              <input
                value={editedSection?.title || ""}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-lg border p-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="e.g. Exclusive Wedding Experience"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Subtitle
              </label>

              <input
                value={editedSection?.subtitle || ""}
                onChange={(event) =>
                  updateField("subtitle", event.target.value)
                }
                className="w-full rounded-lg border p-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="e.g. Luxury Wedding Venue"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={editedSection?.description || ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="w-full rounded-lg border p-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                rows={4}
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Image {isNew && <span className="text-red-500">*</span>}
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-600">
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
                <p className="mt-2 text-xs text-gray-400">
                  Leave empty if you do not want to change the current image.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Display Order
              </label>

              <input
                type="number"
                min="1"
                value={editedSection?.sort_order || slides.length + 1}
                onChange={(event) =>
                  updateField("sort_order", Number(event.target.value))
                }
                className="w-full rounded-lg border p-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="Order number"
              />

              <p className="mt-1 text-xs text-gray-400">
                Lower number appears first.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 font-semibold">Preview</h3>

            {previewImage ? (
              <img
                src={previewImage}
                className="mb-3 h-72 w-full rounded-lg object-cover"
                alt="Wedding slide preview"
              />
            ) : (
              <div className="mb-3 flex h-72 w-full items-center justify-center rounded-lg border border-dashed bg-white text-sm text-gray-400">
                No image selected
              </div>
            )}

            {editedSection?.title && (
              <h3 className="text-lg font-bold">{editedSection.title}</h3>
            )}

            {editedSection?.subtitle && (
              <p className="text-sm font-medium text-amber-600">
                {editedSection.subtitle}
              </p>
            )}

            {editedSection?.description && (
              <p className="mt-1 text-sm text-gray-500">
                {editedSection.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            onClick={cancelEditSlide}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Wedding Hero Slides</h2>
          <p className="text-sm text-gray-500">
            Manage your wedding hero slider images and content.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={addNewSlide}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            <Plus size={16} />
            Add New Slide
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">
          <Check size={16} />
          Saved successfully!
        </div>
      )}

      {listLoading && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          Loading slides...
        </div>
      )}

      <div className="space-y-3">
        {slides?.map((slide, index) => {
          const imageUrl = getImageUrl(slide.image_url);

          return (
            <div
              key={slide.id || index}
              className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={slide.title || "Wedding slide"}
                  className="h-28 w-full rounded object-cover sm:h-24 sm:w-24"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center rounded bg-gray-100 text-xs text-gray-400 sm:h-24 sm:w-24">
                  No image
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">
                  {slide.title || "Untitled slide"}
                </h3>

                {slide.subtitle && (
                  <p className="text-sm text-amber-600">{slide.subtitle}</p>
                )}

                {slide.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {slide.description}
                  </p>
                )}

                <p className="mt-1 text-xs text-gray-400">
                  Order: {slide.sort_order || index + 1}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {index > 0 && (
                  <button
                    onClick={() => moveSlide(index, "up")}
                    className="rounded border p-2 hover:bg-gray-50"
                    title="Move Up"
                    disabled={listLoading}
                  >
                    <ArrowUp size={16} />
                  </button>
                )}

                {index < slides.length - 1 && (
                  <button
                    onClick={() => moveSlide(index, "down")}
                    className="rounded border p-2 hover:bg-gray-50"
                    title="Move Down"
                    disabled={listLoading}
                  >
                    <ArrowDown size={16} />
                  </button>
                )}

                <button
                  onClick={() => editSlide(index)}
                  className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteSlide(index)}
                  className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {(!slides || slides.length === 0) && !listLoading && (
          <div className="rounded-lg border border-dashed bg-white py-10 text-center text-gray-500">
            No slides yet. Click{" "}
            <span className="font-semibold">Add New Slide</span> to create one.
          </div>
        )}
      </div>
    </div>
  );
}