// import { useState, useEffect } from "react";
// import { Save, RotateCcw, Check } from "lucide-react";

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

// export default function ServicesCulinaryManager() {
//   const [sectionData, setSectionData] = useState({ titles: ["", "", ""], subtitles: ["", "", ""] });
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
//       const result = await apiRequest("/wedding-services/culinary", "GET");
//       if (result.success && result.data) {
//         setSectionData({
//           titles: result.data.titles || ["", "", ""],
//           subtitles: result.data.subtitles || ["", "", ""],
//         });
//         setSectionId(result.data.id);
//         setHasChanges(false);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateTitle = (index, value) => {
//     const newTitles = [...sectionData.titles];
//     newTitles[index] = value;
//     setSectionData({ ...sectionData, titles: newTitles });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const updateSubtitle = (index, value) => {
//     const newSubtitles = [...sectionData.subtitles];
//     newSubtitles[index] = value;
//     setSectionData({ ...sectionData, subtitles: newSubtitles });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const saveSection = async () => {
//     const submitData = { titles: sectionData.titles, subtitles: sectionData.subtitles };
//     try {
//       let result;
//       if (sectionId) {
//         result = await apiRequest(`/admin/wedding-services/culinary/${sectionId}`, "PUT", submitData, token);
//       } else {
//         result = await apiRequest("/admin/wedding-services/culinary", "POST", submitData, token);
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
//         <div><h2 className="text-xl font-bold">Culinary Enhancements</h2><p className="text-sm text-gray-500">Manage 3 culinary items</p></div>
//         <div className="flex gap-2">
//           <button onClick={() => fetchSectionData()} className="px-3 py-2 border rounded-lg">Reset</button>
//           <button onClick={saveSection} disabled={!hasChanges} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}>Save</button>
//         </div>
//       </div>
//       {saved && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">Saved!</div>}
//       {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="space-y-4 bg-white p-6 rounded-xl border">
//           {[0, 1, 2].map((idx) => (
//             <div key={idx} className="border p-4 rounded-lg">
//               <h3 className="font-semibold mb-2">Item {idx + 1}</h3>
//               <div><label>Title</label><input value={sectionData.titles[idx]} onChange={(e) => updateTitle(idx, e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div>
//               <div><label>Subtitle</label><input value={sectionData.subtitles[idx]} onChange={(e) => updateSubtitle(idx, e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
//             </div>
//           ))}
//         </div>
//         <div className="bg-gray-50 p-6 rounded-xl border">
//           <h3 className="font-semibold mb-4">Preview</h3>
//           <div className="space-y-4">
//             {[0, 1, 2].map((idx) => (
//               <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
//                 <h4 className="font-bold text-lg">{sectionData.titles[idx] || "No title"}</h4>
//                 <p className="text-amber-600 text-sm">{sectionData.subtitles[idx] || "No subtitle"}</p>
//               </div>
//             ))}
//           </div>
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

export default function ServicesCulinaryManager() {
  const [sectionData, setSectionData] = useState({
    title: "",
    card1_title: "",
    card1_description: "",
    card2_title: "",
    card2_description: "",
    card3_title: "",
    card3_description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) { setToken(storedToken); fetchSectionData(); }
    else { setError("Please login first"); setLoading(false); }
  }, []);

  const fetchSectionData = async () => {
    try {
      const result = await apiRequest("/wedding-services/section4", "GET");
      if (result.success && result.data) {
        const data = result.data;
        setSectionData({
          title: data.title || "",
          card1_title: data.card1_title || "",
          card1_description: data.card1_description || "",
          card2_title: data.card2_title || "",
          card2_description: data.card2_description || "",
          card3_title: data.card3_title || "",
          card3_description: data.card3_description || "",
        });
        setSectionId(data.id);
        setHasChanges(false);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleInputChange = (field, value) => {
    setSectionData({ ...sectionData, [field]: value });
    setHasChanges(true);
    setSaved(false);
  };

  const saveSection = async () => {
    setSaving(true);
    try {
      let result;
      if (sectionId) {
        result = await apiRequest(`/admin/wedding-services/section4/${sectionId}`, "PUT", sectionData, token);
      } else {
        result = await apiRequest("/admin/wedding-services/section4", "POST", sectionData, token);
      }
      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchSectionData();
      }
    } catch (err) { setError("Failed to save"); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" /></div>;
  if (!token) return <div className="text-center py-20 text-red-500">Please login first</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-xl font-bold">Culinary Enhancements</h2><p className="text-sm text-gray-500">Manage 3 culinary items</p></div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => fetchSectionData()} className="px-3 py-2 border rounded-lg">Reset</button>
          <button onClick={saveSection} disabled={!hasChanges || saving} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
      {saved && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">Saved!</div>}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-xl border">
          <div><label className="block text-sm font-medium mb-1">Section Title</label><input value={sectionData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
          
          <div className="border p-4 rounded-lg"><h3 className="font-semibold mb-2">Item 1</h3><div><label>Title</label><input value={sectionData.card1_title} onChange={(e) => handleInputChange("card1_title", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div><div><label>Description</label><textarea value={sectionData.card1_description} onChange={(e) => handleInputChange("card1_description", e.target.value)} className="w-full border rounded-lg p-2.5" rows={3} /></div></div>
          
          <div className="border p-4 rounded-lg"><h3 className="font-semibold mb-2">Item 2</h3><div><label>Title</label><input value={sectionData.card2_title} onChange={(e) => handleInputChange("card2_title", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div><div><label>Description</label><textarea value={sectionData.card2_description} onChange={(e) => handleInputChange("card2_description", e.target.value)} className="w-full border rounded-lg p-2.5" rows={3} /></div></div>
          
          <div className="border p-4 rounded-lg"><h3 className="font-semibold mb-2">Item 3</h3><div><label>Title</label><input value={sectionData.card3_title} onChange={(e) => handleInputChange("card3_title", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div><div><label>Description</label><textarea value={sectionData.card3_description} onChange={(e) => handleInputChange("card3_description", e.target.value)} className="w-full border rounded-lg p-2.5" rows={3} /></div></div>
        </div>
        
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Preview</h3>
          <h2 className="text-xl font-bold mb-4">{sectionData.title || "No section title"}</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm"><h4 className="font-bold text-lg">{sectionData.card1_title || "No title"}</h4><p className="text-gray-600 text-sm">{sectionData.card1_description}</p></div>
            <div className="bg-white p-4 rounded-lg shadow-sm"><h4 className="font-bold text-lg">{sectionData.card2_title || "No title"}</h4><p className="text-gray-600 text-sm">{sectionData.card2_description}</p></div>
            <div className="bg-white p-4 rounded-lg shadow-sm"><h4 className="font-bold text-lg">{sectionData.card3_title || "No title"}</h4><p className="text-gray-600 text-sm">{sectionData.card3_description}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}