import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, AlertCircle, Upload, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "/storage";

const apiRequest = async (url, method = "GET", body = null, token = null, isFormData = false) => {
  const options = { method, headers: {} };
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  if (isFormData) options.body = body;
  else {
    options.headers["Content-Type"] = "application/json";
    if (body) options.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_URL}${url}`, options);
  if (method === "GET" && response.status === 404) return { success: false };
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage')) return `${STORAGE_URL}${path}`;
  return `${STORAGE_URL}/${path}`;
};

export default function GalleryHeroManager() {
  const [sectionData, setSectionData] = useState({ title: "", background_image: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchSectionData();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchSectionData = async () => {
    try {
      setLoading(true);
      const result = await apiRequest("/wedding-gallery/hero", "GET");
      
      if (result.success && result.data) {
        setSectionData({
          title: result.data.title || "",
          background_image: result.data.background_image || "",
        });
        setSectionId(result.data.id);
        setImagePreview(getImageUrl(result.data.background_image));
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSectionData({ ...sectionData, [field]: value });
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setHasChanges(true);
    setError(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setSectionData({ ...sectionData, background_image: "" });
    setHasChanges(true);
  };

  const saveSection = async () => {
    if (!sectionData.title) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("title", sectionData.title);
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (sectionData.background_image && sectionData.background_image.startsWith('http')) {
      formData.append("image_url", sectionData.background_image);
    }

    try {
      let result;
      if (sectionId) {
        formData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding-gallery/hero/${sectionId}`, "POST", formData, token, true);
      } else {
        result = await apiRequest("/admin/wedding-gallery/hero", "POST", formData, token, true);
      }

      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchSectionData();
        setImageFile(null);
      } else {
        setError(result.message || "Error saving section");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchSectionData();
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
          <p className="text-gray-500 mt-2">Please login to manage this section</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Gallery Hero Section</h2>
          <p className="text-sm text-gray-500">Manage the hero banner for wedding gallery</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset} 
            className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button 
            onClick={saveSection} 
            disabled={!hasChanges || saving} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              hasChanges && !saving
                ? "bg-amber-500 text-white hover:bg-amber-600" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> Hero section saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              value={sectionData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Enter hero title (e.g., Wedding Gallery)"
            />
            <p className="text-xs text-gray-500 mt-1">Main heading displayed on the hero banner</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hero Image</label>
            <div className="flex gap-2 items-center">
              <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
                <Upload size={16} />
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <input
                value={sectionData.background_image}
                onChange={(e) => handleInputChange("background_image", e.target.value)}
                className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Or enter image URL"
              />
              {imagePreview && (
                <button onClick={removeImage} className="p-2 text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: 1920x800px, max 5MB. Supports JPEG, PNG, WebP, GIF
            </p>
          </div>
        </div>

        {/* Right - Live Preview */}
        <div className="bg-gray-50 p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {imagePreview ? (
              <div className="relative h-52 overflow-hidden">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              </div>
            ) : (
              <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400">
                No image selected
              </div>
            )}
            
            <div className="p-6 text-center">
              <p className="text-[13px] uppercase tracking-[0.2em] text-amber-600 font-medium">
                Wedding Gallery
              </p>
              <h2 className="font-bold text-2xl text-gray-800 mt-2">
                {sectionData.title || "No title saved"}
              </h2>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#f1f0eb] rounded-lg">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Website preview - How it appears on the site
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}