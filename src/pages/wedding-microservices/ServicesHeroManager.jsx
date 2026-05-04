import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, AlertCircle, Upload, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "/storage";

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
  
  if (method === "GET" && response.status === 404) {
    return { success: false, message: "Not found" };
  }
  
  if (!response.ok) {
    const errorText = await response.text();
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

export default function ServicesHeroManager() {
  const [sectionData, setSectionData] = useState({
    title: "",
    image_url: "",
    image_file: null,
    image_preview: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      const result = await apiRequest("/wedding-services/hero", "GET");
      
      if (result.success && result.data) {
        const data = result.data;
        setSectionData({
          title: data.title || "",
          image_url: data.image_url || "",
          image_file: null,
          image_preview: getImageUrl(data.image_url),
        });
        setSectionId(data.id);
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
      setError("Please select a valid image");
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
      setError("Title is required");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", sectionData.title);

    if (sectionData.image_file) {
      submitData.append("image", sectionData.image_file);
      setUploadingImage(true);
    } else if (sectionData.image_url && !sectionData.image_url.startsWith("blob:")) {
      submitData.append("image_url", sectionData.image_url);
    }

    try {
      let result;
      if (sectionId) {
        submitData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding-services/hero/${sectionId}`, "POST", submitData, token, true);
      } else {
        result = await apiRequest("/admin/wedding-services/hero", "POST", submitData, token, true);
      }

      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchSectionData();
      } else {
        setError(result.message || "Error saving section");
      }
    } catch (err) {
      setError("Failed to save section");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionId) return;
    if (!confirm("Delete this section?")) return;

    setDeleting(true);
    try {
      const result = await apiRequest(`/admin/wedding-services/hero/${sectionId}`, "DELETE", null, token);
      if (result.success) {
        setSectionData({ title: "", image_url: "", image_file: null, image_preview: null });
        setSectionId(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError("Failed to delete section");
    } finally {
      setDeleting(false);
    }
  };

  const handleReset = () => {
    fetchSectionData();
    setError(null);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" /></div>;
  if (!token) return <div className="text-center py-20 text-red-500">Please login first</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Services Hero Section</h2>
          <p className="text-sm text-gray-500">Edit the hero banner content</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {sectionId && <button onClick={handleDelete} disabled={deleting} className="px-3 py-2 bg-red-500 text-white rounded-lg">Delete</button>}
          <button onClick={handleReset} className="px-3 py-2 border rounded-lg">Reset</button>
          <button onClick={saveSection} disabled={!hasChanges || uploadingImage} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}>
            {uploadingImage ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {saved && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">Saved!</div>}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-xl border">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input value={sectionData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Enter title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <div className="flex gap-2">
              <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg">Upload Image<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
              <input value={sectionData.image_url} onChange={(e) => handleInputChange("image_url", e.target.value)} className="flex-1 border rounded-lg p-2.5" placeholder="Or enter URL" />
            </div>
            {sectionData.image_preview && <img src={sectionData.image_preview} className="mt-3 h-40 w-full object-cover rounded-lg" alt="Preview" />}
          </div>
        </div>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Preview</h3>
          {sectionData.image_preview && <img src={sectionData.image_preview} className="w-full h-48 object-cover rounded-lg mb-3" />}
          <h2 className="text-2xl font-bold">{sectionData.title || "No title"}</h2>
        </div>
      </div>
    </div>
  );
}