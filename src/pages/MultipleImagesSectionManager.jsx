import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Upload,
  Trash2,
  Plus,
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

  if (isFormData) {
    options.body = body;
  } else {
    options.headers["Content-Type"] = "application/json";
    if (body) {
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_URL}${url}`, options);
  
  if (method === "GET" && url.includes("/wedding/section") && response.status === 404) {
    return { success: false, message: "Not found" };
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage')) return `${STORAGE_URL}${path}`;
  return `${STORAGE_URL}/${path}`;
};

export default function MultipleImagesSectionManager() {
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchGalleryData();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchGalleryData = async () => {
    try {
      const result = await apiRequest("/wedding/section6/gallery", "GET");
      
      if (result.success && result.data) {
        const data = result.data;
        const processedImages = (data.images || []).map(img => getImageUrl(img));
        setImages(processedImages);
        setSectionId(data.id);
      } else {
        setSectionId(null);
        setImages([]);
      }
      setHasChanges(false);
    } catch (err) {
      console.error("Error fetching gallery data:", err);
      if (!err.message?.includes("404")) {
        setError("Failed to load gallery data");
      }
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    setImages([...images, ""]);
    setHasChanges(true);
    setSaved(false);
  };

  const updateImageUrl = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
    setHasChanges(true);
    setSaved(false);
  };

  const handleImageUpload = (index, file) => {
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

    setImageFiles(prev => ({ ...prev, [index]: file }));
    const preview = URL.createObjectURL(file);
    const newImages = [...images];
    newImages[index] = preview;
    setImages(newImages);
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const handleAddNewImageUpload = (e) => {
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

    const preview = URL.createObjectURL(file);
    const newIndex = images.length;
    setImages([...images, preview]);
    setImageFiles(prev => ({ ...prev, [newIndex]: file }));
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newImageFiles = { ...imageFiles };
    delete newImageFiles[index];
    const reindexed = {};
    Object.keys(newImageFiles).forEach(key => {
      const numKey = parseInt(key);
      if (numKey > index) {
        reindexed[numKey - 1] = newImageFiles[numKey];
      } else if (numKey < index) {
        reindexed[numKey] = newImageFiles[numKey];
      }
    });
    setImageFiles(reindexed);
    setHasChanges(true);
    setSaved(false);
  };

  const saveGallery = async () => {
    setUploadingImages(true);
    setError(null);

    const submitData = new FormData();
    
    // Add all image files
    Object.entries(imageFiles).forEach(([index, file]) => {
      submitData.append(`images[${index}]`, file);
    });
    
    // Add existing image URLs (non-blob URLs)
    const imageUrls = images.filter(img => img && !img.startsWith('blob:'));
    if (imageUrls.length > 0) {
      submitData.append('existing_images', JSON.stringify(imageUrls));
    }

    try {
      let result;
      if (sectionId) {
        submitData.append('_method', 'PUT');
        result = await apiRequest(`/admin/wedding/section6/gallery/${sectionId}`, "POST", submitData, token, true);
      } else {
        result = await apiRequest("/admin/wedding/section6/gallery", "POST", submitData, token, true);
      }

      if (result.success) {
        setImageFiles({});
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchGalleryData();
      } else {
        setError(result.message || "Error saving gallery");
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          setError(errorMessages);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save gallery. Please check your connection.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionId) {
      setError("No gallery to delete");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this gallery? This action cannot be undone.")) {
      return;
    }

    setUploadingImages(true);
    setError(null);

    try {
      const result = await apiRequest(`/admin/wedding/section6/gallery/${sectionId}`, "DELETE", null, token);
      
      if (result.success) {
        setImages([]);
        setImageFiles({});
        setSectionId(null);
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.message || "Error deleting gallery");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete gallery");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleReset = () => {
    if (sectionId) {
      fetchGalleryData();
    } else {
      setImages([]);
      setImageFiles({});
      setHasChanges(true);
    }
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
          <p className="text-gray-500 mt-2">Please login to manage gallery</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Wedding Gallery</h2>
          <p className="text-sm text-gray-500">Manage your wedding gallery images</p>
        </div>
        <div className="flex gap-2">
          {sectionId && (
            <button 
              onClick={handleDelete}
              disabled={uploadingImages}
              className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition disabled:bg-red-300"
            >
              <Trash2 size={15} />
              {uploadingImages ? "Deleting..." : "Delete Gallery"}
            </button>
          )}
          <button 
            onClick={handleReset} 
            className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button 
            onClick={saveGallery} 
            disabled={!hasChanges || uploadingImages} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              hasChanges && !uploadingImages
                ? "bg-amber-500 text-white hover:bg-amber-600" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {uploadingImages ? (
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
          <Check size={16} /> Gallery saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
          <label className="block text-sm font-medium mb-2">Images</label>
          
          {images.map((img, idx) => (
            <div key={idx} className="flex gap-2 mb-3">
              <div className="flex-1 flex gap-2">
                <input
                  value={img || ""}
                  onChange={(e) => updateImageUrl(idx, e.target.value)}
                  className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder={`Image ${idx + 1} URL (optional if uploading)`}
                />
                <label className="cursor-pointer bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1 text-sm">
                  <Upload size={14} />
                  Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(idx, e.target.files[0])}
                    className="hidden" 
                  />
                </label>
              </div>
              <button 
                onClick={() => removeImage(idx)} 
                className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={addImageUrl} 
              className="text-sm text-amber-600 flex items-center gap-1 hover:text-amber-700 transition"
            >
              <Plus size={14} /> Add Image URL
            </button>
            
            <label className="text-sm text-amber-600 flex items-center gap-1 hover:text-amber-700 transition cursor-pointer">
              <Upload size={14} /> Upload New Image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAddNewImageUpload}
                className="hidden" 
              />
            </label>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            You can either enter image URLs or upload images directly.<br/>
            Max 5MB per image. Supports JPEG, PNG, WebP, GIF.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Gallery Preview</h3>
          
          {images.length > 0 && images.some(img => img) ? (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                img && (
                  <div key={idx} className="relative group">
                    <img 
                      src={getImageUrl(img)} 
                      className="rounded-lg w-full h-32 object-cover border shadow-sm" 
                      alt={`Gallery ${idx + 1}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Invalid+Image";
                      }}
                    />
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>No images added yet</p>
              <p className="text-xs mt-1">Add image URLs or upload images above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}