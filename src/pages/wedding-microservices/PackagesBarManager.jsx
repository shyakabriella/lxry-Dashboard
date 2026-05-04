// import { useState, useEffect } from "react";
// import { Save, RotateCcw, Check, AlertCircle, Upload, Trash2, Plus } from "lucide-react";

// const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";
// const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "/storage";

// const apiRequest = async (url, method = "GET", body = null, token = null, isFormData = false) => {
//   const options = { method, headers: {} };
//   if (token) options.headers["Authorization"] = `Bearer ${token}`;
//   if (isFormData) options.body = body;
//   else {
//     options.headers["Content-Type"] = "application/json";
//     if (body) options.body = JSON.stringify(body);
//   }
//   const response = await fetch(`${API_URL}${url}`, options);
//   if (method === "GET" && response.status === 404) return { success: false };
//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("API Error:", errorText);
//     throw new Error(`HTTP ${response.status}`);
//   }
//   return await response.json();
// };

// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   if (path.startsWith('/storage')) return `${STORAGE_URL}${path}`;
//   return `${STORAGE_URL}/${path}`;
// };

// export default function PackagesBarManager() {
//   const [blocks, setBlocks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [sectionId, setSectionId] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [uploadingIndex, setUploadingIndex] = useState(null);
//   const [title, setTitle] = useState("Bar Packages");
//   const [subtitle, setSubtitle] = useState("Choose your perfect bar package");

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
//       const result = await apiRequest("/wedding-packages/section5", "GET");
//       console.log("Fetched bar packages data:", result);
      
//       if (result.success && result.data) {
//         setTitle(result.data.title || "Bar Packages");
//         setSubtitle(result.data.subtitle || "Choose your perfect bar package");
        
//         const blocksData = result.data.blocks || [];
//         setBlocks(blocksData.map(block => ({
//           title: block.title || "",
//           image_url: block.image_url || "",
//           image_file: null,
//           image_preview: getImageUrl(block.image_url),
//           items: block.items || ["", "", "", ""],
//         })));
//         setSectionId(result.data.id);
//         setHasChanges(false);
//       } else {
//         console.log("No bar packages data found, using defaults");
//         setBlocks([]);
//         setTitle("Bar Packages");
//         setSubtitle("Choose your perfect bar package");
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addBlock = () => {
//     setBlocks([...blocks, { title: "", image_url: "", image_file: null, image_preview: null, items: ["", "", "", ""] }]);
//     setHasChanges(true);
//     setSaved(false);
//     setError(null);
//   };

//   const updateBlockField = (blockIndex, field, value) => {
//     const newBlocks = [...blocks];
//     newBlocks[blockIndex][field] = value;
//     setBlocks(newBlocks);
//     setHasChanges(true);
//     setSaved(false);
//     setError(null);
//   };

//   const updateBlockItem = (blockIndex, itemIndex, value) => {
//     const newBlocks = [...blocks];
//     newBlocks[blockIndex].items[itemIndex] = value;
//     setBlocks(newBlocks);
//     setHasChanges(true);
//     setSaved(false);
//     setError(null);
//   };

//   const handleImageUpload = (blockIndex, e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//     if (!validTypes.includes(file.type)) {
//       setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Image size must be less than 5MB");
//       return;
//     }

//     setUploadingIndex(blockIndex);
//     const newBlocks = [...blocks];
//     newBlocks[blockIndex].image_file = file;
//     newBlocks[blockIndex].image_preview = URL.createObjectURL(file);
//     newBlocks[blockIndex].image_url = "";
//     setBlocks(newBlocks);
//     setHasChanges(true);
//     setError(null);
//     setUploadingIndex(null);
//   };

//   const removeBlock = (blockIndex) => {
//     if (!confirm(`Remove Block ${blockIndex + 1}?`)) return;
//     const newBlocks = blocks.filter((_, i) => i !== blockIndex);
//     setBlocks(newBlocks);
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const saveSection = async () => {
//     if (blocks.length === 0) {
//       setError("Please add at least one block");
//       return;
//     }

//     const submitData = new FormData();
    
//     // ALWAYS send title and subtitle - this fixes the null constraint error
//     submitData.append("title", title || "Bar Packages");
//     submitData.append("subtitle", subtitle || "Choose your perfect bar package");
    
//     blocks.forEach((block, i) => {
//       submitData.append(`blocks[${i}][title]`, block.title || "");
//       block.items.forEach((item, j) => { 
//         if (item && item.trim()) {
//           submitData.append(`blocks[${i}][items][${j}]`, item.trim());
//         }
//       });
//       if (block.image_file) {
//         submitData.append(`blocks[${i}][image]`, block.image_file);
//       } else if (block.image_url && !block.image_url.startsWith("blob:")) {
//         submitData.append(`blocks[${i}][image_url]`, block.image_url);
//       }
//     });

//     setSaving(true);
//     try {
//       let result;
//       if (sectionId) {
//         submitData.append("_method", "PUT");
//         result = await apiRequest(`/admin/wedding-packages/section5/${sectionId}`, "POST", submitData, token, true);
//       } else {
//         result = await apiRequest("/admin/wedding-packages/section5", "POST", submitData, token, true);
//       }

//       console.log("Save response:", result);

//       if (result.success) {
//         setHasChanges(false);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 3000);
//         await fetchSectionData();
//       } else {
//         setError(result.message || "Error saving bar packages");
//         if (result.errors) {
//           const errorMessages = Object.values(result.errors).flat().join(", ");
//           setError(errorMessages);
//         }
//       }
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Failed to save bar packages. Please check your connection.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     fetchSectionData();
//     setError(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
//       </div>
//     );
//   }

//   if (!token) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold">Authentication Required</h2>
//           <p className="text-gray-500 mt-2">Please login to manage this section</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-xl font-bold">Bar Packages</h2>
//           <p className="text-sm text-gray-500">Manage bar packages blocks</p>
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <button 
//             onClick={handleReset} 
//             className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
//           >
//             <RotateCcw size={15} /> Reset
//           </button>
//           <button 
//             onClick={saveSection} 
//             disabled={!hasChanges || saving} 
//             className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
//               hasChanges && !saving
//                 ? "bg-amber-500 text-white hover:bg-amber-600" 
//                 : "bg-gray-300 cursor-not-allowed"
//             }`}
//           >
//             {saving ? (
//               <>
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save size={15} /> Save Changes
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {saved && (
//         <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
//           <Check size={16} /> Bar packages saved successfully!
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//           <AlertCircle size={16} /> {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left - Form */}
//         <div className="space-y-6 bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Section Title</label>
//             <input 
//               value={title} 
//               onChange={(e) => setTitle(e.target.value)} 
//               className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
//               placeholder="Enter section title"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Section Subtitle</label>
//             <input 
//               value={subtitle} 
//               onChange={(e) => setSubtitle(e.target.value)} 
//               className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
//               placeholder="Enter section subtitle"
//             />
//           </div>
          
//           {blocks.map((block, idx) => (
//             <div key={idx} className="border p-4 rounded-lg">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="font-semibold text-slate-800">Block {idx + 1}</h3>
//                 <button 
//                   onClick={() => removeBlock(idx)} 
//                   className="text-red-500 hover:text-red-700 transition"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
              
//               <div className="mb-3">
//                 <label className="block text-sm font-medium mb-1">Block Title</label>
//                 <input 
//                   value={block.title} 
//                   onChange={(e) => updateBlockField(idx, "title", e.target.value)} 
//                   className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
//                   placeholder="Enter block title"
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <label className="block text-sm font-medium mb-1">Block Image</label>
//                 <div className="flex gap-2">
//                   <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                     <Upload size={16} />
//                     Upload Image
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       onChange={(e) => handleImageUpload(idx, e)} 
//                       className="hidden" 
//                     />
//                   </label>
//                   <input 
//                     value={block.image_url} 
//                     onChange={(e) => updateBlockField(idx, "image_url", e.target.value)} 
//                     className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
//                     placeholder="Or enter image URL"
//                   />
//                 </div>
//                 {uploadingIndex === idx && (
//                   <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
//                     Uploading...
//                   </div>
//                 )}
//                 {block.image_preview && (
//                   <img src={block.image_preview} className="mt-2 h-32 w-full object-cover rounded-lg border shadow-sm" alt="Preview" />
//                 )}
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1">Items (4)</label>
//                 {block.items.map((item, j) => (
//                   <input 
//                     key={j} 
//                     value={item} 
//                     onChange={(e) => updateBlockItem(idx, j, e.target.value)} 
//                     className="w-full border rounded-lg p-2.5 mb-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
//                     placeholder={`Item ${j + 1}`} 
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
          
//           <button 
//             onClick={addBlock} 
//             className="text-amber-600 flex items-center gap-1 hover:text-amber-700 transition"
//           >
//             <Plus size={14} /> Add Block
//           </button>
          
//           <p className="text-xs text-gray-500 mt-2">
//             Each block represents a package. Add title, image, and up to 4 items per block.
//           </p>
//         </div>

//         {/* Right - Live Preview */}
//         <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border shadow-sm">
//           <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
          
//           <div className="mb-4">
//             <h2 className="text-2xl font-bold text-slate-800">{title || "Bar Packages"}</h2>
//             <p className="text-amber-600 text-sm">{subtitle || "Choose your perfect bar package"}</p>
//           </div>
          
//           {blocks.length > 0 ? (
//             <div className="space-y-6">
//               {blocks.map((block, idx) => (
//                 <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm border">
//                   {block.image_preview && (
//                     <img 
//                       src={block.image_preview} 
//                       className="w-full h-48 object-cover" 
//                       alt={block.title || `Block ${idx + 1}`}
//                       onError={(e) => {
//                         e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
//                       }}
//                     />
//                   )}
//                   <div className="p-4">
//                     <h3 className="font-bold text-xl text-slate-800 mb-2">
//                       {block.title || "No title"}
//                     </h3>
//                     <ul className="mt-2 space-y-1">
//                       {block.items.map((item, j) => (
//                         item && item.trim() && (
//                           <li key={j} className="text-sm text-gray-600">• {item}</li>
//                         )
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-10 text-gray-400">
//               <p>No blocks added yet</p>
//               <p className="text-xs mt-1">Click "Add Block" to create bar packages</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






























import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, AlertCircle, Upload, Trash2, Plus } from "lucide-react";

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

export default function PackagesBarManager() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [title, setTitle] = useState("Bar Packages");
  const [subtitle, setSubtitle] = useState("Choose your perfect bar package");

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
      const result = await apiRequest("/wedding-packages/section5", "GET");
      console.log("Fetched bar packages data:", result);
      
      if (result.success && result.data) {
        setTitle(result.data.title || "Bar Packages");
        setSubtitle(result.data.subtitle || "Choose your perfect bar package");
        
        const blocksData = result.data.blocks || [];
        setBlocks(blocksData.map(block => ({
          title: block.title || "",
          image_url: block.image_url || "",
          image_file: null,
          image_preview: block.image_url ? getImageUrl(block.image_url) : null,
          items: block.items || ["", "", "", ""],
        })));
        setSectionId(result.data.id);
        setHasChanges(false);
      } else {
        console.log("No bar packages data found, using defaults");
        setBlocks([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addBlock = () => {
    if (blocks.length >= 4) {
      setError("Maximum 4 blocks allowed");
      return;
    }
    setBlocks([...blocks, { title: "", image_url: "", image_file: null, image_preview: null, items: ["", "", "", ""] }]);
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const updateBlockField = (blockIndex, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex][field] = value;
    setBlocks(newBlocks);
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const updateBlockItem = (blockIndex, itemIndex, value) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].items[itemIndex] = value;
    setBlocks(newBlocks);
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const handleImageUpload = (blockIndex, e) => {
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

    setUploadingIndex(blockIndex);
    const newBlocks = [...blocks];
    newBlocks[blockIndex].image_file = file;
    newBlocks[blockIndex].image_preview = URL.createObjectURL(file);
    newBlocks[blockIndex].image_url = "";
    setBlocks(newBlocks);
    setHasChanges(true);
    setError(null);
    setTimeout(() => setUploadingIndex(null), 500);
  };

  const removeBlock = (blockIndex) => {
    if (!confirm(`Remove Block ${blockIndex + 1}?`)) return;
    const newBlocks = blocks.filter((_, i) => i !== blockIndex);
    setBlocks(newBlocks);
    setHasChanges(true);
    setSaved(false);
  };

  const saveSection = async () => {
    if (blocks.length === 0) {
      setError("Please add at least one block");
      return;
    }

    const formData = new FormData();
    
    formData.append("title", title || "Bar Packages");
    formData.append("subtitle", subtitle || "Choose your perfect bar package");
    
    blocks.forEach((block, i) => {
      formData.append(`blocks[${i}][title]`, block.title || "");
      block.items.forEach((item, j) => { 
        if (item && item.trim()) {
          formData.append(`blocks[${i}][items][${j}]`, item.trim());
        }
      });
      if (block.image_file) {
        formData.append(`blocks[${i}][image]`, block.image_file);
      } else if (block.image_url && !block.image_url.startsWith("blob:")) {
        formData.append(`blocks[${i}][image_url]`, block.image_url);
      }
    });

    setSaving(true);
    try {
      let result;
      if (sectionId) {
        formData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding-packages/section5/${sectionId}`, "POST", formData, token, true);
      } else {
        result = await apiRequest("/admin/wedding-packages/section5", "POST", formData, token, true);
      }

      console.log("Save response:", result);

      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchSectionData();
      } else {
        setError(result.message || "Error saving bar packages");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save bar packages. Please check your connection.");
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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Bar Packages</h2>
          <p className="text-sm text-gray-500">Manage bar packages blocks (max 4)</p>
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
          <Check size={16} /> Bar packages saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="space-y-6 bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
              placeholder="Enter section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section Subtitle</label>
            <input 
              value={subtitle} 
              onChange={(e) => setSubtitle(e.target.value)} 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
              placeholder="Enter section subtitle"
            />
          </div>
          
          {blocks.map((block, idx) => (
            <div key={idx} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-slate-800">Block {idx + 1}</h3>
                <button 
                  onClick={() => removeBlock(idx)} 
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Block Title</label>
                <input 
                  value={block.title} 
                  onChange={(e) => updateBlockField(idx, "title", e.target.value)} 
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                  placeholder="Enter block title"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Block Image</label>
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
                    <Upload size={16} />
                    Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(idx, e)} 
                      className="hidden" 
                    />
                  </label>
                  <input 
                    value={block.image_url} 
                    onChange={(e) => updateBlockField(idx, "image_url", e.target.value)} 
                    className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                    placeholder="Or enter image URL"
                  />
                </div>
                {uploadingIndex === idx && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                    Uploading...
                  </div>
                )}
                {block.image_preview && (
                  <img 
                    src={block.image_preview} 
                    className="mt-2 h-32 w-full object-cover rounded-lg border shadow-sm" 
                    alt="Preview"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=Image+Error";
                    }}
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Items (4)</label>
                {block.items.map((item, j) => (
                  <input 
                    key={j} 
                    value={item} 
                    onChange={(e) => updateBlockItem(idx, j, e.target.value)} 
                    className="w-full border rounded-lg p-2.5 mb-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                    placeholder={`Item ${j + 1}`} 
                  />
                ))}
              </div>
            </div>
          ))}
          
          {blocks.length < 4 && (
            <button 
              onClick={addBlock} 
              className="text-amber-600 flex items-center gap-1 hover:text-amber-700 transition"
            >
              <Plus size={14} /> Add Block
            </button>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Each block represents a package. Add title, image, and up to 4 items per block. Maximum 4 blocks.
          </p>
        </div>

        {/* Right - Live Preview */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
          
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800">{title || "Bar Packages"}</h2>
            <p className="text-amber-600 text-sm">{subtitle || "Choose your perfect bar package"}</p>
          </div>
          
          {blocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blocks.map((block, idx) => (
                <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                  {block.image_preview && (
                    <img 
                      src={block.image_preview} 
                      className="w-full h-40 object-cover" 
                      alt={block.title || `Block ${idx + 1}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      {block.title || "No title"}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {block.items.map((item, j) => (
                        item && item.trim() && (
                          <li key={j} className="text-xs text-gray-600">• {item}</li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>No blocks added yet</p>
              <p className="text-xs mt-1">Click "Add Block" to create bar packages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}