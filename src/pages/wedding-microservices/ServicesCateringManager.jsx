// import { useState, useEffect } from "react";
// import { Save, RotateCcw, Check, AlertCircle, Upload } from "lucide-react";

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
//   if (!response.ok) throw new Error(`HTTP ${response.status}`);
//   return await response.json();
// };

// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   return `${STORAGE_URL}/${path.replace(/^\/?storage\//, '')}`;
// };

// export default function ServicesCateringManager() {
//   const [sectionData, setSectionData] = useState({ cards: [{ title: "", subtitle: "", image_url: "", image_file: null, image_preview: null }, { title: "", subtitle: "", image_url: "", image_file: null, image_preview: null }] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [sectionId, setSectionId] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [uploadingIndex, setUploadingIndex] = useState(null);

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
//       const result = await apiRequest("/wedding-services/catering", "GET");
//       if (result.success && result.data) {
//         const cards = result.data.cards || [];
//         setSectionData({
//           cards: cards.map(card => ({
//             title: card.title || "",
//             subtitle: card.subtitle || "",
//             image_url: card.image_url || "",
//             image_file: null,
//             image_preview: getImageUrl(card.image_url),
//           }))
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

//   const updateCardField = (index, field, value) => {
//     const newCards = [...sectionData.cards];
//     newCards[index] = { ...newCards[index], [field]: value };
//     setSectionData({ cards: newCards });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const handleImageUpload = (index, e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const newCards = [...sectionData.cards];
//     newCards[index] = { ...newCards[index], image_file: file, image_preview: URL.createObjectURL(file), image_url: "" };
//     setSectionData({ cards: newCards });
//     setHasChanges(true);
//   };

//   const saveSection = async () => {
//     const submitData = new FormData();
//     sectionData.cards.forEach((card, i) => {
//       submitData.append(`cards[${i}][title]`, card.title);
//       submitData.append(`cards[${i}][subtitle]`, card.subtitle);
//       if (card.image_file) submitData.append(`cards[${i}][image]`, card.image_file);
//       else if (card.image_url) submitData.append(`cards[${i}][image_url]`, card.image_url);
//     });

//     try {
//       let result;
//       if (sectionId) {
//         submitData.append("_method", "PUT");
//         result = await apiRequest(`/admin/wedding-services/catering/${sectionId}`, "POST", submitData, token, true);
//       } else {
//         result = await apiRequest("/admin/wedding-services/catering", "POST", submitData, token, true);
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
//         <div><h2 className="text-xl font-bold">Catering Services</h2><p className="text-sm text-gray-500">Manage 2 catering cards</p></div>
//         <div className="flex gap-2">
//           <button onClick={() => fetchSectionData()} className="px-3 py-2 border rounded-lg">Reset</button>
//           <button onClick={saveSection} disabled={!hasChanges} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}>Save</button>
//         </div>
//       </div>
//       {saved && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">Saved!</div>}
//       {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="space-y-6 bg-white p-6 rounded-xl border">
//           {sectionData.cards.map((card, idx) => (
//             <div key={idx} className="border p-4 rounded-lg">
//               <h3 className="font-semibold mb-3">Card {idx + 1}</h3>
//               <div><label>Title</label><input value={card.title} onChange={(e) => updateCardField(idx, "title", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div>
//               <div><label>Subtitle</label><input value={card.subtitle} onChange={(e) => updateCardField(idx, "subtitle", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div>
//               <div><label>Image</label><div className="flex gap-2"><label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg text-sm">Upload Image<input type="file" accept="image/*" onChange={(e) => handleImageUpload(idx, e)} className="hidden" /></label><input value={card.image_url} onChange={(e) => updateCardField(idx, "image_url", e.target.value)} className="flex-1 border rounded-lg p-2.5" placeholder="Or enter URL" /></div>{card.image_preview && <img src={card.image_preview} className="mt-2 h-32 w-full object-cover rounded-lg" />}</div>
//             </div>
//           ))}
//         </div>
//         <div className="bg-gray-50 p-6 rounded-xl border">
//           <h3 className="font-semibold mb-4">Preview</h3>
//           <div className="space-y-6">
//             {sectionData.cards.map((card, idx) => (
//               <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm">
//                 {card.image_preview && <img src={card.image_preview} className="w-full h-40 object-cover" />}
//                 <div className="p-4"><h3 className="font-bold text-xl">{card.title || "No title"}</h3><p className="text-amber-600 text-sm">{card.subtitle}</p></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }















// import { useState, useEffect } from "react";
// import { Save, RotateCcw, Check, AlertCircle, Upload } from "lucide-react";

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
//   if (!response.ok) throw new Error(`HTTP ${response.status}`);
//   return await response.json();
// };

// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   return `${STORAGE_URL}/${path.replace(/^\/?storage\//, '')}`;
// };

// export default function ServicesCateringManager() {
//   const [sectionData, setSectionData] = useState({
//     title: "",
//     card1_title: "",
//     card1_subtitle: "",
//     card1_description: "",
//     card1_image: "",
//     card1_image_file: null,
//     card1_image_preview: null,
//     card2_title: "",
//     card2_subtitle: "",
//     card2_description: "",
//     card2_image: "",
//     card2_image_file: null,
//     card2_image_preview: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [sectionId, setSectionId] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) { setToken(storedToken); fetchSectionData(); }
//     else { setError("Please login first"); setLoading(false); }
//   }, []);

//   const fetchSectionData = async () => {
//     try {
//       const result = await apiRequest("/wedding-services/section3", "GET");
//       if (result.success && result.data) {
//         const data = result.data;
//         setSectionData({
//           title: data.title || "",
//           card1_title: data.card1_title || "",
//           card1_subtitle: data.card1_subtitle || "",
//           card1_description: data.card1_description || "",
//           card1_image: data.card1_image || "",
//           card1_image_file: null,
//           card1_image_preview: getImageUrl(data.card1_image),
//           card2_title: data.card2_title || "",
//           card2_subtitle: data.card2_subtitle || "",
//           card2_description: data.card2_description || "",
//           card2_image: data.card2_image || "",
//           card2_image_file: null,
//           card2_image_preview: getImageUrl(data.card2_image),
//         });
//         setSectionId(data.id);
//         setHasChanges(false);
//       }
//     } catch (err) { console.error(err); } finally { setLoading(false); }
//   };

//   const handleInputChange = (field, value) => {
//     setSectionData({ ...sectionData, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const handleImageUpload = (card, e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (card === 1) {
//       setSectionData({ ...sectionData, card1_image_file: file, card1_image_preview: URL.createObjectURL(file), card1_image: "" });
//     } else {
//       setSectionData({ ...sectionData, card2_image_file: file, card2_image_preview: URL.createObjectURL(file), card2_image: "" });
//     }
//     setHasChanges(true);
//   };

//   const saveSection = async () => {
//     const submitData = new FormData();
//     submitData.append("title", sectionData.title);
//     submitData.append("card1_title", sectionData.card1_title);
//     submitData.append("card1_subtitle", sectionData.card1_subtitle || "");
//     submitData.append("card1_description", sectionData.card1_description);
//     submitData.append("card2_title", sectionData.card2_title);
//     submitData.append("card2_subtitle", sectionData.card2_subtitle || "");
//     submitData.append("card2_description", sectionData.card2_description);
    
//     if (sectionData.card1_image_file) submitData.append("card1_image", sectionData.card1_image_file);
//     else if (sectionData.card1_image) submitData.append("card1_image_url", sectionData.card1_image);
    
//     if (sectionData.card2_image_file) submitData.append("card2_image", sectionData.card2_image_file);
//     else if (sectionData.card2_image) submitData.append("card2_image_url", sectionData.card2_image);

//     setUploading(true);
//     try {
//       let result;
//       if (sectionId) {
//         submitData.append("_method", "PUT");
//         result = await apiRequest(`/admin/wedding-services/section3/${sectionId}`, "POST", submitData, token, true);
//       } else {
//         result = await apiRequest("/admin/wedding-services/section3", "POST", submitData, token, true);
//       }
//       if (result.success) {
//         setHasChanges(false);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 3000);
//         await fetchSectionData();
//       }
//     } catch (err) { setError("Failed to save"); } finally { setUploading(false); }
//   };

//   if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" /></div>;
//   if (!token) return <div className="text-center py-20 text-red-500">Please login first</div>;

//   return (
//     <div className="space-y-6 p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div><h2 className="text-xl font-bold">Catering Services</h2><p className="text-sm text-gray-500">Manage 2 catering cards</p></div>
//         <div className="flex gap-2 flex-wrap">
//           <button onClick={() => fetchSectionData()} className="px-3 py-2 border rounded-lg">Reset</button>
//           <button onClick={saveSection} disabled={!hasChanges || uploading} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}>{uploading ? "Saving..." : "Save"}</button>
//         </div>
//       </div>
//       {saved && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">Saved!</div>}
//       {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="space-y-6 bg-white p-4 sm:p-6 rounded-xl border">
//           <div><label className="block text-sm font-medium mb-1">Section Title</label><input value={sectionData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
          
//           {/* Card 1 */}
//           <div className="border p-4 rounded-lg">
//             <h3 className="font-semibold mb-3">Card 1</h3>
//             <div><label>Title</label><input value={sectionData.card1_title} onChange={(e) => handleInputChange("card1_title", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div>
//             <div><label>Subtitle</label><input value={sectionData.card1_subtitle} onChange={(e) => handleInputChange("card1_subtitle", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div>
//             <div><label>Description</label><textarea value={sectionData.card1_description} onChange={(e) => handleInputChange("card1_description", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" rows={3} /></div>
//             <div><label>Image</label><div className="flex gap-2"><label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg">Upload<input type="file" accept="image/*" onChange={(e) => handleImageUpload(1, e)} className="hidden" /></label><input value={sectionData.card1_image} onChange={(e) => handleInputChange("card1_image", e.target.value)} className="flex-1 border rounded-lg p-2.5" placeholder="Or URL" /></div>{sectionData.card1_image_preview && <img src={sectionData.card1_image_preview} className="mt-2 h-32 w-full object-cover rounded-lg" />}</div>
//           </div>
          
//           {/* Card 2 */}
//           <div className="border p-4 rounded-lg">
//             <h3 className="font-semibold mb-3">Card 2</h3>
//             <div><label>Title</label><input value={sectionData.card2_title} onChange={(e) => handleInputChange("card2_title", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div>
//             <div><label>Subtitle</label><input value={sectionData.card2_subtitle} onChange={(e) => handleInputChange("card2_subtitle", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" /></div>
//             <div><label>Description</label><textarea value={sectionData.card2_description} onChange={(e) => handleInputChange("card2_description", e.target.value)} className="w-full border rounded-lg p-2.5 mb-2" rows={3} /></div>
//             <div><label>Image</label><div className="flex gap-2"><label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg">Upload<input type="file" accept="image/*" onChange={(e) => handleImageUpload(2, e)} className="hidden" /></label><input value={sectionData.card2_image} onChange={(e) => handleInputChange("card2_image", e.target.value)} className="flex-1 border rounded-lg p-2.5" placeholder="Or URL" /></div>{sectionData.card2_image_preview && <img src={sectionData.card2_image_preview} className="mt-2 h-32 w-full object-cover rounded-lg" />}</div>
//           </div>
//         </div>
        
//         <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border">
//           <h3 className="font-semibold mb-4">Preview</h3>
//           <h2 className="text-xl font-bold mb-4">{sectionData.title || "No section title"}</h2>
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg overflow-hidden shadow-sm">
//               {sectionData.card1_image_preview && <img src={sectionData.card1_image_preview} className="w-full h-40 object-cover" />}
//               <div className="p-4"><h3 className="font-bold text-xl">{sectionData.card1_title || "No title"}</h3><p className="text-amber-600 text-sm">{sectionData.card1_subtitle}</p><p className="text-gray-600 text-sm mt-2">{sectionData.card1_description}</p></div>
//             </div>
//             <div className="bg-white rounded-lg overflow-hidden shadow-sm">
//               {sectionData.card2_image_preview && <img src={sectionData.card2_image_preview} className="w-full h-40 object-cover" />}
//               <div className="p-4"><h3 className="font-bold text-xl">{sectionData.card2_title || "No title"}</h3><p className="text-amber-600 text-sm">{sectionData.card2_subtitle}</p><p className="text-gray-600 text-sm mt-2">{sectionData.card2_description}</p></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }













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
  if (path.startsWith('storage')) return `${STORAGE_URL}/${path}`;
  return `${STORAGE_URL}/${path}`;
};

export default function ServicesCateringManager() {
  const [sectionData, setSectionData] = useState({
    title: "",
    card1_title: "",
    card1_subtitle: "",
    card1_description: "",
    card1_image: "",
    card1_image_file: null,
    card1_image_preview: null,
    card2_title: "",
    card2_subtitle: "",
    card2_description: "",
    card2_image: "",
    card2_image_file: null,
    card2_image_preview: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      const result = await apiRequest("/wedding-services/section3", "GET");
      console.log("Fetched catering data:", result);
      
      if (result.success && result.data) {
        const data = result.data;
        setSectionData({
          title: data.title || "",
          card1_title: data.card1_title || "",
          card1_subtitle: data.card1_subtitle || "",
          card1_description: data.card1_description || "",
          card1_image: data.card1_image || "",
          card1_image_file: null,
          card1_image_preview: getImageUrl(data.card1_image),
          card2_title: data.card2_title || "",
          card2_subtitle: data.card2_subtitle || "",
          card2_description: data.card2_description || "",
          card2_image: data.card2_image || "",
          card2_image_file: null,
          card2_image_preview: getImageUrl(data.card2_image),
        });
        setSectionId(data.id);
        setHasChanges(false);
        setError(null);
      }
    } catch (err) { 
      console.error("Error fetching data:", err);
      setError("Failed to load catering data");
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

  const handleImageUpload = (card, e) => {
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

    if (card === 1) {
      setSectionData({ 
        ...sectionData, 
        card1_image_file: file, 
        card1_image_preview: URL.createObjectURL(file), 
        card1_image: "" 
      });
    } else {
      setSectionData({ 
        ...sectionData, 
        card2_image_file: file, 
        card2_image_preview: URL.createObjectURL(file), 
        card2_image: "" 
      });
    }
    setHasChanges(true);
    setError(null);
  };

  const removeImage = (card) => {
    if (card === 1) {
      setSectionData({ 
        ...sectionData, 
        card1_image_file: null, 
        card1_image_preview: null, 
        card1_image: "" 
      });
    } else {
      setSectionData({ 
        ...sectionData, 
        card2_image_file: null, 
        card2_image_preview: null, 
        card2_image: "" 
      });
    }
    setHasChanges(true);
  };

  const saveSection = async () => {
    if (!sectionData.title) {
      setError("Section title is required");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", sectionData.title);
    submitData.append("card1_title", sectionData.card1_title);
    submitData.append("card1_subtitle", sectionData.card1_subtitle || "");
    submitData.append("card1_description", sectionData.card1_description);
    submitData.append("card2_title", sectionData.card2_title);
    submitData.append("card2_subtitle", sectionData.card2_subtitle || "");
    submitData.append("card2_description", sectionData.card2_description);
    
    if (sectionData.card1_image_file) {
      submitData.append("card1_image", sectionData.card1_image_file);
    } else if (sectionData.card1_image && !sectionData.card1_image.startsWith("blob:")) {
      submitData.append("card1_image_url", sectionData.card1_image);
    }
    
    if (sectionData.card2_image_file) {
      submitData.append("card2_image", sectionData.card2_image_file);
    } else if (sectionData.card2_image && !sectionData.card2_image.startsWith("blob:")) {
      submitData.append("card2_image_url", sectionData.card2_image);
    }

    setUploading(true);
    setError(null);
    
    try {
      let result;
      if (sectionId) {
        submitData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding-services/section3/${sectionId}`, "POST", submitData, token, true);
      } else {
        result = await apiRequest("/admin/wedding-services/section3", "POST", submitData, token, true);
      }
      
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
      setError("Failed to save. Please try again."); 
    } finally { 
      setUploading(false); 
    }
  };

  const handleReset = () => {
    fetchSectionData();
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          <AlertCircle className="inline-block mr-2" size={20} />
          Please login first to manage this section
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Catering Services</h2>
          <p className="text-sm text-gray-500">Manage 2 catering cards</p>
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
            disabled={!hasChanges || uploading} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              hasChanges && !uploading
                ? "bg-amber-500 text-white hover:bg-amber-600" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {uploading ? (
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
          <Check size={16} /> Section saved successfully!
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
            <label className="block text-sm font-medium mb-1">Section Title *</label>
            <input 
              value={sectionData.title} 
              onChange={(e) => handleInputChange("title", e.target.value)} 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
              placeholder="Enter section title"
            />
          </div>
          
          {/* Card 1 */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-lg">Card 1</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input 
                value={sectionData.card1_title} 
                onChange={(e) => handleInputChange("card1_title", e.target.value)} 
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                placeholder="Card 1 title"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input 
                value={sectionData.card1_subtitle} 
                onChange={(e) => handleInputChange("card1_subtitle", e.target.value)} 
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                placeholder="Card 1 subtitle"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                value={sectionData.card1_description} 
                onChange={(e) => handleInputChange("card1_description", e.target.value)} 
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                rows={3} 
                placeholder="Card 1 description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <div className="flex gap-2">
                <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition flex items-center gap-2">
                  <Upload size={16} />
                  Upload Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(1, e)} className="hidden" />
                </label>
                <input 
                  value={sectionData.card1_image} 
                  onChange={(e) => handleInputChange("card1_image", e.target.value)} 
                  className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                  placeholder="Or enter image URL"
                />
                {sectionData.card1_image_preview && (
                  <button onClick={() => removeImage(1)} className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {sectionData.card1_image_preview && (
                <img 
                  src={sectionData.card1_image_preview} 
                  className="mt-2 h-32 w-full object-cover rounded-lg border shadow-sm" 
                  alt="Card 1 preview"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Error";
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-lg">Card 2</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input 
                value={sectionData.card2_title} 
                onChange={(e) => handleInputChange("card2_title", e.target.value)} 
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                placeholder="Card 2 title"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input 
                value={sectionData.card2_subtitle} 
                onChange={(e) => handleInputChange("card2_subtitle", e.target.value)} 
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                placeholder="Card 2 subtitle"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                value={sectionData.card2_description} 
                onChange={(e) => handleInputChange("card2_description", e.target.value)} 
                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                rows={3} 
                placeholder="Card 2 description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <div className="flex gap-2">
                <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition flex items-center gap-2">
                  <Upload size={16} />
                  Upload Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(2, e)} className="hidden" />
                </label>
                <input 
                  value={sectionData.card2_image} 
                  onChange={(e) => handleInputChange("card2_image", e.target.value)} 
                  className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
                  placeholder="Or enter image URL"
                />
                {sectionData.card2_image_preview && (
                  <button onClick={() => removeImage(2)} className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {sectionData.card2_image_preview && (
                <img 
                  src={sectionData.card2_image_preview} 
                  className="mt-2 h-32 w-full object-cover rounded-lg border shadow-sm" 
                  alt="Card 2 preview"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Error";
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Right - Live Preview */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            {sectionData.title || "No section title"}
          </h2>
          
          <div className="space-y-6">
            {/* Card 1 Preview */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              {sectionData.card1_image_preview ? (
                <img 
                  src={sectionData.card1_image_preview} 
                  className="w-full h-48 object-cover" 
                  alt="Card 1"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-xl text-slate-800">
                  {sectionData.card1_title || "No title"}
                </h3>
                {sectionData.card1_subtitle && (
                  <p className="text-amber-600 text-sm mt-1">{sectionData.card1_subtitle}</p>
                )}
                <p className="text-gray-600 text-sm mt-2">
                  {sectionData.card1_description || "No description"}
                </p>
              </div>
            </div>
            
            {/* Card 2 Preview */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              {sectionData.card2_image_preview ? (
                <img 
                  src={sectionData.card2_image_preview} 
                  className="w-full h-48 object-cover" 
                  alt="Card 2"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-xl text-slate-800">
                  {sectionData.card2_title || "No title"}
                </h3>
                {sectionData.card2_subtitle && (
                  <p className="text-amber-600 text-sm mt-1">{sectionData.card2_subtitle}</p>
                )}
                <p className="text-gray-600 text-sm mt-2">
                  {sectionData.card2_description || "No description"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg">
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