// import { useState } from "react";
// import {
//   Save,
//   RotateCcw,
//   Check,
//   AlertCircle,
//   Plus,
//   Trash2,
// } from "lucide-react";

// export default function WhyChooseSectionManager() {
//   const [sectionData, setSectionData] = useState({
//     title: "Easy to Plan",
//     description: "Our seamless event planning experience includes versatile venues for 1,000+ guests, along with on-site catering, bar service, conference suites, and overnight accommodations—all in one place, expertly managed by our team.",
//     imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=400&fit=crop",
//     features: [
//       "Versatile venues for 1,000+ guests",
//       "On-site catering & bar service",
//       "Conference suites available",
//       "Overnight accommodations",
//       "Expert event management team",
//       "All-in-one location"
//     ]
//   });
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [error, setError] = useState(null);

//   const updateField = (field, value) => {
//     setSectionData({ ...sectionData, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const addFeature = () => {
//     const newFeatures = [...(sectionData.features || []), ""];
//     updateField("features", newFeatures);
//   };

//   const updateFeature = (index, value) => {
//     const newFeatures = [...(sectionData.features || [])];
//     newFeatures[index] = value;
//     updateField("features", newFeatures);
//   };

//   const removeFeature = (index) => {
//     const newFeatures = [...(sectionData.features || [])];
//     newFeatures.splice(index, 1);
//     updateField("features", newFeatures);
//   };

//   const handleSave = () => {
//     localStorage.setItem("wedding_why_choose", JSON.stringify(sectionData));
//     setHasChanges(false);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const handleReset = () => {
//     setSectionData({
//       title: "Easy to Plan",
//       description: "Our seamless event planning experience includes versatile venues for 1,000+ guests, along with on-site catering, bar service, conference suites, and overnight accommodations—all in one place, expertly managed by our team.",
//       imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=400&fit=crop",
//       features: [
//         "Versatile venues for 1,000+ guests",
//         "On-site catering & bar service",
//         "Conference suites available",
//         "Overnight accommodations",
//         "Expert event management team",
//         "All-in-one location"
//       ]
//     });
//     setHasChanges(true);
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold">Why Choose Luxury Garden Palace Section</h2>
//           <p className="text-sm text-gray-500">Edit the content for this section</p>
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
//         <div className="space-y-4 bg-white p-6 rounded-xl">
//           <div>
//             <label className="block text-sm font-medium mb-1">Title</label>
//             <input
//               value={sectionData.title}
//               onChange={(e) => updateField("title", e.target.value)}
//               className="w-full border rounded-lg p-2.5"
//               placeholder="Title"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               value={sectionData.description}
//               onChange={(e) => updateField("description", e.target.value)}
//               className="w-full border rounded-lg p-2.5"
//               rows={4}
//               placeholder="Description"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Image URL</label>
//             <input
//               value={sectionData.imageUrl}
//               onChange={(e) => updateField("imageUrl", e.target.value)}
//               className="w-full border rounded-lg p-2.5"
//               placeholder="Image URL"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-2">Features</label>
//             {sectionData.features?.map((feature, idx) => (
//               <div key={idx} className="flex gap-2 mb-2">
//                 <input
//                   value={feature}
//                   onChange={(e) => updateFeature(idx, e.target.value)}
//                   className="flex-1 border rounded-lg p-2"
//                   placeholder={`Feature ${idx + 1}`}
//                 />
//                 <button onClick={() => removeFeature(idx)} className="px-3 bg-red-500 text-white rounded">×</button>
//               </div>
//             ))}
//             <button onClick={addFeature} className="text-sm text-amber-600 flex items-center gap-1">
//               <Plus size={14} /> Add Feature
//             </button>
//           </div>
//         </div>

//         <div className="bg-gray-50 p-4 rounded-xl">
//           <h3 className="font-semibold mb-3">Preview</h3>
//           {sectionData.imageUrl && <img src={sectionData.imageUrl} className="rounded-lg mb-3 w-full" alt="Preview" />}
//           <h2 className="font-bold text-xl">{sectionData.title}</h2>
//           <p className="text-gray-600 text-sm mt-2">{sectionData.description}</p>
//           <ul className="mt-3 space-y-1">
//             {sectionData.features.map((feature, i) => (
//               <li key={i} className="flex items-start gap-2 text-sm">
//                 <span className="text-amber-500">•</span> {feature}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }




// import { useState, useEffect } from "react";
// import {
//   Save,
//   RotateCcw,
//   Check,
//   AlertCircle,
//   Plus,
//   Trash2,
//   Upload,
//   ArrowUp,
//   ArrowDown,
//   Eye,
// } from "lucide-react";

// const API_URL = "http://127.0.0.1:8000/api";

// const apiRequest = async (url, method = "GET", body = null, token = null, isFormData = false) => {
//   const options = {
//     method,
//     headers: {},
//   };

//   if (token) {
//     options.headers["Authorization"] = `Bearer ${token}`;
//   }

//   if (!isFormData) {
//     options.headers["Content-Type"] = "application/json";
//     if (body) {
//       options.body = JSON.stringify(body);
//     }
//   } else {
//     options.body = body;
//   }

//   const response = await fetch(`${API_URL}${url}`, options);
//   return await response.json();
// };

// export default function WhyChooseSectionManager() {
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [editingSlide, setEditingSlide] = useState(null);
//   const [isAdding, setIsAdding] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     title: "Why Choose Luxury Garden Palace?",
//     subtitle: "",
//     description: "",
//     image_url: "",
//     image_file: null,
//     image_preview: null,
//     display_order: 0,
//   });

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//       fetchSlides();
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   const fetchSlides = async () => {
//     try {
//       const result = await apiRequest("/wedding/why-choose/slides", "GET");
//       if (result.success) {
//         setSlides(result.data);
//       }
//     } catch (err) {
//       console.error("Error fetching slides:", err);
//       setError("Failed to load slides");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "Why Choose Luxury Garden Palace?",
//       subtitle: "",
//       description: "",
//       image_url: "",
//       image_file: null,
//       image_preview: null,
//       display_order: slides.length + 1,
//     });
//     setError(null);
//   };

//   const handleEditSlide = (slide) => {
//     setEditingSlide(slide);
//     setIsAdding(false);
//     setFormData({
//       title: slide.title || "Why Choose Luxury Garden Palace?",
//       subtitle: slide.subtitle || "",
//       description: slide.description || "",
//       image_url: slide.image_url || "",
//       image_file: null,
//       image_preview: slide.image_url && !slide.image_url.startsWith("http") 
//         ? `http://127.0.0.1:8000/storage/${slide.image_url}` 
//         : slide.image_url,
//       display_order: slide.display_order || 0,
//     });
//   };

//   const handleAddNew = () => {
//     setIsAdding(true);
//     setEditingSlide(null);
//     resetForm();
//   };

//   const handleCancel = () => {
//     setIsAdding(false);
//     setEditingSlide(null);
//     resetForm();
//   };

//   const handleInputChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleImageUpload = async (e) => {
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

//     setFormData({
//       ...formData,
//       image_file: file,
//       image_preview: URL.createObjectURL(file),
//       image_url: "",
//     });
//     setError(null);
//   };

//   const saveSlide = async () => {
//     if (!formData.subtitle) {
//       setError("Subtitle is required");
//       return;
//     }
//     if (!formData.description) {
//       setError("Description is required");
//       return;
//     }
//     if (!formData.image_file && !formData.image_url && !editingSlide) {
//       setError("Please select an image or enter image URL");
//       return;
//     }

//     const submitData = new FormData();
//     submitData.append("title", formData.title);
//     submitData.append("subtitle", formData.subtitle);
//     submitData.append("description", formData.description);
//     submitData.append("display_order", formData.display_order || 0);

//     if (formData.image_file) {
//       submitData.append("image", formData.image_file);
//     } else if (formData.image_url) {
//       submitData.append("image_url", formData.image_url);
//     }

//     let result;
//     if (editingSlide) {
//       submitData.append("_method", "PUT");
//       result = await apiRequest(`/admin/wedding/why-choose/slides/${editingSlide.id}`, "POST", submitData, token, true);
//     } else {
//       result = await apiRequest("/admin/wedding/why-choose/slides", "POST", submitData, token, true);
//     }

//     if (result.success) {
//       await fetchSlides();
//       setIsAdding(false);
//       setEditingSlide(null);
//       resetForm();
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error saving slide");
//       if (result.errors) {
//         const errorMessages = Object.values(result.errors).flat().join(", ");
//         setError(errorMessages);
//       }
//     }
//   };

//   const deleteSlide = async (slide) => {
//     if (!confirm(`Delete slide "${slide.subtitle}"? This action cannot be undone.`)) return;
    
//     const result = await apiRequest(`/admin/wedding/why-choose/slides/${slide.id}`, "DELETE", null, token);
//     if (result.success) {
//       await fetchSlides();
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error deleting slide");
//     }
//   };

//   const moveSlide = async (index, direction) => {
//     const newIndex = direction === "up" ? index - 1 : index + 1;
//     if (newIndex < 0 || newIndex >= slides.length) return;

//     const newSlides = [...slides];
//     const temp = newSlides[index];
//     newSlides[index] = newSlides[newIndex];
//     newSlides[newIndex] = temp;

//     for (let i = 0; i < newSlides.length; i++) {
//       await apiRequest(`/admin/wedding/why-choose/slides/${newSlides[i].id}`, "PUT", { display_order: i + 1 }, token);
//     }

//     await fetchSlides();
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
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
//           <p className="text-gray-500 mt-2">Please login to manage slides</p>
//         </div>
//       </div>
//     );
//   }

//   // Editor View (Add/Edit)
//   if (isAdding || editingSlide) {
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">{editingSlide ? "Edit Slide" : "Add New Slide"}</h2>
//             <p className="text-sm text-gray-500">Create or edit a Why Choose slide</p>
//           </div>
//           <button onClick={handleCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//             Cancel
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* Left - Form */}
//           <div className="space-y-4 bg-white p-6 rounded-xl">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={formData.title}
//                 onChange={(e) => handleInputChange("title", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="Title"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle *</label>
//               <input
//                 value={formData.subtitle}
//                 onChange={(e) => handleInputChange("subtitle", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Easy to Remember"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description *</label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => handleInputChange("description", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Image</label>
//               <div className="flex gap-2 items-center">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                   <Upload size={16} />
//                   Upload Image
//                   <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//                 </label>
//                 <input
//                   value={formData.image_url}
//                   onChange={(e) => handleInputChange("image_url", e.target.value)}
//                   className="flex-1 border rounded-lg p-2.5"
//                   placeholder="Or enter image URL"
//                 />
//               </div>
//               {(formData.image_preview || formData.image_url) && (
//                 <div className="mt-2 relative">
//                   <img src={formData.image_preview || formData.image_url} className="w-full h-40 object-cover rounded-lg" alt="Preview" />
//                 </div>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Display Order</label>
//               <input
//                 type="number"
//                 value={formData.display_order}
//                 onChange={(e) => handleInputChange("display_order", parseInt(e.target.value) || 0)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="Display order"
//               />
//             </div>
//           </div>

//           {/* Right - Preview */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {(formData.image_preview || formData.image_url) && (
//               <img src={formData.image_preview || formData.image_url} className="rounded-lg mb-3 w-full h-64 object-cover" alt="Preview" />
//             )}
//             <p className="text-amber-600 text-sm">{formData.title}</p>
//             <h2 className="font-bold text-xl">{formData.subtitle || "Subtitle will appear here"}</h2>
//             <p className="text-gray-600 text-sm mt-2">{formData.description || "Description will appear here"}</p>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={handleCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
//           <button onClick={saveSlide} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//             {editingSlide ? "Update Slide" : "Create Slide"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // List View
//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold">Why Choose Slides</h2>
//           <p className="text-sm text-gray-500">Manage your "Why Choose Luxury Garden Palace?" slider slides (4 slides recommended)</p>
//         </div>
//         <button
//           onClick={handleAddNew}
//           className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
//         >
//           <Plus size={16} /> Add New Slide
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//           <AlertCircle size={16} /> {error}
//         </div>
//       )}

//       {saved && (
//         <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
//           <Check size={16} /> Changes saved successfully!
//         </div>
//       )}

//       <div className="space-y-3">
//         {slides.length === 0 && (
//           <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
//         )}
        
//         {slides.map((slide, index) => {
//           const imageUrl = slide.image_url && !slide.image_url.startsWith("http") 
//             ? `http://127.0.0.1:8000/storage/${slide.image_url}` 
//             : slide.image_url;
            
//           return (
//             <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center bg-white">
//               <img src={imageUrl} alt={slide.subtitle} className="w-24 h-24 object-cover rounded" />
//               <div className="flex-1">
//                 <h3 className="font-semibold">{slide.subtitle}</h3>
//                 <p className="text-sm text-gray-500 line-clamp-2">{slide.description}</p>
//                 <p className="text-xs text-gray-400 mt-1">Order: {slide.display_order || index + 1} | ID: {slide.id}</p>
//               </div>
//               <div className="flex gap-2">
//                 {index > 0 && (
//                   <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
//                     <ArrowUp size={16} />
//                   </button>
//                 )}
//                 {index < slides.length - 1 && (
//                   <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
//                     <ArrowDown size={16} />
//                   </button>
//                 )}
//                 <button onClick={() => handleEditSlide(slide)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//                 <button onClick={() => deleteSlide(slide)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }












import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
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

export default function WhyChooseSectionManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "Why Choose Luxury Garden Palace?",
    subtitle: "",
    description: "",
    image_url: "",
    image_file: null,
    image_preview: null,
    display_order: 0,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchSlides();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchSlides = async () => {
    try {
      const result = await apiRequest("/wedding/section2/slides", "GET");
      if (result.success) {
        setSlides(result.data);
      }
    } catch (err) {
      console.error("Error fetching slides:", err);
      setError("Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/storage')) return `${STORAGE_URL}${path}`;
    return `${STORAGE_URL}/${path}`;
  };

  const resetForm = () => {
    setFormData({
      title: "Why Choose Luxury Garden Palace?",
      subtitle: "",
      description: "",
      image_url: "",
      image_file: null,
      image_preview: null,
      display_order: slides.length + 1,
    });
    setError(null);
  };

  const handleEditSlide = (slide) => {
    setEditingSlide(slide);
    setIsAdding(false);
    setFormData({
      title: slide.title || "Why Choose Luxury Garden Palace?",
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      image_url: slide.image_url || "",
      image_file: null,
      image_preview: getImageUrl(slide.image_url),
      display_order: slide.display_order || 0,
    });
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingSlide(null);
    resetForm();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingSlide(null);
    resetForm();
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = async (e) => {
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

    setFormData({
      ...formData,
      image_file: file,
      image_preview: URL.createObjectURL(file),
      image_url: "",
    });
    setError(null);
  };

  const saveSlide = async () => {
    if (!formData.subtitle) {
      setError("Subtitle is required");
      return;
    }
    if (!formData.description) {
      setError("Description is required");
      return;
    }
    if (!formData.image_file && !formData.image_url && !editingSlide) {
      setError("Please select an image or enter image URL");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("subtitle", formData.subtitle);
    submitData.append("description", formData.description);
    submitData.append("display_order", formData.display_order || 0);

    if (formData.image_file) {
      submitData.append("image", formData.image_file);
    } else if (formData.image_url) {
      submitData.append("image_url", formData.image_url);
    }

    let result;
    if (editingSlide) {
      submitData.append("_method", "PUT");
      result = await apiRequest(`/admin/wedding/section2/slides/${editingSlide.id}`, "POST", submitData, token, true);
    } else {
      result = await apiRequest("/admin/wedding/section2/slides", "POST", submitData, token, true);
    }

    if (result.success) {
      await fetchSlides();
      setIsAdding(false);
      setEditingSlide(null);
      resetForm();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(result.message || "Error saving slide");
      if (result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(", ");
        setError(errorMessages);
      }
    }
  };

  const deleteSlide = async (slide) => {
    if (!confirm(`Delete slide "${slide.subtitle}"? This action cannot be undone.`)) return;
    
    const result = await apiRequest(`/admin/wedding/section2/slides/${slide.id}`, "DELETE", null, token);
    if (result.success) {
      await fetchSlides();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(result.message || "Error deleting slide");
    }
  };

  const moveSlide = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[newIndex];
    newSlides[newIndex] = temp;

    for (let i = 0; i < newSlides.length; i++) {
      await apiRequest(`/admin/wedding/section2/slides/${newSlides[i].id}`, "PUT", { display_order: i + 1 }, token);
    }

    await fetchSlides();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
          <p className="text-gray-500 mt-2">Please login to manage slides</p>
        </div>
      </div>
    );
  }

  // Editor View
  if (isAdding || editingSlide) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{editingSlide ? "Edit Slide" : "Add New Slide"}</h2>
            <p className="text-sm text-gray-500">Create or edit a Why Choose slide</p>
          </div>
          <button onClick={handleCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4 bg-white p-6 rounded-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full border rounded-lg p-2.5"
                placeholder="Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle *</label>
              <input
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="w-full border rounded-lg p-2.5"
                placeholder="e.g., Easy to Remember"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full border rounded-lg p-2.5"
                rows={4}
                placeholder="Enter description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <div className="flex gap-2 items-center">
                <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
                  <Upload size={16} />
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <input
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  className="flex-1 border rounded-lg p-2.5"
                  placeholder="Or enter image URL"
                />
              </div>
              {(formData.image_preview || formData.image_url) && (
                <div className="mt-2 relative">
                  <img src={formData.image_preview || formData.image_url} className="w-full h-40 object-cover rounded-lg" alt="Preview" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => handleInputChange("display_order", parseInt(e.target.value) || 0)}
                className="w-full border rounded-lg p-2.5"
                placeholder="Display order"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Preview</h3>
            {(formData.image_preview || formData.image_url) && (
              <img src={formData.image_preview || formData.image_url} className="rounded-lg mb-3 w-full h-64 object-cover" alt="Preview" />
            )}
            <p className="text-amber-600 text-sm">{formData.title}</p>
            <h2 className="font-bold text-xl">{formData.subtitle || "Subtitle will appear here"}</h2>
            <p className="text-gray-600 text-sm mt-2">{formData.description || "Description will appear here"}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={handleCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={saveSlide} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
            {editingSlide ? "Update Slide" : "Create Slide"}
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Why Choose Slides</h2>
          <p className="text-sm text-gray-500">Manage your "Why Choose Luxury Garden Palace?" slider slides (4 slides recommended)</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus size={16} /> Add New Slide
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> Changes saved successfully!
        </div>
      )}

      <div className="space-y-3">
        {slides.length === 0 && (
          <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
        )}
        
        {slides.map((slide, index) => {
          const imageUrl = getImageUrl(slide.image_url);
          
          return (
            <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center bg-white">
              <img src={imageUrl} alt={slide.subtitle} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{slide.subtitle}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{slide.description}</p>
                <p className="text-xs text-gray-400 mt-1">Order: {slide.display_order || index + 1} | ID: {slide.id}</p>
              </div>
              <div className="flex gap-2">
                {index > 0 && (
                  <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
                    <ArrowUp size={16} />
                  </button>
                )}
                {index < slides.length - 1 && (
                  <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
                    <ArrowDown size={16} />
                  </button>
                )}
                <button onClick={() => handleEditSlide(slide)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
                <button onClick={() => deleteSlide(slide)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}