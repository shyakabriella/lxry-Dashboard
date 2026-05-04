// import { useState, useEffect } from "react";
// import { Save, RotateCcw, Check, AlertCircle } from "lucide-react";

// const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// const apiRequest = async (url, method = "GET", body = null, token = null) => {
//   const options = { method, headers: {} };
//   if (token) options.headers["Authorization"] = `Bearer ${token}`;
//   if (body) {
//     options.headers["Content-Type"] = "application/json";
//     options.body = JSON.stringify(body);
//   }
//   const response = await fetch(`${API_URL}${url}`, options);
//   if (method === "GET" && response.status === 404) return { success: false };
//   if (!response.ok) throw new Error(`HTTP ${response.status}`);
//   return await response.json();
// };

// export default function ServicesLuxuryManager() {
//   const [sectionData, setSectionData] = useState({ title: "", subtitle: "" });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [sectionId, setSectionId] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//       fetchSectionData();
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   const fetchSectionData = async () => {
//     try {
//       const result = await apiRequest("/wedding-services/luxury", "GET");
//       if (result.success && result.data) {
//         setSectionData({ title: result.data.title || "", subtitle: result.data.subtitle || "" });
//         setSectionId(result.data.id);
//         setHasChanges(false);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setSectionData({ ...sectionData, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const saveSection = async () => {
//     const submitData = { title: sectionData.title, subtitle: sectionData.subtitle };
//     try {
//       let result;
//       if (sectionId) {
//         result = await apiRequest(`/admin/wedding-services/luxury/${sectionId}`, "PUT", submitData, token);
//       } else {
//         result = await apiRequest("/admin/wedding-services/luxury", "POST", submitData, token);
//       }
//       if (result.success) {
//         setHasChanges(false);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 3000);
//         await fetchSectionData();
//       }
//     } catch (err) {
//       setError("Failed to save");
//     }
//   };

//   if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" /></div>;
//   if (!token) return <div className="text-center py-20 text-red-500">Please login first</div>;

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex justify-between items-center">
//         <div><h2 className="text-xl font-bold">Luxury Wedding Services</h2><p className="text-sm text-gray-500">Edit title and subtitle (no image)</p></div>
//         <div className="flex gap-2">
//           <button onClick={() => fetchSectionData()} className="px-3 py-2 border rounded-lg">Reset</button>
//           <button onClick={saveSection} disabled={!hasChanges} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}>Save</button>
//         </div>
//       </div>
//       {saved && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">Saved!</div>}
//       {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="space-y-4 bg-white p-6 rounded-xl border">
//           <div><label className="block text-sm font-medium mb-1">Title</label><input value={sectionData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
//           <div><label className="block text-sm font-medium mb-1">Subtitle</label><input value={sectionData.subtitle} onChange={(e) => handleInputChange("subtitle", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
//         </div>
//         <div className="bg-gray-50 p-6 rounded-xl border">
//           <h3 className="font-semibold mb-4">Preview</h3>
//           <h2 className="text-2xl font-bold">{sectionData.title || "No title"}</h2>
//           <p className="text-amber-600">{sectionData.subtitle || "No subtitle"}</p>
//         </div>
//       </div>
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiRequest = async (url, method = "GET", body = null, token = null) => {
  const options = { method, headers: {} };
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_URL}${url}`, options);
  if (method === "GET" && response.status === 404) return { success: false };
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
};

export default function ServicesLuxuryManager() {
  const [sectionData, setSectionData] = useState({ title: "", subtitle: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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
      const result = await apiRequest("/wedding-services/section1", "GET");
      if (result.success && result.data) {
        setSectionData({
          title: result.data.title || "",
          subtitle: result.data.subtitle || "",
          description: result.data.description || "",
        });
        setSectionId(result.data.id);
        setHasChanges(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSectionData({ ...sectionData, [field]: value });
    setHasChanges(true);
    setSaved(false);
  };

  const saveSection = async () => {
    setSaving(true);
    const submitData = {
      title: sectionData.title,
      subtitle: sectionData.subtitle,
      description: sectionData.description,
    };
    try {
      let result;
      if (sectionId) {
        result = await apiRequest(`/admin/wedding-services/section1/${sectionId}`, "PUT", submitData, token);
      } else {
        result = await apiRequest("/admin/wedding-services/section1", "POST", submitData, token);
      }
      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchSectionData();
      } else {
        setError(result.message || "Error saving");
      }
    } catch (err) {
      setError("Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionId || !confirm("Delete this section?")) return;
    try {
      const result = await apiRequest(`/admin/wedding-services/section1/${sectionId}`, "DELETE", null, token);
      if (result.success) {
        setSectionData({ title: "", subtitle: "", description: "" });
        setSectionId(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError("Failed to delete");
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
          <h2 className="text-xl font-bold">Luxury Wedding Services</h2>
          <p className="text-sm text-gray-500">Edit title, subtitle and description</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {sectionId && <button onClick={handleDelete} className="px-3 py-2 bg-red-500 text-white rounded-lg">Delete</button>}
          <button onClick={handleReset} className="px-3 py-2 border rounded-lg">Reset</button>
          <button onClick={saveSection} disabled={!hasChanges || saving} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {saved && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">Saved!</div>}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-xl border">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={sectionData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Enter title" /></div>
          <div><label className="block text-sm font-medium mb-1">Subtitle</label><input value={sectionData.subtitle} onChange={(e) => handleInputChange("subtitle", e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Enter subtitle" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={sectionData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="w-full border rounded-lg p-2.5" rows={4} placeholder="Enter description" /></div>
        </div>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Preview</h3>
          <h2 className="text-2xl font-bold">{sectionData.title || "No title"}</h2>
          <p className="text-amber-600 text-sm">{sectionData.subtitle}</p>
          <p className="text-gray-600 text-sm mt-2">{sectionData.description}</p>
        </div>
      </div>
    </div>
  );
}