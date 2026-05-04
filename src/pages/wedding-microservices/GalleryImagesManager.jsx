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

export default function GalleryImagesManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchImages();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const result = await apiRequest("/wedding-gallery/section2", "GET");
      
      if (result.success && result.data) {
        setImages(result.data.images || []);
        setSectionId(result.data.id);
        setHasChanges(false);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateImageUrl = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
    setHasChanges(true);
    setSaved(false);
  };

  const handleFileSelect = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const newSelectedFiles = { ...selectedFiles };
    const newPreviews = { ...imagePreviews };
    
    newSelectedFiles[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    
    setSelectedFiles(newSelectedFiles);
    setImagePreviews(newPreviews);
    setHasChanges(true);
    setError(null);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = "";
    setImages(newImages);
    
    // Remove file if exists
    if (selectedFiles[index]) {
      const newSelectedFiles = { ...selectedFiles };
      delete newSelectedFiles[index];
      setSelectedFiles(newSelectedFiles);
    }
    if (imagePreviews[index]) {
      const newPreviews = { ...imagePreviews };
      delete newPreviews[index];
      setImagePreviews(newPreviews);
    }
    
    setHasChanges(true);
    setSaved(false);
  };

  const saveImages = async () => {
    setSaving(true);
    
    const formData = new FormData();
    
    // Add existing image URLs
    for (let i = 0; i < images.length; i++) {
      formData.append(`image_url_${i}`, images[i] || "");
    }
    
    // Add new files to upload
    Object.keys(selectedFiles).forEach(index => {
      formData.append(`image_${index}`, selectedFiles[index]);
    });

    try {
      let result;
      if (sectionId) {
        formData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding-gallery/section2/${sectionId}`, "POST", formData, token, true);
      } else {
        result = await apiRequest("/admin/wedding-gallery/section2", "POST", formData, token, true);
      }

      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setSelectedFiles({});
        setImagePreviews({});
        setTimeout(() => setSaved(false), 3000);
        await fetchImages();
      } else {
        setError(result.message || "Error saving images");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchImages();
    setSelectedFiles({});
    setImagePreviews({});
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
          <p className="text-gray-500 mt-2">Please login to manage gallery images</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Wedding Gallery Images</h2>
          <p className="text-sm text-gray-500">Manage up to 30 wedding gallery images</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset} 
            className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button 
            onClick={saveImages} 
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
                <Save size={15} /> Save All Images
              </>
            )}
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> All images saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Image Inputs */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Upload size={18} className="text-amber-500" />
            Images (30 maximum)
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs text-gray-400 w-8">{i + 1}.</span>
                <input
                  value={images[i] || ""}
                  onChange={(e) => updateImageUrl(i, e.target.value)}
                  placeholder={`Image ${i + 1} URL`}
                  className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition">
                  <Upload size={14} className="text-gray-600" />
                  <input type="file" accept="image/*" onChange={(e) => handleFileSelect(i, e)} className="hidden" />
                </label>
                {(images[i] || imagePreviews[i]) && (
                  <button onClick={() => removeImage(i)} className="p-2 text-red-500 hover:text-red-700">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Live Preview Grid */}
        <div className="bg-gray-50 p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Check size={18} className="text-green-500" />
            Live Preview Grid
          </h3>
          <div className="grid grid-cols-3 gap-2 max-h-[600px] overflow-y-auto">
            {Array.from({ length: 30 }).map((_, i) => {
              const previewUrl = imagePreviews[i] || getImageUrl(images[i]);
              return previewUrl ? (
                <div key={i} className="relative group">
                  <img 
                    src={previewUrl} 
                    className="h-24 w-full object-cover rounded-lg border-2 border-transparent group-hover:border-amber-500 transition-all" 
                    alt={`Preview ${i + 1}`}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{i + 1}</span>
                  </div>
                </div>
              ) : (
                <div key={i} className="h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-400 rounded-lg border border-dashed">
                  Empty
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              {images.filter(img => img).length} of 30 images saved
            </p>
            {Object.keys(selectedFiles).length > 0 && (
              <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                {Object.keys(selectedFiles).length} new images to upload
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}