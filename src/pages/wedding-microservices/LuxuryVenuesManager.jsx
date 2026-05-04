// import { useState, useEffect } from "react";
// import { loadSiteData, saveSiteData } from "../../data/store";
// import { Save, RotateCcw, Check } from "lucide-react";

// const emptyState = {
//   title: "",
//   subtitle: "",
//   description: "",
// };

// export default function LuxuryVenuesManager() {
//   const [data, setData] = useState(emptyState);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [saved, setSaved] = useState(false);

//   useEffect(() => {
//     const siteData = loadSiteData();
//     const savedData = siteData?.weddingVenues?.luxury_wedding_venues_in_kigali_rwanda || emptyState;
//     setData(savedData);
//   }, []);

//   const updateField = (field, value) => {
//     setData({ ...data, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const handleSave = () => {
//     const siteData = loadSiteData();
//     const updated = {
//       ...siteData,
//       weddingVenues: {
//         ...siteData?.weddingVenues,
//         luxury_wedding_venues_in_kigali_rwanda: data,
//       },
//     };
//     saveSiteData(updated);
//     setHasChanges(false);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   const handleReset = () => {
//     setData(emptyState);
//     setHasChanges(true);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold">Luxury Wedding Venues</h2>
//           <p className="text-sm text-gray-500">Edit luxury venues content</p>
//         </div>
//         <div className="flex gap-2">
//           <button onClick={handleReset} className="px-3 py-2 border rounded-lg flex items-center gap-2">
//             <RotateCcw size={15} /> Reset
//           </button>
//           <button onClick={handleSave} disabled={!hasChanges} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}>
//             <Save size={15} /> Save Changes
//           </button>
//         </div>
//       </div>

//       {saved && (
//         <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
//           <Check size={16} /> Saved successfully!
//         </div>
//       )}

//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="space-y-4 bg-white p-6 rounded-xl border">
//           <div>
//             <label className="block text-sm font-medium mb-1">Title</label>
//             <input
//               value={data.title || ""}
//               onChange={(e) => updateField("title", e.target.value)}
//               className="w-full border rounded-lg p-2.5"
//               placeholder="Enter title"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Subtitle</label>
//             <input
//               value={data.subtitle || ""}
//               onChange={(e) => updateField("subtitle", e.target.value)}
//               className="w-full border rounded-lg p-2.5"
//               placeholder="Enter subtitle"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               value={data.description || ""}
//               onChange={(e) => updateField("description", e.target.value)}
//               className="w-full border rounded-lg p-2.5"
//               rows={4}
//               placeholder="Enter description"
//             />
//           </div>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-xl">
//           <h3 className="font-semibold mb-3">Preview</h3>
//           <h3 className="font-bold text-lg">{data.title || "No title"}</h3>
//           <p className="text-amber-600 text-sm">{data.subtitle}</p>
//           <p className="text-gray-600 text-sm mt-2">{data.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


























import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, AlertCircle } from "lucide-react";

// Use environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiRequest = async (url, method = "GET", body = null, token = null) => {
  const options = {
    method,
    headers: {},
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${url}`, options);
  
  if (method === "GET" && response.status === 404) {
    return { success: false, message: "Not found" };
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};

export default function LuxuryVenuesManager() {
  const [sectionData, setSectionData] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
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
      const result = await apiRequest("/wedding-venues/section1", "GET");
      
      if (result.success && result.data) {
        const data = result.data;
        setSectionData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
        });
        setSectionId(data.id);
        setHasChanges(false);
      } else {
        setSectionId(null);
        setSectionData({
          title: "",
          subtitle: "",
          description: "",
        });
      }
    } catch (err) {
      console.error("Error fetching section data:", err);
      if (!err.message?.includes("404")) {
        setError("Failed to load section data");
      }
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

  const saveSection = async () => {
    if (!sectionData.title) {
      setError("Title is required");
      return;
    }
    if (!sectionData.subtitle) {
      setError("Subtitle is required");
      return;
    }
    if (!sectionData.description) {
      setError("Description is required");
      return;
    }

    const submitData = {
      title: sectionData.title,
      subtitle: sectionData.subtitle,
      description: sectionData.description,
    };

    setSaving(true);
    
    try {
      let result;
      if (sectionId) {
        result = await apiRequest(`/admin/wedding-venues/section1/${sectionId}`, "PUT", submitData, token);
      } else {
        result = await apiRequest("/admin/wedding-venues/section1", "POST", submitData, token);
      }

      if (result.success) {
        if (result.data.id) setSectionId(result.data.id);
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
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionId) {
      setError("No section to delete");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this section? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const result = await apiRequest(`/admin/wedding-venues/section1/${sectionId}`, "DELETE", null, token);
      
      if (result.success) {
        setSectionData({
          title: "",
          subtitle: "",
          description: "",
        });
        setSectionId(null);
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.message || "Error deleting section");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete section");
    } finally {
      setDeleting(false);
    }
  };

  const handleReset = () => {
    if (sectionId) {
      fetchSectionData();
    } else {
      setSectionData({
        title: "",
        subtitle: "",
        description: "",
      });
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
          <p className="text-gray-500 mt-2">Please login to manage this section</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Luxury Wedding Venues</h2>
          <p className="text-sm text-gray-500">Edit luxury venues content (No image required)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {sectionId && (
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition disabled:bg-red-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 4v-2h8v2" />
              </svg>
              {deleting ? "Deleting..." : "Delete Section"}
            </button>
          )}
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
          <Check size={16} /> {sectionId ? "Section updated successfully!" : "Section created successfully!"}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              value={sectionData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle *</label>
            <input
              value={sectionData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Enter subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={sectionData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              rows={4}
              placeholder="Enter description"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-sm p-6">
            <p className="text-[13px] uppercase tracking-[0.2em] text-amber-600 font-medium">
              Luxury Wedding Venues
            </p>
            <h2 className="font-bold text-2xl text-gray-800 mt-2 mb-3">
              {sectionData.title || "No title saved"}
            </h2>
            <p className="text-amber-600 text-sm font-medium mb-4">
              {sectionData.subtitle || "No subtitle"}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {sectionData.description || "No description"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}