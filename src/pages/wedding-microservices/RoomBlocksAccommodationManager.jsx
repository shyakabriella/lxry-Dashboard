// import { useState, useEffect } from "react";
// import { Save, RotateCcw, Check, AlertCircle, Plus, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";

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
//     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//   }
//   return await response.json();
// };

// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   if (path.startsWith('/storage')) return `${STORAGE_URL}${path}`;
//   return `${STORAGE_URL}/${path}`;
// };

// export default function RoomBlocksAccommodationManager() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//       fetchItems();
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const result = await apiRequest("/wedding-room-blocks/section2", "GET");
//       console.log("Fetched items:", result);
//       if (result.success) {
//         setItems(result.data);
//       }
//     } catch (err) {
//       console.error("Error fetching:", err);
//       setError("Failed to load accommodation types");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addNewItem = () => {
//     setEditingId(null);
//     setEditingItem({ title: "", subtitle: "", description: "", image_url: "" });
//     setSelectedFile(null);
//     setImagePreview(null);
//   };

//   const editItem = (item) => {
//     setEditingId(item.id);
//     setEditingItem({ ...item });
//     setSelectedFile(null);
//     setImagePreview(getImageUrl(item.image_url));
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditingItem(null);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setError(null);
//     setUploading(false);
//   };

//   const handleFileSelect = (e) => {
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

//     setSelectedFile(file);
//     setImagePreview(URL.createObjectURL(file));
//     setError(null);
//   };

//   const saveItem = async () => {
//     // Validation
//     if (!editingItem.title) {
//       setError("Title is required");
//       return;
//     }

//     if (!selectedFile && !editingItem.image_url && editingId === null) {
//       setError("Image is required for new items");
//       return;
//     }

//     setUploading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", editingItem.title);
//     formData.append("subtitle", editingItem.subtitle || "");
//     formData.append("description", editingItem.description || "");
//     formData.append("sort_order", editingItem.sort_order || items.length + 1);

//     if (selectedFile) {
//       formData.append("image", selectedFile);
//       console.log("Uploading file:", selectedFile.name);
//     } else if (editingItem.image_url && !editingItem.image_url.startsWith("blob:")) {
//       formData.append("image_url", editingItem.image_url);
//     }

//     // Log what we're sending
//     for (let pair of formData.entries()) {
//       console.log(pair[0], pair[1]);
//     }

//     try {
//       let result;
//       if (editingId) {
//         formData.append("_method", "PUT");
//         console.log(`Updating item ${editingId}`);
//         result = await apiRequest(`/admin/wedding-room-blocks/section2/${editingId}`, "POST", formData, token, true);
//       } else {
//         console.log("Creating new item");
//         result = await apiRequest("/admin/wedding-room-blocks/section2", "POST", formData, token, true);
//       }

//       console.log("Save result:", result);

//       if (result.success) {
//         await fetchItems();
//         cancelEdit();
//         setSaved(true);
//         setTimeout(() => setSaved(false), 3000);
//       } else {
//         setError(result.message || "Error saving");
//         if (result.errors) {
//           const errorMessages = Object.values(result.errors).flat().join(", ");
//           setError(errorMessages);
//         }
//       }
//     } catch (err) {
//       console.error("Save error:", err);
//       setError(`Failed to save: ${err.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const deleteItem = async (id) => {
//     if (!confirm("Are you sure you want to delete this accommodation type?")) return;

//     try {
//       const result = await apiRequest(`/admin/wedding-room-blocks/section2/${id}`, "DELETE", null, token);
//       if (result.success) {
//         await fetchItems();
//         setSaved(true);
//         setTimeout(() => setSaved(false), 3000);
//       } else {
//         setError(result.message || "Error deleting");
//       }
//     } catch (err) {
//       console.error("Delete error:", err);
//       setError("Failed to delete");
//     }
//   };

//   const moveItem = async (index, direction) => {
//     const newIndex = direction === "up" ? index - 1 : index + 1;
//     if (newIndex < 0 || newIndex >= items.length) return;

//     const newItems = [...items];
//     const temp = newItems[index];
//     newItems[index] = newItems[newIndex];
//     newItems[newIndex] = temp;

//     for (let i = 0; i < newItems.length; i++) {
//       await apiRequest(`/admin/wedding-room-blocks/section2/${newItems[i].id}`, "PUT", { sort_order: i + 1 }, token);
//     }

//     await fetchItems();
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
//           <p className="text-gray-500 mt-2">Please login to manage accommodation types</p>
//         </div>
//       </div>
//     );
//   }

//   // Edit Mode
//   if (editingItem !== null) {
//     const isNew = editingId === null;
    
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold">{isNew ? "Add New Accommodation Type" : "Edit Accommodation Type"}</h2>
//             <p className="text-sm text-gray-500">Add title, description and image</p>
//           </div>
//           <button onClick={cancelEdit} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//             Cancel
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="space-y-4 bg-white p-6 rounded-xl border">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title *</label>
//               <input
//                 value={editingItem.title}
//                 onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
//                 className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
//                 placeholder="Enter title"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={editingItem.subtitle || ""}
//                 onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
//                 className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
//                 placeholder="Enter subtitle"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={editingItem.description || ""}
//                 onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
//                 className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Image</label>
//               <div className="flex gap-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2 text-sm">
//                   <Upload size={16} /> Upload Image
//                   <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//                 </label>
//                 <input
//                   value={editingItem.image_url || ""}
//                   onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
//                   className="flex-1 border rounded-lg p-2 text-sm"
//                   placeholder="Or enter image URL"
//                 />
//               </div>
//               {imagePreview && (
//                 <div className="mt-3 relative">
//                   <img
//                     src={imagePreview}
//                     className="w-full h-40 object-cover rounded-lg border"
//                     alt="Preview"
//                     onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Invalid+URL"; }}
//                   />
//                   <button
//                     onClick={() => {
//                       setSelectedFile(null);
//                       setImagePreview(null);
//                       setEditingItem({ ...editingItem, image_url: "" });
//                     }}
//                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               )}
//               <p className="text-xs text-gray-500 mt-2">
//                 {!imagePreview && !editingItem.image_url && isNew && "Please upload an image or enter a URL"}
//               </p>
//             </div>
//           </div>

//           <div className="bg-gray-50 p-6 rounded-xl border">
//             <h3 className="font-semibold text-lg mb-3">Preview</h3>
//             <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
//               {imagePreview && (
//                 <img src={imagePreview} className="w-full h-48 object-cover" alt="Preview" />
//               )}
//               <div className="p-4">
//                 <h4 className="font-bold text-xl">{editingItem.title || "No title"}</h4>
//                 <p className="text-amber-600 text-sm">{editingItem.subtitle || "No subtitle"}</p>
//                 <p className="text-gray-600 text-sm mt-2">{editingItem.description || "No description"}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={cancelEdit} className="px-4 py-2 border rounded-lg">Cancel</button>
//           <button onClick={saveItem} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 disabled:bg-amber-300">
//             {uploading ? (
//               <>
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                 Saving...
//               </>
//             ) : (
//               isNew ? "Create" : "Update"
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // List Mode
//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold">Accommodation Types</h2>
//           <p className="text-sm text-gray-500">Manage accommodation types for room blocks</p>
//         </div>
//         <div className="flex gap-2">
//           <button onClick={addNewItem} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:scale-105 transition">
//             <Plus size={16} /> Add New
//           </button>
//         </div>
//       </div>

//       {saved && (
//         <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
//           <Check size={16} /> Saved successfully!
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//           <AlertCircle size={16} /> {error}
//         </div>
//       )}

//       <div className="space-y-3">
//         {items.map((item, index) => (
//           <div key={item.id} className="border rounded-lg p-4 flex gap-4 items-center bg-white">
//             {item.image_url && (
//               <img
//                 src={getImageUrl(item.image_url)}
//                 className="w-24 h-24 object-cover rounded"
//                 alt={item.title}
//                 onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=No+Image"; }}
//               />
//             )}
//             <div className="flex-1">
//               <h3 className="font-semibold">{item.title}</h3>
//               <p className="text-sm text-amber-600">{item.subtitle}</p>
//               <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
//               <p className="text-xs text-gray-400 mt-1">Order: {item.sort_order || index + 1}</p>
//             </div>
//             <div className="flex gap-2">
//               {index > 0 && (
//                 <button onClick={() => moveItem(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
//                   <ArrowUp size={16} />
//                 </button>
//               )}
//               {index < items.length - 1 && (
//                 <button onClick={() => moveItem(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
//                   <ArrowDown size={16} />
//                 </button>
//               )}
//               <button onClick={() => editItem(item)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//               <button onClick={() => deleteItem(item.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//             </div>
//           </div>
//         ))}
//         {items.length === 0 && (
//           <div className="text-center py-10 text-gray-500 bg-white rounded-lg border">
//             <p>No accommodation types yet. Click "Add New" to create one.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









































import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, AlertCircle, Plus, Trash2, Upload, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function RoomBlocksAccommodationManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [saved, setSaved] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Form state for 3 images
  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchItems();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchItems = async () => {
    try {
      const result = await apiRequest("/wedding-room-blocks/section2", "GET");
      console.log("Fetched items:", result);
      if (result.success) {
        setItems(result.data);
      }
    } catch (err) {
      console.error("Error fetching:", err);
      setError("Failed to load accommodation types");
    } finally {
      setLoading(false);
    }
  };

  const addNewItem = () => {
    setEditingId(null);
    setEditingItem({ title: "", subtitle: "", description: "", images: ["", "", ""] });
    setSelectedFiles([null, null, null]);
    setImagePreviews([null, null, null]);
    setCurrentImageIndex(0);
  };

  const editItem = (item) => {
    setEditingId(item.id);
    const images = item.images || ["", "", ""];
    setEditingItem({ 
      title: item.title, 
      subtitle: item.subtitle || "", 
      description: item.description || "", 
      images: images 
    });
    setSelectedFiles([null, null, null]);
    setImagePreviews(images.map(img => getImageUrl(img)));
    setCurrentImageIndex(0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
    setSelectedFiles([null, null, null]);
    setImagePreviews([null, null, null]);
    setError(null);
    setUploading(false);
    setCurrentImageIndex(0);
  };

  const handleFileSelect = (imageIndex, e) => {
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

    const newSelectedFiles = [...selectedFiles];
    const newPreviews = [...imagePreviews];
    const newImages = [...editingItem.images];
    
    newSelectedFiles[imageIndex] = file;
    newPreviews[imageIndex] = URL.createObjectURL(file);
    newImages[imageIndex] = "";
    
    setSelectedFiles(newSelectedFiles);
    setImagePreviews(newPreviews);
    setEditingItem({ ...editingItem, images: newImages });
    setError(null);
  };

  const updateImageUrl = (imageIndex, value) => {
    const newImages = [...editingItem.images];
    const newPreviews = [...imagePreviews];
    
    newImages[imageIndex] = value;
    newPreviews[imageIndex] = getImageUrl(value);
    
    setEditingItem({ ...editingItem, images: newImages });
    setImagePreviews(newPreviews);
    
    const newFiles = [...selectedFiles];
    newFiles[imageIndex] = null;
    setSelectedFiles(newFiles);
  };

  const removeImage = (imageIndex) => {
    const newImages = [...editingItem.images];
    const newPreviews = [...imagePreviews];
    
    newImages[imageIndex] = "";
    newPreviews[imageIndex] = null;
    
    setEditingItem({ ...editingItem, images: newImages });
    setImagePreviews(newPreviews);
    
    const newFiles = [...selectedFiles];
    newFiles[imageIndex] = null;
    setSelectedFiles(newFiles);
  };

  const saveItem = async () => {
    if (!editingItem.title) {
      setError("Title is required");
      return;
    }

    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("title", editingItem.title);
    formData.append("subtitle", editingItem.subtitle || "");
    formData.append("description", editingItem.description || "");
    formData.append("sort_order", editingItem.sort_order || items.length + 1);

    // Add image URLs
    for (let i = 0; i < 3; i++) {
      if (editingItem.images[i]) {
        formData.append(`image_url_${i}`, editingItem.images[i]);
      }
    }
    
    // Add file uploads
    for (let i = 0; i < 3; i++) {
      if (selectedFiles[i]) {
        formData.append(`image_${i}`, selectedFiles[i]);
      }
    }

    try {
      let result;
      if (editingId) {
        formData.append("_method", "PUT");
        result = await apiRequest(`/admin/wedding-room-blocks/section2/${editingId}`, "POST", formData, token, true);
      } else {
        result = await apiRequest("/admin/wedding-room-blocks/section2", "POST", formData, token, true);
      }

      if (result.success) {
        await fetchItems();
        cancelEdit();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.message || "Error saving");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(`Failed to save: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this accommodation type?")) return;

    try {
      const result = await apiRequest(`/admin/wedding-room-blocks/section2/${id}`, "DELETE", null, token);
      if (result.success) {
        await fetchItems();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.message || "Error deleting");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete");
    }
  };

  const moveItem = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[newIndex];
    newItems[newIndex] = temp;

    for (let i = 0; i < newItems.length; i++) {
      await apiRequest(`/admin/wedding-room-blocks/section2/${newItems[i].id}`, "PUT", { sort_order: i + 1 }, token);
    }

    await fetchItems();
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
          <p className="text-gray-500 mt-2">Please login to manage accommodation types</p>
        </div>
      </div>
    );
  }

  // Edit Mode
  if (editingItem !== null) {
    const isNew = editingId === null;
    
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{isNew ? "Add New Accommodation Type" : "Edit Accommodation Type"}</h2>
            <p className="text-sm text-gray-500">Add title, description and up to 3 images</p>
          </div>
          <button onClick={cancelEdit} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 bg-white p-4 sm:p-6 rounded-xl border">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                value={editingItem.subtitle || ""}
                onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editingItem.description || ""}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                rows={4}
                placeholder="Enter description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Images (3)</label>
              {[0, 1, 2].map((imgIdx) => (
                <div key={imgIdx} className="mb-3 border p-3 rounded-lg">
                  <label className="text-xs font-medium block mb-2">Image {imgIdx + 1}</label>
                  <div className="flex gap-2">
                    <label className="cursor-pointer bg-amber-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-amber-600 flex items-center gap-1">
                      <Upload size={12} /> Upload
                      <input type="file" accept="image/*" onChange={(e) => handleFileSelect(imgIdx, e)} className="hidden" />
                    </label>
                    <input
                      value={editingItem.images[imgIdx] || ""}
                      onChange={(e) => updateImageUrl(imgIdx, e.target.value)}
                      className="flex-1 border rounded-lg p-1.5 text-sm"
                      placeholder="Or enter image URL"
                    />
                    {imagePreviews[imgIdx] && (
                      <button onClick={() => removeImage(imgIdx)} className="text-red-500 hover:text-red-700 px-2">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  {imagePreviews[imgIdx] && (
                    <img src={imagePreviews[imgIdx]} className="mt-2 h-20 w-full object-cover rounded border" alt="Preview" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-3">Live Preview</h3>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              {/* Image Carousel */}
              <div className="relative">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {imagePreviews[currentImageIndex] ? (
                    <img 
                      src={imagePreviews[currentImageIndex]} 
                      className="w-full h-full object-cover" 
                      alt="Preview"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image {currentImageIndex + 1}
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition ${
                          currentImageIndex === idx ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-xl">{editingItem.title || "No title"}</h4>
                <p className="text-amber-600 text-sm">{editingItem.subtitle || "No subtitle"}</p>
                <p className="text-gray-600 text-sm mt-2">{editingItem.description || "No description"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={cancelEdit} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={saveItem} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 disabled:bg-amber-300">
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              isNew ? "Create" : "Update"
            )}
          </button>
        </div>
      </div>
    );
  }

  // List Mode
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Accommodation Types</h2>
          <p className="text-sm text-gray-500">Manage accommodation types with up to 3 images each</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={addNewItem} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:scale-105 transition">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> Saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => {
          const images = item.images || ["", "", ""];
          return (
            <div key={item.id} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white">
              {/* Thumbnails of 3 images */}
              <div className="flex gap-1 w-48 h-16">
                {images.slice(0, 3).map((img, imgIdx) => (
                  img ? (
                    <img
                      key={imgIdx}
                      src={getImageUrl(img)}
                      className="w-1/3 h-full object-cover rounded"
                      alt={`${item.title} ${imgIdx + 1}`}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=No+Image"; }}
                    />
                  ) : (
                    <div key={imgIdx} className="w-1/3 h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400 rounded">
                      No img
                    </div>
                  )
                ))}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-amber-600">{item.subtitle}</p>
                <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">Order: {item.sort_order || index + 1}</p>
              </div>
              <div className="flex gap-2">
                {index > 0 && (
                  <button onClick={() => moveItem(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
                    <ArrowUp size={16} />
                  </button>
                )}
                {index < items.length - 1 && (
                  <button onClick={() => moveItem(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
                    <ArrowDown size={16} />
                  </button>
                )}
                <button onClick={() => editItem(item)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
                <button onClick={() => deleteItem(item.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg border">
            <p>No accommodation types yet. Click "Add New" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}