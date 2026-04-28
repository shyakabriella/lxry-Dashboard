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

// Use environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

const apiRequest = async (url, method = "GET", body = null, token = null, isFormData = false) => {
  const options = {
    method,
    headers: {},
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    options.headers["Content-Type"] = "application/json";
    if (body) {
      options.body = JSON.stringify(body);
    }
  } else {
    options.body = body;
  }

  const response = await fetch(`${API_URL}${url}`, options);
  return await response.json();
};

// Helper function to get full image URL
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage')) return `${STORAGE_URL}${path}`;
  return `${STORAGE_URL}/${path}`;
};

export default function HeroSectionManager() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [editedSection, setEditedSection] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
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
      if (result.success) {
        const sorted = result.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        return sorted;
      }
      return [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  useEffect(() => {
    if (token) {
      const loadData = async () => {
        setLoading(true);
        const fetchedSlides = await fetchSlides();
        setSlides(fetchedSlides);
        setEditedSection({ images: fetchedSlides.map(s => s.image_url) });
        setLoading(false);
      };
      loadData();
    }
  }, [token]);

  const updateField = (field, value) => {
    setEditedSection({ ...editedSection, [field]: value });
    setHasChanges(true);
    setSaved(false);
  };

  const addNewSlide = () => {
    setEditingSlideIndex(-1);
    setSelectedFile(null);
    setImagePreview(null);
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
    setEditedSection({ ...slides[index] });
    setHasChanges(false);
  };

  const cancelEditSlide = () => {
    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setEditedSection({ images: slides.map(s => s.image_url) });
    setHasChanges(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const saveSlide = async () => {
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("title", editedSection.title || "");
    formData.append("subtitle", editedSection.subtitle || "");
    formData.append("description", editedSection.description || "");
    formData.append("sort_order", editedSection.sort_order || slides.length + 1);
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    let result;
    if (editingSlideIndex === -1) {
      result = await apiRequest("/admin/wedding/slides", "POST", formData, token, true);
    } else {
      formData.append("_method", "PUT");
      const slideId = slides[editingSlideIndex].id;
      result = await apiRequest(`/admin/wedding/slides/${slideId}`, "POST", formData, token, true);
    }
    
    if (result.success) {
      const freshSlides = await fetchSlides();
      setSlides(freshSlides);
      setEditingSlideIndex(null);
      setSelectedFile(null);
      setImagePreview(null);
      setEditedSection({ images: freshSlides.map(s => s.image_url) });
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(result.message || "Error saving slide");
      if (result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(", ");
        setError(errorMessages);
      }
    }
    setUploading(false);
  };

  const deleteSlide = async (index) => {
    if (!confirm("Delete this slide?")) return;
    const slideId = slides[index].id;
    const result = await apiRequest(`/admin/wedding/slides/${slideId}`, "DELETE", null, token);
    if (result.success) {
      const freshSlides = await fetchSlides();
      setSlides(freshSlides);
      setEditedSection({ images: freshSlides.map(s => s.image_url) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(result.message || "Error deleting slide");
    }
  };

  const moveSlide = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[newIndex];
    newSlides[newIndex] = temp;

    for (let i = 0; i < newSlides.length; i++) {
      await apiRequest(`/admin/wedding/slides/${newSlides[i].id}`, "PUT", { sort_order: i + 1 }, token);
    }

    const freshSlides = await fetchSlides();
    setSlides(freshSlides);
    setEditedSection({ images: freshSlides.map(s => s.image_url) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSave = () => {
    if (editingSlideIndex !== null) {
      saveSlide();
    }
  };

  const handleReset = () => {
    setEditedSection({ images: slides.map(s => s.image_url) });
    setEditingSlideIndex(null);
    setSelectedFile(null);
    setImagePreview(null);
    setHasChanges(true);
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
          <p className="text-gray-500 mt-2">Please login to manage wedding content</p>
        </div>
      </div>
    );
  }

  if (editingSlideIndex !== null) {
    const isNew = editingSlideIndex === -1;
    const previewImage = imagePreview || getImageUrl(editedSection?.image_url);
    
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{isNew ? "Add New Slide" : "Edit Slide"}</h2>
            <p className="text-sm text-gray-500">Upload an image from your computer for the hero slider</p>
          </div>
          <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4 bg-white p-6 rounded-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                value={editedSection?.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="e.g., Exclusive Wedding Experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                value={editedSection?.subtitle || ""}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="e.g., Luxury Wedding Venue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editedSection?.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full border p-2 rounded"
                rows={4}
                placeholder="Enter description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <div className="flex gap-2">
                <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm w-full justify-center">
                  <Upload size={16} />
                  Select Image from Computer
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              </div>
              {selectedFile && (
                <p className="text-xs text-emerald-600 mt-2">Selected: {selectedFile.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input
                type="number"
                value={editedSection?.sort_order || slides.length + 1}
                onChange={(e) => updateField("sort_order", parseInt(e.target.value))}
                className="w-full border p-2 rounded"
                placeholder="Order number (lower = appears first)"
              />
              <p className="text-xs text-gray-400 mt-1">Slides are displayed in ascending order</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Preview</h3>
            {previewImage && <img src={previewImage} className="rounded mb-3 w-full" alt="Preview" />}
            {editedSection?.title && <h3 className="font-bold text-lg">{editedSection.title}</h3>}
            {editedSection?.subtitle && <p className="text-sm text-amber-600">{editedSection.subtitle}</p>}
            {editedSection?.description && <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleSave} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
            {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
            {isNew ? "Create Slide" : "Update Slide"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Wedding Hero Slides</h2>
          <p className="text-sm text-gray-500">Manage your wedding hero slider images and content</p>
        </div>
        <button
          onClick={addNewSlide}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus size={16} /> Add New Slide
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> Saved successfully!
        </div>
      )}

      <div className="space-y-3">
        {slides?.map((slide, index) => {
          const imageUrl = getImageUrl(slide.image_url);
            
          return (
            <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center">
              <img src={imageUrl} alt={slide.title} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{slide.title}</h3>
                <p className="text-sm text-gray-500">{slide.subtitle}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{slide.description}</p>
                <p className="text-xs text-gray-400 mt-1">Order: {slide.sort_order || index + 1}</p>
              </div>
              <div className="flex gap-2">
                {index > 0 && (
                  <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
                    <ArrowUp size={16} />
                  </button>
                )}
                {index < slides.length - 1 && (
                  <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
                    <ArrowDown size={16} />
                  </button>
                )}
                <button onClick={() => editSlide(index)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
                <button onClick={() => deleteSlide(index)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
              </div>
            </div>
          );
        })}
        {(!slides || slides.length === 0) && (
          <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
        )}
      </div>
    </div>
  );
}