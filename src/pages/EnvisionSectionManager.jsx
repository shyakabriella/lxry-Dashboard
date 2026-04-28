import { useEffect, useState } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Upload,
  Trash2,
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

export default function EnvisionSectionManager() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [envisionTitle, setEnvisionTitle] = useState("");
  const [envisionSubtitle, setEnvisionSubtitle] = useState("");
  const [envisionDescription, setEnvisionDescription] = useState("");
  const [envisionImage1, setEnvisionImage1] = useState("");
  const [envisionImage2, setEnvisionImage2] = useState("");
  const [envisionImage1File, setEnvisionImage1File] = useState(null);
  const [envisionImage2File, setEnvisionImage2File] = useState(null);
  const [envisionImage1Preview, setEnvisionImage1Preview] = useState("");
  const [envisionImage2Preview, setEnvisionImage2Preview] = useState("");
  const [envisionHasChanges, setEnvisionHasChanges] = useState(false);
  const [envisionSaving, setEnvisionSaving] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError("Please login first");
    }
  }, []);

  const fetchEnvisionData = async () => {
    try {
      const result = await apiRequest("/wedding/section1/venue", "GET");
      if (result.success && result.data) {
        return result.data;
      }
    } catch (err) {
      console.error("Error fetching envision data:", err);
    }
    return null;
  };

  useEffect(() => {
    if (token) {
      const loadData = async () => {
        const envisionData = await fetchEnvisionData();
        if (envisionData) {
          setEnvisionTitle(envisionData.title || "");
          setEnvisionSubtitle(envisionData.subtitle || "");
          setEnvisionDescription(envisionData.description || "");
          
          const img1 = envisionData.images?.[0] || "";
          const img2 = envisionData.images?.[1] || "";
          
          const displayImg1 = getImageUrl(img1);
          const displayImg2 = getImageUrl(img2);
          
          setEnvisionImage1(img1);
          setEnvisionImage2(img2);
          setEnvisionImage1Preview(displayImg1);
          setEnvisionImage2Preview(displayImg2);
        }
      };
      loadData();
    }
  }, [token]);

  const resetEnvisionForm = () => {
    setEnvisionTitle("");
    setEnvisionSubtitle("");
    setEnvisionDescription("");
    setEnvisionImage1("");
    setEnvisionImage2("");
    setEnvisionImage1File(null);
    setEnvisionImage2File(null);
    setEnvisionImage1Preview("");
    setEnvisionImage2Preview("");
    setEnvisionHasChanges(false);
    setSaved(false);
  };

  const handleEnvisionImage1FileSelect = (e) => {
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
      setEnvisionImage1File(file);
      setEnvisionImage1Preview(URL.createObjectURL(file));
      setEnvisionHasChanges(true);
      setSaved(false);
      setError(null);
    }
  };

  const handleEnvisionImage2FileSelect = (e) => {
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
      setEnvisionImage2File(file);
      setEnvisionImage2Preview(URL.createObjectURL(file));
      setEnvisionHasChanges(true);
      setSaved(false);
      setError(null);
    }
  };

  const deleteEnvisionImage1 = () => {
    setEnvisionImage1("");
    setEnvisionImage1File(null);
    setEnvisionImage1Preview("");
    setEnvisionHasChanges(true);
    setSaved(false);
  };

  const deleteEnvisionImage2 = () => {
    setEnvisionImage2("");
    setEnvisionImage2File(null);
    setEnvisionImage2Preview("");
    setEnvisionHasChanges(true);
    setSaved(false);
  };

  const deleteEnvisionSection = async () => {
    if (!confirm("Delete the entire Envision Your Special Day section? This action cannot be undone.")) return;
    
    try {
      const existing = await apiRequest("/wedding/section1/venue", "GET");
      if (existing.success && existing.data && existing.data.id) {
        const result = await apiRequest(`/admin/wedding/section1/venue/${existing.data.id}`, "DELETE", null, token);
        if (result.success) {
          resetEnvisionForm();
          setEnvisionHasChanges(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        } else {
          setError(result.message || "Error deleting section");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const saveEnvisionSection = async () => {
    setEnvisionSaving(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("title", envisionTitle);
    formData.append("subtitle", envisionSubtitle);
    formData.append("description", envisionDescription);
    
    if (envisionImage1File) {
      formData.append("image0", envisionImage1File);
    } else if (envisionImage1) {
      formData.append("existing_image0", envisionImage1);
    } else {
      formData.append("existing_image0", "");
    }
    
    if (envisionImage2File) {
      formData.append("image1", envisionImage2File);
    } else if (envisionImage2) {
      formData.append("existing_image1", envisionImage2);
    } else {
      formData.append("existing_image1", "");
    }
    
    try {
      const existing = await apiRequest("/wedding/section1/venue", "GET");
      
      let result;
      if (existing.success && existing.data && existing.data.id) {
        formData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding/section1/venue/${existing.data.id}`, "POST", formData, token, true);
      } else {
        result = await apiRequest("/admin/wedding/section1/venue", "POST", formData, token, true);
      }
      
      if (result.success) {
        const freshData = result.data;
        
        setEnvisionTitle(freshData.title || "");
        setEnvisionSubtitle(freshData.subtitle || "");
        setEnvisionDescription(freshData.description || "");
        
        const img1 = freshData.images?.[0] || "";
        const img2 = freshData.images?.[1] || "";
        
        setEnvisionImage1(img1);
        setEnvisionImage2(img2);
        setEnvisionImage1Preview(getImageUrl(img1));
        setEnvisionImage2Preview(getImageUrl(img2));
        
        setEnvisionImage1File(null);
        setEnvisionImage2File(null);
        setEnvisionHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(result.message || "Error saving data");
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          setError(errorMessages);
        }
      }
    } catch (err) {
      setError("Network error: " + err.message);
      console.error("Save error:", err);
    } finally {
      setEnvisionSaving(false);
    }
  };

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Envision Your Special Day Section</h2>
          <p className="text-sm text-gray-500">Edit the content for this section (Upload or enter URL)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetEnvisionForm} className="px-3 py-2 border rounded-lg flex items-center gap-2">
            <RotateCcw size={15} /> Reset
          </button>
          <button
            onClick={deleteEnvisionSection}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <Trash2 size={15} /> Delete Section
          </button>
          <button 
            onClick={saveEnvisionSection} 
            disabled={!envisionHasChanges && !envisionSaving} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${(envisionHasChanges || envisionSaving) ? "bg-amber-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
          >
            {envisionSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
            {envisionSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
          <Check size={16} /> Saved successfully!
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-6 rounded-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={envisionTitle}
              onChange={(e) => setEnvisionTitle(e.target.value) || setEnvisionHasChanges(true)}
              className="w-full border rounded-lg p-2.5"
              placeholder="e.g., Envision Your Special Day"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              value={envisionSubtitle}
              onChange={(e) => setEnvisionSubtitle(e.target.value) || setEnvisionHasChanges(true)}
              className="w-full border rounded-lg p-2.5"
              placeholder="e.g., Wedding Venues Luxury"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={envisionDescription}
              onChange={(e) => setEnvisionDescription(e.target.value) || setEnvisionHasChanges(true)}
              className="w-full border rounded-lg p-2.5"
              rows={4}
              placeholder="Enter description"
            />
          </div>
          
          {/* Image 1 */}
          <div>
            <label className="block text-sm font-medium mb-1">Image 1 (Left Large Image)</label>
            <div className="flex gap-2 items-center mb-2">
              <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
                <Upload size={16} />
                Upload Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleEnvisionImage1FileSelect} 
                  className="hidden" 
                />
              </label>
              <input
                value={envisionImage1}
                onChange={(e) => {
                  setEnvisionImage1(e.target.value);
                  setEnvisionHasChanges(true);
                  setEnvisionImage1Preview(e.target.value);
                }}
                className="flex-1 border rounded-lg p-2.5"
                placeholder="Or enter image URL"
              />
            </div>
            {envisionImage1Preview && (
              <div className="relative mt-2">
                <img src={envisionImage1Preview} className="w-full h-32 object-cover rounded-lg" alt="Image 1" />
                <button
                  onClick={deleteEnvisionImage1}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          
          {/* Image 2 */}
          <div>
            <label className="block text-sm font-medium mb-1">Image 2 (Bottom Right Small Image)</label>
            <div className="flex gap-2 items-center mb-2">
              <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
                <Upload size={16} />
                Upload Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleEnvisionImage2FileSelect} 
                  className="hidden" 
                />
              </label>
              <input
                value={envisionImage2}
                onChange={(e) => {
                  setEnvisionImage2(e.target.value);
                  setEnvisionHasChanges(true);
                  setEnvisionImage2Preview(e.target.value);
                }}
                className="flex-1 border rounded-lg p-2.5"
                placeholder="Or enter image URL"
              />
            </div>
            {envisionImage2Preview && (
              <div className="relative mt-2">
                <img src={envisionImage2Preview} className="w-full h-32 object-cover rounded-lg" alt="Image 2" />
                <button
                  onClick={deleteEnvisionImage2}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - PREVIEW */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Preview</h3>
          {envisionImage1Preview && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Left Large Image:</p>
              <img src={envisionImage1Preview} className="rounded-lg mb-3 w-full h-64 object-cover" alt="Preview 1" />
            </div>
          )}
          {envisionImage2Preview && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Bottom Right Small Image:</p>
              <img src={envisionImage2Preview} className="rounded-lg mb-3 w-full h-48 object-cover" alt="Preview 2" />
            </div>
          )}
          {!envisionImage1Preview && !envisionImage2Preview && (
            <div className="text-center py-10 text-gray-400">
              <p>No images to preview</p>
              <p className="text-xs mt-1">Upload images or enter URLs above</p>
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h2 className="font-bold text-xl">{envisionTitle || "No Title"}</h2>
            <p className="text-amber-600 text-sm">{envisionSubtitle || "No Subtitle"}</p>
            <p className="text-gray-600 text-sm mt-2">{envisionDescription || "No Description"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}