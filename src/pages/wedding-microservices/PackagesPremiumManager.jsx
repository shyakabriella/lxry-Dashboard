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

export default function PackagesPremiumManager() {
  const [sectionData, setSectionData] = useState({ 
    title: "", 
    image_url: "", 
    image_file: null, 
    image_preview: null, 
    items: ["", "", "", "", "", "", ""] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

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
      const result = await apiRequest("/wedding-packages/section3", "GET");
      console.log("Fetched premium package data:", result);
      
      if (result.success && result.data) {
        setSectionData({
          title: result.data.title || "",
          image_url: result.data.image_url || "",
          image_file: null,
          image_preview: getImageUrl(result.data.image_url),
          items: result.data.items || ["", "", "", "", "", "", ""],
        });
        setSectionId(result.data.id);
        setHasChanges(false);
      } else {
        console.log("No premium package data found, using defaults");
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

  const handleItemChange = (index, value) => {
    const newItems = [...sectionData.items];
    newItems[index] = value;
    setSectionData({ ...sectionData, items: newItems });
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

    setSectionData({
      ...sectionData,
      image_file: file,
      image_preview: URL.createObjectURL(file),
      image_url: "",
    });
    setHasChanges(true);
    setError(null);
  };

  const saveSection = async () => {
    if (!sectionData.title) {
      setError("Package title is required");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", sectionData.title);
    
    // Add non-empty items
    sectionData.items.forEach((item, i) => { 
      if (item && item.trim()) {
        submitData.append(`items[${i}]`, item.trim());
      }
    });
    
    if (sectionData.image_file) {
      submitData.append("image", sectionData.image_file);
      setUploadingImage(true);
    } else if (sectionData.image_url && !sectionData.image_url.startsWith("blob:")) {
      submitData.append("image_url", sectionData.image_url);
    }

    setSaving(true);
    try {
      let result;
      if (sectionId) {
        submitData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding-packages/section3/${sectionId}`, "POST", submitData, token, true);
      } else {
        result = await apiRequest("/admin/wedding-packages/section3", "POST", submitData, token, true);
      }

      console.log("Save response:", result);

      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchSectionData();
      } else {
        setError(result.message || "Error saving section");
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          setError(errorMessages);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save section. Please check your connection.");
    } finally {
      setUploadingImage(false);
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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Premium Package</h2>
          <p className="text-sm text-gray-500">Edit package details with 7 features</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={handleReset} 
            className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button 
            onClick={saveSection} 
            disabled={!hasChanges || uploadingImage || saving} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              hasChanges && !uploadingImage && !saving
                ? "bg-amber-500 text-white hover:bg-amber-600" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {uploadingImage || saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {uploadingImage ? "Uploading..." : "Saving..."}
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
          <Check size={16} /> {sectionId ? "Package updated successfully!" : "Package created successfully!"}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Package Title *</label>
            <input
              value={sectionData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Enter package title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Package Image</label>
            <div className="flex gap-2 items-center">
              <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
                <Upload size={16} />
                Upload Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
              <input
                value={sectionData.image_url && !sectionData.image_url.startsWith("blob:") ? sectionData.image_url : ""}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Or enter image URL"
              />
            </div>
            {sectionData.image_preview && (
              <div className="mt-3 relative group">
                <img 
                  src={sectionData.image_preview} 
                  className="w-full h-40 object-cover rounded-lg border shadow-sm" 
                  alt="Preview"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />
                <button
                  onClick={() => {
                    handleInputChange("image_file", null);
                    handleInputChange("image_preview", null);
                    handleInputChange("image_url", "");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Recommended: 800x600px, max 5MB. Supports JPEG, PNG, WebP, GIF
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Package Features (7 items)</label>
            {sectionData.items.map((item, i) => (
              <input
                key={i}
                value={item}
                onChange={(e) => handleItemChange(i, e.target.value)}
                className="w-full border rounded-lg p-2.5 mb-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder={`Feature ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right - Live Preview */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {sectionData.image_preview && (
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                  src={sectionData.image_preview} 
                  className="w-full h-full object-cover" 
                  alt="Preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <h2 className="font-bold text-2xl text-gray-800 mb-4">
                {sectionData.title || "No title saved"}
              </h2>
              <ul className="space-y-2">
                {sectionData.items.map((item, i) => (
                  item && item.trim() && (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}