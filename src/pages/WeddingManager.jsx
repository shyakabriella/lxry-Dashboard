  // import { useEffect, useState } from "react";
  // import { loadSiteData, saveSiteData } from "../data/store";
  // import {
  //   Save,
  //   RotateCcw,
  //   Check,
  //   Image,
  //   Type,
  //   Link2,
  //   AlertCircle,
  // } from "lucide-react";

  // import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
  // import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
  // import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
  // import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
  // import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

  // const sectionLabels = {
  //   hero: "Hero Section",
  //   envision_your_special_day: "Envision Your Special Day Section",
  //   services: "Services Section",
  //   why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
  //   prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
  //   wedding_accommodations: "Wedding Accommodations Section",
  //   Location: "Location Section",
  //   multiple_images: "Multiple Images Section",
  // };

  // export default function WeddingManager() {
  //   const [data, setData] = useState(null);
  //   const [activeSection, setActiveSection] = useState("hero");
  //   const [editedSection, setEditedSection] = useState(null);
  //   const [saved, setSaved] = useState(false);
  //   const [hasChanges, setHasChanges] = useState(false);

  //   useEffect(() => {
  //     const siteData = loadSiteData();
  //     setData(siteData);
  //     setEditedSection({ ...siteData.homepage["hero"] });
  //   }, []);

  //   const switchSection = (key) => {
  //     if (hasChanges && !confirm("You have unsaved changes. Discard them?"))
  //       return;

  //     setActiveSection(key);
  //     setEditedSection({ ...data.homepage[key] });
  //     setHasChanges(false);
  //     setSaved(false);
  //   };

  //   const updateField = (field, value) => {
  //     setEditedSection({ ...editedSection, [field]: value });
  //     setHasChanges(true);
  //     setSaved(false);
  //   };

  //   const updateArrayField = (field, index, value) => {
  //     const arr = editedSection[field] ? [...editedSection[field]] : [];
  //     arr[index] = value;
  //     updateField(field, arr);
  //   };

  //   const handleSave = () => {
  //     const updated = {
  //       ...data,
  //       homepage: {
  //         ...data.homepage,
  //         [activeSection]: editedSection,
  //       },
  //     };

  //     saveSiteData(updated);
  //     setData(updated);
  //     setHasChanges(false);
  //     setSaved(true);
  //     setTimeout(() => setSaved(false), 2500);
  //   };

  //   const handleReset = () => {
  //     const defaultData = loadSiteData();
  //     setEditedSection({ ...defaultData.homepage[activeSection] });
  //     setHasChanges(true);
  //   };

  //   if (!data || !editedSection) {
  //     return (
  //       <div className="flex items-center justify-center py-20">
  //         <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
  //       </div>
  //     );
  //   }

  //   // =========================
  //   // RULES (MATCHED + CLEAN)
  //   // =========================

  //   const showTitle = activeSection !== "multiple_images";

  //   const showSubtitle =
  //     activeSection !== "multiple_images" &&
  //     activeSection !== "services";

  //   const showImage = ![
  //     "why_choose_luxury_garden_palace",
  //     "services",
  //   ].includes(activeSection);

  //   const isTwoImages =
  //     activeSection === "envision_your_special_day" ||
  //     activeSection === "prime_luxury_apartment_living";

  //   const isFourImages =
  //     activeSection === "multiple_images" ||
  //     activeSection === "hero";

  //   const isServices = activeSection === "services";

  //   return (
  //     <section>
  //       <div className="space-y-6">

  //         {/* HEADER */}
  //         <div className="flex flex-wrap items-center justify-between gap-4">
  //           <div>
  //             <h1 className="text-2xl font-bold text-slate-900">
  //               Wedding homepage Content
  //             </h1>
  //             <p className="mt-1 text-sm text-slate-500">
  //               Edit the content displayed on your wedding
  //             </p>
  //           </div>

  //           <div className="flex items-center gap-2">

  //             {saved && (
  //               <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
  //                 <Check size={16} />
  //                 Saved successfully
  //               </span>
  //             )}

  //             <button
  //               onClick={handleReset}
  //               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
  //             >
  //               <RotateCcw size={15} />
  //               Reset
  //             </button>

  //             <button
  //               onClick={handleSave}
  //               disabled={!hasChanges}
  //               className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
  //                 hasChanges
  //                   ? "bg-gradient-to-r from-amber-500 to-amber-600"
  //                   : "bg-slate-300 cursor-not-allowed"
  //               }`}
  //             >
  //               <Save size={15} />
  //               Save Changes
  //             </button>
  //           </div>
  //         </div>

  //         {/* TABS */}
  //         <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
  //           {Object.entries(sectionLabels).map(([key, label]) => (
  //             <button
  //               key={key}
  //               onClick={() => switchSection(key)}
  //               className={`text-[10px] p-2 rounded-lg ${
  //                 activeSection === key ? "bg-white shadow" : ""
  //               }`}
  //             >
  //               {label}
  //             </button>
  //           ))}
  //         </div>

  //         <div className="grid lg:grid-cols-5 gap-6">

  //           {/* LEFT */}
  //           <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">

  //             {showTitle && (
  //               <input
  //                 value={editedSection.title || ""}
  //                 onChange={(e) => updateField("title", e.target.value)}
  //                 className="w-full border p-2 rounded"
  //                 placeholder="Title"
  //               />
  //             )}

  //             {showSubtitle && (
  //               <input
  //                 value={editedSection.subtitle || ""}
  //                 onChange={(e) => updateField("subtitle", e.target.value)}
  //                 className="w-full border p-2 rounded"
  //                 placeholder="Subtitle"
  //               />
  //             )}

  //             {showImage && !isTwoImages && !isFourImages && (
  //               <input
  //                 value={editedSection.imageUrl || ""}
  //                 onChange={(e) => updateField("imageUrl", e.target.value)}
  //                 className="w-full border p-2 rounded"
  //                 placeholder="Image URL"
  //               />
  //             )}

  //             {isTwoImages &&
  //               [0, 1].map((i) => (
  //                 <input
  //                   key={i}
  //                   value={editedSection.images?.[i] || ""}
  //                   onChange={(e) =>
  //                     updateArrayField("images", i, e.target.value)
  //                   }
  //                   className="w-full border p-2 rounded"
  //                   placeholder={`Image ${i + 1}`}
  //                 />
  //               ))}

  //             {isFourImages &&
  //               [0, 1, 2, 3].map((i) => (
  //                 <input
  //                   key={i}
  //                   value={editedSection.images?.[i] || ""}
  //                   onChange={(e) =>
  //                     updateArrayField("images", i, e.target.value)
  //                   }
  //                   className="w-full border p-2 rounded"
  //                   placeholder={`Image ${i + 1}`}
  //                 />
  //               ))}

  //             {isServices &&
  //               Array.from({ length: 12 }).map((_, i) => (
  //                 <input
  //                   key={i}
  //                   value={editedSection.items?.[i] || ""}
  //                   onChange={(e) =>
  //                     updateArrayField("items", i, e.target.value)
  //                   }
  //                   className="w-full border p-2 rounded"
  //                   placeholder={`Service ${i + 1}`}
  //                 />
  //               ))}
  //           </div>

  //           {/* RIGHT */}
  //           <div className="lg:col-span-2 bg-white p-4 rounded-xl">

  //             {editedSection.imageUrl && (
  //               <img
  //                 src={editedSection.imageUrl}
  //                 className="rounded mb-3"
  //               />
  //             )}

  //             {editedSection.images?.map((img, i) => (
  //               <img key={i} src={img} className="rounded mb-2" />
  //             ))}

  //             <h3 className="font-bold text-lg">
  //               {editedSection.title}
  //             </h3>

  //             <p className="text-sm text-gray-500">
  //               {showSubtitle ? editedSection.subtitle : null}
  //             </p>

  //             {editedSection.items && (
  //               <ul className="text-sm mt-2 list-disc pl-4">
  //                 {editedSection.items.map((item, i) => (
  //                   <li key={i}>{item}</li>
  //                 ))}
  //               </ul>
  //             )}
  //           </div>
  //         </div>
  //       </div>

  //       {/* MICRO SERVICES (UNCHANGED CALLS) */}
  //       <WeddingVenuesManagerMicroService />
  //       <WeddingServicesManagerMicroService />
  //       <WeddingPackagesManagerMicroService />
  //       <WeddingRoomBlocksManagerMicroService />
  //       <WeddingGalleryManagerMicroService />
  //     </section>
  //   );
  // }






// import { useEffect, useState } from "react";
// import {
//   Save,
//   RotateCcw,
//   Check,
//   AlertCircle,
//   Plus,
//   Trash2,
//   Image as ImageIcon,
// } from "lucide-react";

// const API_URL = "http://127.0.0.1:8000/api";

// const apiRequest = async (url, method = "GET", body = null, token = null) => {
//   const options = {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   if (token) {
//     options.headers["Authorization"] = `Bearer ${token}`;
//   }

//   if (body) {
//     options.body = JSON.stringify(body);
//   }

//   const response = await fetch(`${API_URL}${url}`, options);
//   return await response.json();
// };

// // API Endpoints mapping
// const API_ENDPOINTS = {
//   slides: "/wedding/slides",
//   section1: "/wedding/section1/venue",
//   section2: "/wedding/section2/easy-plan",
//   section3: "/wedding/section3/apartment",
//   section4: "/wedding/section4/accommodations",
//   section5: "/wedding/section5/location",
//   section6: "/wedding/section6/gallery",
// };

// const ADMIN_ENDPOINTS = {
//   slides: "/admin/wedding/slides",
//   section1: "/admin/wedding/section1/venue",
//   section2: "/admin/wedding/section2/easy-plan",
//   section3: "/admin/wedding/section3/apartment",
//   section4: "/admin/wedding/section4/accommodations",
//   section5: "/admin/wedding/section5/location",
//   section6: "/admin/wedding/section6/gallery",
// };

// const sectionLabels = {
//   slides: "Wedding Slides (Hero Slider)",
//   section1: "Wedding Venues Luxury",
//   section2: "Easy to Plan",
//   section3: "Prime Luxury Apartment Living",
//   section4: "Wedding Accommodations",
//   section5: "Location",
//   section6: "Gallery Images",
// };

// export default function WeddingManager() {
//   const [data, setData] = useState({});
//   const [activeSection, setActiveSection] = useState("slides");
//   const [editedSection, setEditedSection] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [editingSlideIndex, setEditingSlideIndex] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     } else {
//       setError("Please login first");
//     }
//   }, []);

//   const fetchAllSections = async () => {
//     setLoading(true);
//     const fetchedData = {};

//     // Fetch slides (multiple records)
//     const slidesResult = await apiRequest(API_ENDPOINTS.slides, "GET");
//     if (slidesResult.success) {
//       fetchedData.slides = slidesResult.data;
//     } else {
//       fetchedData.slides = [];
//     }

//     // Fetch single-record sections
//     const singleSections = ["section1", "section2", "section3", "section4", "section5", "section6"];
    
//     for (const section of singleSections) {
//       const result = await apiRequest(API_ENDPOINTS[section], "GET");
//       if (result.success && result.data) {
//         fetchedData[section] = result.data;
//       } else {
//         fetchedData[section] = getEmptySection(section);
//       }
//     }

//     setData(fetchedData);
//     setEditedSection(fetchedData[activeSection]);
//     setLoading(false);
//   };

//   const getEmptySection = (section) => {
//     switch (section) {
//       case "section1":
//         return { title: "", subtitle: "", description: "", images: [] };
//       case "section2":
//         return { title: "", description: "", image_url: "", features: [] };
//       case "section3":
//         return { title: "", subtitle: "", description: "", image_url: "", amenities: [] };
//       case "section4":
//         return { title: "", subtitle: "", description: "", image_url: "", amenities: [] };
//       case "section5":
//         return { title: "", subtitle: "", description: "", image_url: "", features: [] };
//       case "section6":
//         return { images: [] };
//       default:
//         return {};
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchAllSections();
//     }
//   }, [token]);

//   const switchSection = (key) => {
//     if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
//     setActiveSection(key);
//     setEditedSection(data[key] || (key === "slides" ? [] : getEmptySection(key)));
//     setEditingSlideIndex(null);
//     setHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   // Slide management functions
//   const addNewSlide = () => {
//     setEditingSlideIndex(-1);
//     setEditedSection({
//       title: "",
//       subtitle: "",
//       description: "",
//       image_url: "",
//     });
//     setHasChanges(true);
//   };

//   const editSlide = (index) => {
//     setEditingSlideIndex(index);
//     setEditedSection({ ...data.slides[index] });
//     setHasChanges(false);
//   };

//   const cancelEditSlide = () => {
//     setEditingSlideIndex(null);
//     setEditedSection(data.slides);
//     setHasChanges(false);
//   };

//   const saveSlide = async () => {
//     if (editingSlideIndex === -1) {
//       // Create new slide
//       const result = await apiRequest(ADMIN_ENDPOINTS.slides, "POST", editedSection, token);
//       if (result.success) {
//         await fetchAllSections();
//         setEditingSlideIndex(null);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 2500);
//       } else {
//         setError(result.message || "Error creating slide");
//       }
//     } else {
//       // Update existing slide
//       const slideId = data.slides[editingSlideIndex].id;
//       const result = await apiRequest(`${ADMIN_ENDPOINTS.slides}/${slideId}`, "PUT", editedSection, token);
//       if (result.success) {
//         await fetchAllSections();
//         setEditingSlideIndex(null);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 2500);
//       } else {
//         setError(result.message || "Error updating slide");
//       }
//     }
//   };

//   const deleteSlide = async (index) => {
//     if (!confirm("Delete this slide?")) return;
//     const slideId = data.slides[index].id;
//     const result = await apiRequest(`${ADMIN_ENDPOINTS.slides}/${slideId}`, "DELETE", null, token);
//     if (result.success) {
//       await fetchAllSections();
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error deleting slide");
//     }
//   };

//   // Single section save (create or update)
//   const saveSingleSection = async () => {
//     const endpoint = ADMIN_ENDPOINTS[activeSection];
//     const getEndpoint = API_ENDPOINTS[activeSection];
    
//     // Check if exists
//     const existing = await apiRequest(getEndpoint, "GET");
    
//     let result;
//     if (existing.success && existing.data && existing.data.id) {
//       // Update
//       result = await apiRequest(`${endpoint}/${existing.data.id}`, "PUT", editedSection, token);
//     } else {
//       // Create
//       result = await apiRequest(endpoint, "POST", editedSection, token);
//     }
    
//     if (result.success) {
//       await fetchAllSections();
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error saving data");
//     }
//   };

//   const handleSave = () => {
//     if (activeSection === "slides") {
//       saveSlide();
//     } else {
//       saveSingleSection();
//     }
//   };

//   const handleReset = () => {
//     setEditedSection(data[activeSection]);
//     setHasChanges(false);
//     setError(null);
//   };

//   const updateField = (field, value) => {
//     setEditedSection({ ...editedSection, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const updateArrayField = (arrayName, index, value) => {
//     const newArray = [...(editedSection[arrayName] || [])];
//     newArray[index] = value;
//     updateField(arrayName, newArray);
//   };

//   const addArrayItem = (arrayName) => {
//     const newArray = [...(editedSection[arrayName] || []), ""];
//     updateField(arrayName, newArray);
//   };

//   const removeArrayItem = (arrayName, index) => {
//     const newArray = [...(editedSection[arrayName] || [])];
//     newArray.splice(index, 1);
//     updateField(arrayName, newArray);
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
//           <p className="text-gray-500 mt-2">Please login to manage wedding content</p>
//         </div>
//       </div>
//     );
//   }

//   // Determine what fields to show based on section
//   const isSlides = activeSection === "slides";
//   const isSection1 = activeSection === "section1";
//   const isSection2 = activeSection === "section2";
//   const isSection3 = activeSection === "section3";
//   const isSection4 = activeSection === "section4";
//   const isSection5 = activeSection === "section5";
//   const isSection6 = activeSection === "section6";

//   // Slide editor view
//   if (isSlides && editingSlideIndex !== null) {
//     const isNew = editingSlideIndex === -1;
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold">{isNew ? "Add New Slide" : "Edit Slide"}</h2>
//             <p className="text-sm text-gray-500">Create a new wedding hero slide</p>
//           </div>
//           <button
//             onClick={cancelEditSlide}
//             className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={editedSection.title || ""}
//                 onChange={(e) => updateField("title", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Exclusive Wedding Experience"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={editedSection.subtitle || ""}
//                 onChange={(e) => updateField("subtitle", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Create The Wedding You've Always Dreamed Of"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={editedSection.description || ""}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Image URL</label>
//               <input
//                 value={editedSection.image_url || ""}
//                 onChange={(e) => updateField("image_url", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="https://example.com/image.jpg"
//               />
//             </div>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {editedSection.image_url && (
//               <img src={editedSection.image_url} alt="Preview" className="rounded-lg mb-3 w-full" />
//             )}
//             {editedSection.title && <h2 className="font-bold text-xl">{editedSection.title}</h2>}
//             {editedSection.subtitle && <p className="text-amber-600 text-sm">{editedSection.subtitle}</p>}
//             {editedSection.description && <p className="text-gray-600 text-sm mt-2">{editedSection.description}</p>}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg">Cancel</button>
//           <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//             {isNew ? "Create Slide" : "Update Slide"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Slide list view
//   if (isSlides && editingSlideIndex === null) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">Wedding Hero Slides</h2>
//             <p className="text-sm text-gray-500">Manage your wedding hero slider images and content</p>
//           </div>
//           <button
//             onClick={addNewSlide}
//             className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
//           >
//             <Plus size={16} /> Add New Slide
//           </button>
//         </div>

//         <div className="space-y-3">
//           {data.slides?.map((slide, index) => (
//             <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center">
//               <img src={slide.image_url} alt={slide.title} className="w-24 h-24 object-cover rounded" />
//               <div className="flex-1">
//                 <h3 className="font-semibold">{slide.title}</h3>
//                 <p className="text-sm text-gray-500">{slide.subtitle}</p>
//                 <p className="text-sm text-gray-600 line-clamp-2">{slide.description}</p>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => editSlide(index)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//                 <button onClick={() => deleteSlide(index)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//               </div>
//             </div>
//           ))}
//           {(!data.slides || data.slides.length === 0) && (
//             <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Section 1: Wedding Venues Luxury (with 2 images)
//   if (isSection1) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">Wedding Venues Luxury</h2>
//             <p className="text-sm text-gray-500">Edit the content for this section</p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={handleReset} className="px-3 py-2 border rounded-lg flex items-center gap-2"><RotateCcw size={15} /> Reset</button>
//             <button onClick={handleSave} disabled={!hasChanges} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}><Save size={15} /> Save</button>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div><label className="block text-sm font-medium mb-1">Title</label><input value={editedSection.title || ""} onChange={(e) => updateField("title", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
//             <div><label className="block text-sm font-medium mb-1">Subtitle</label><input value={editedSection.subtitle || ""} onChange={(e) => updateField("subtitle", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
//             <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={editedSection.description || ""} onChange={(e) => updateField("description", e.target.value)} className="w-full border rounded-lg p-2.5" rows={4} /></div>
//             <div><label className="block text-sm font-medium mb-1">Image 1</label><input value={editedSection.images?.[0] || ""} onChange={(e) => updateArrayField("images", 0, e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Image 1 URL" /></div>
//             <div><label className="block text-sm font-medium mb-1">Image 2</label><input value={editedSection.images?.[1] || ""} onChange={(e) => updateArrayField("images", 1, e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Image 2 URL" /></div>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {editedSection.images?.map((img, i) => img && <img key={i} src={img} className="rounded-lg mb-2 w-full" />)}
//             <h2 className="font-bold text-xl mt-2">{editedSection.title}</h2>
//             <p className="text-amber-600 text-sm">{editedSection.subtitle}</p>
//             <p className="text-gray-600 text-sm mt-2">{editedSection.description}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Section 2: Easy to Plan
//   if (isSection2) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div><h2 className="text-xl font-bold">Easy to Plan</h2></div>
//           <div className="flex gap-2">
//             <button onClick={handleReset} className="px-3 py-2 border rounded-lg"><RotateCcw size={15} /> Reset</button>
//             <button onClick={handleSave} disabled={!hasChanges} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}><Save size={15} /> Save</button>
//           </div>
//         </div>
//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div><label className="block text-sm font-medium mb-1">Title</label><input value={editedSection.title || ""} onChange={(e) => updateField("title", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
//             <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={editedSection.description || ""} onChange={(e) => updateField("description", e.target.value)} className="w-full border rounded-lg p-2.5" rows={4} /></div>
//             <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={editedSection.image_url || ""} onChange={(e) => updateField("image_url", e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
//             <div><label className="block text-sm font-medium mb-2">Features</label>{editedSection.features?.map((f, i) => (<div key={i} className="flex gap-2 mb-2"><input value={f} onChange={(e) => updateArrayField("features", i, e.target.value)} className="flex-1 border rounded-lg p-2" /><button onClick={() => removeArrayItem("features", i)} className="px-3 bg-red-500 text-white rounded">×</button></div>))}<button onClick={() => addArrayItem("features")} className="text-sm text-amber-600 flex items-center gap-1"><Plus size={14} /> Add Feature</button></div>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {editedSection.image_url && <img src={editedSection.image_url} className="rounded-lg mb-3 w-full" />}
//             <h2 className="font-bold text-xl">{editedSection.title}</h2>
//             <p className="text-gray-600 text-sm mt-2">{editedSection.description}</p>
//             <ul className="mt-3 space-y-1">{editedSection.features?.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm"><span className="text-amber-500">•</span> {f}</li>)}</ul>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Similar for sections 3, 4, 5 (same pattern with amenities)
//   // Section 6: Gallery (only images)
//   if (isSection6) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div><h2 className="text-xl font-bold">Gallery Images</h2><p className="text-sm text-gray-500">Manage your wedding gallery images (no text, only images)</p></div>
//           <div className="flex gap-2">
//             <button onClick={handleReset} className="px-3 py-2 border rounded-lg"><RotateCcw size={15} /> Reset</button>
//             <button onClick={handleSave} disabled={!hasChanges} className={`px-4 py-2 rounded-lg ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300"}`}><Save size={15} /> Save</button>
//           </div>
//         </div>
//         <div className="grid lg:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">Images</label>
//             {editedSection.images?.map((img, i) => (
//               <div key={i} className="flex gap-2 mb-2">
//                 <input value={img} onChange={(e) => updateArrayField("images", i, e.target.value)} className="flex-1 border rounded-lg p-2.5" placeholder={`Image ${i + 1} URL`} />
//                 <button onClick={() => removeArrayItem("images", i)} className="px-3 bg-red-500 text-white rounded-lg">×</button>
//               </div>
//             ))}
//             <button onClick={() => addArrayItem("images")} className="text-sm text-amber-600 flex items-center gap-1 mt-2"><Plus size={14} /> Add Image</button>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             <div className="grid grid-cols-2 gap-2">
//               {editedSection.images?.map((img, i) => img && <img key={i} src={img} className="rounded-lg w-full h-32 object-cover" />)}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Section 3, 4, 5 would follow similar patterns
  
//   return (
//     <div className="p-6">
//       {/* Tabs */}
//       <div className="grid grid-cols-7 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 mb-6">
//         {Object.entries(sectionLabels).map(([key, label]) => (
//           <button key={key} onClick={() => switchSection(key)} className={`text-xs p-2 rounded-lg transition-all ${activeSection === key ? "bg-white shadow font-medium" : "hover:bg-slate-50"}`}>{label}</button>
//         ))}
//       </div>
//     </div>
//   );
// }














































// import { useEffect, useState } from "react";
// import { loadSiteData, saveSiteData } from "../data/store";
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
// } from "lucide-react";

// import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
// import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
// import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
// import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
// import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

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

// const sectionLabels = {
//   hero: "Hero Section",
//   envision_your_special_day: "Envision Your Special Day Section",
//   services: "Services Section",
//   why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
//   prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
//   wedding_accommodations: "Wedding Accommodations Section",
//   Location: "Location Section",
//   multiple_images: "Multiple Images Section",
// };

// export default function WeddingManager() {
//   const [data, setData] = useState(null);
//   const [activeSection, setActiveSection] = useState("hero");
//   const [editedSection, setEditedSection] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [editingSlideIndex, setEditingSlideIndex] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [slides, setSlides] = useState([]);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   // Fetch slides from backend
//   const fetchSlides = async () => {
//     try {
//       const result = await apiRequest("/wedding/slides", "GET");
//       if (result.success) {
//         const sorted = result.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
//         return sorted;
//       }
//       return [];
//     } catch (err) {
//       console.error("Fetch error:", err);
//       return [];
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       const loadData = async () => {
//         setLoading(true);
//         const fetchedSlides = await fetchSlides();
//         setSlides(fetchedSlides);
        
//         const siteData = loadSiteData();
//         setData(siteData);
        
//         if (activeSection === "hero") {
//           setEditedSection({ images: fetchedSlides.map(s => s.image_url) });
//         } else {
//           setEditedSection({ ...siteData.homepage[activeSection] });
//         }
//         setLoading(false);
//       };
//       loadData();
//     }
//   }, [token]);

//   const switchSection = (key) => {
//     if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
//     setActiveSection(key);
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
    
//     if (key === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[key] });
//     }
//     setHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   const updateField = (field, value) => {
//     setEditedSection({ ...editedSection, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const addNewSlide = () => {
//     setEditingSlideIndex(-1);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({
//       title: "",
//       subtitle: "",
//       description: "",
//       image_url: "",
//       sort_order: slides.length + 1,
//     });
//     setHasChanges(true);
//   };

//   const editSlide = (index) => {
//     setEditingSlideIndex(index);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ 
//       ...slides[index],
//     });
//     setHasChanges(false);
//   };

//   const cancelEditSlide = () => {
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ images: slides.map(s => s.image_url) });
//     setHasChanges(false);
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   const saveSlide = async () => {
//     setUploading(true);
//     setError(null);
    
//     // Create FormData for file upload
//     const formData = new FormData();
//     formData.append("title", editedSection.title || "");
//     formData.append("subtitle", editedSection.subtitle || "");
//     formData.append("description", editedSection.description || "");
//     formData.append("sort_order", editedSection.sort_order || slides.length + 1);
    
//     // If there's a selected file, add it as 'image' (matches your backend field name)
//     if (selectedFile) {
//       formData.append("image", selectedFile);
//     } else if (editedSection.image_url && !selectedFile) {
//       // If using URL instead of file upload, you need to handle differently
//       // Your backend expects 'image' as file, not URL
//       // So we'll use the URL approach for existing images
//       formData.append("image_url", editedSection.image_url);
//     }
    
//     let result;
//     if (editingSlideIndex === -1) {
//       // Create new slide - POST with FormData
//       result = await apiRequest("/admin/wedding/slides", "POST", formData, token, true);
//     } else {
//       // Update existing slide - POST with _method PUT
//       formData.append("_method", "PUT");
//       const slideId = slides[editingSlideIndex].id;
//       result = await apiRequest(`/admin/wedding/slides/${slideId}`, "POST", formData, token, true);
//     }
    
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error saving slide");
//       if (result.errors) {
//         const errorMessages = Object.values(result.errors).flat().join(", ");
//         setError(errorMessages);
//       }
//     }
//     setUploading(false);
//   };

//   const deleteSlide = async (index) => {
//     if (!confirm("Delete this slide?")) return;
//     const slideId = slides[index].id;
//     const result = await apiRequest(`/admin/wedding/slides/${slideId}`, "DELETE", null, token);
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
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
//       await apiRequest(`/admin/wedding/slides/${newSlides[i].id}`, "PUT", { sort_order: i + 1 }, token);
//     }

//     const freshSlides = await fetchSlides();
//     setSlides(freshSlides);
//     setEditedSection({ images: freshSlides.map(s => s.image_url) });
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const handleSave = () => {
//     if (activeSection === "hero") {
//       if (editingSlideIndex !== null) {
//         saveSlide();
//       }
//     } else {
//       const updated = {
//         ...data,
//         homepage: {
//           ...data.homepage,
//           [activeSection]: editedSection,
//         },
//       };
//       saveSiteData(updated);
//       setData(updated);
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     }
//   };

//   const handleReset = () => {
//     if (activeSection === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[activeSection] });
//     }
//     setHasChanges(true);
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
//           <p className="text-gray-500 mt-2">Please login to manage wedding content</p>
//         </div>
//       </div>
//     );
//   }

//   // Hero Section Slide Editor View
//   if (activeSection === "hero" && editingSlideIndex !== null) {
//     const isNew = editingSlideIndex === -1;
//     const previewImage = imagePreview || editedSection.image_url;
    
//     return (
//       <section>
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-bold">{isNew ? "Add New Slide" : "Edit Slide"}</h2>
//               <p className="text-sm text-gray-500">Upload an image from your computer for the hero slider</p>
//             </div>
//             <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//               Cancel
//             </button>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-6">
//             <div className="space-y-4 bg-white p-6 rounded-xl">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Title</label>
//                 <input
//                   value={editedSection.title || ""}
//                   onChange={(e) => updateField("title", e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder="e.g., Exclusive Wedding Experience"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Subtitle</label>
//                 <input
//                   value={editedSection.subtitle || ""}
//                   onChange={(e) => updateField("subtitle", e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder="e.g., Luxury Wedding Venue"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Description</label>
//                 <textarea
//                   value={editedSection.description || ""}
//                   onChange={(e) => updateField("description", e.target.value)}
//                   className="w-full border p-2 rounded"
//                   rows={4}
//                   placeholder="Enter description"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Image</label>
//                 <div className="flex gap-2">
//                   <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm w-full justify-center">
//                     <Upload size={16} />
//                     Select Image from Computer
//                     <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//                   </label>
//                 </div>
//                 {selectedFile && (
//                   <p className="text-xs text-emerald-600 mt-2">Selected: {selectedFile.name}</p>
//                 )}
//                 {editedSection.image_url && !selectedFile && (
//                   <p className="text-xs text-gray-400 mt-2">Current image will be kept if no new image selected</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Display Order</label>
//                 <input
//                   type="number"
//                   value={editedSection.sort_order || slides.length + 1}
//                   onChange={(e) => updateField("sort_order", parseInt(e.target.value))}
//                   className="w-full border p-2 rounded"
//                   placeholder="Order number (lower = appears first)"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">Slides are displayed in ascending order</p>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="font-semibold mb-3">Preview</h3>
//               {previewImage && <img src={previewImage} className="rounded mb-3 w-full" alt="Preview" />}
//               {editedSection.title && <h3 className="font-bold text-lg">{editedSection.title}</h3>}
//               {editedSection.subtitle && <p className="text-sm text-amber-600">{editedSection.subtitle}</p>}
//               {editedSection.description && <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>}
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg">Cancel</button>
//             <button onClick={saveSlide} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
//               {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//               {isNew ? "Create Slide" : "Update Slide"}
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Hero Section Slides List View
//   if (activeSection === "hero" && editingSlideIndex === null) {
//     return (
//       <section>
//         <div className="space-y-6">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//               <p className="mt-1 text-sm text-slate-500">Edit the Hero Section content - Wedding Slides</p>
//             </div>
//             <div className="flex items-center gap-2">
//               {saved && (
//                 <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//                   <Check size={16} /> Saved successfully
//                 </span>
//               )}
//               <button onClick={addNewSlide} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//                 <Plus size={16} /> Add New Slide
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//               <AlertCircle size={16} /> {error}
//             </div>
//           )}

//           <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 mb-6">
//             {Object.entries(sectionLabels).map(([key, label]) => (
//               <button
//                 key={key}
//                 onClick={() => switchSection(key)}
//                 className={`text-[10px] p-2 rounded-lg ${activeSection === key ? "bg-white shadow" : ""}`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>

//           <div className="space-y-3">
//             {slides?.map((slide, index) => {
//               const imageUrl = slide.image_url && !slide.image_url.startsWith("http") 
//                 ? `http://127.0.0.1:8000/storage/${slide.image_url}` 
//                 : slide.image_url;
                
//               return (
//                 <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center">
//                   <img src={imageUrl} alt={slide.title} className="w-24 h-24 object-cover rounded" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold">{slide.title}</h3>
//                     <p className="text-sm text-gray-500">{slide.subtitle}</p>
//                     <p className="text-sm text-gray-600 line-clamp-2">{slide.description}</p>
//                     <p className="text-xs text-gray-400 mt-1">Order: {slide.sort_order || index + 1}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     {index > 0 && (
//                       <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
//                         <ArrowUp size={16} />
//                       </button>
//                     )}
//                     {index < slides.length - 1 && (
//                       <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
//                         <ArrowDown size={16} />
//                       </button>
//                     )}
//                     <button onClick={() => editSlide(index)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//                     <button onClick={() => deleteSlide(index)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//                   </div>
//                 </div>
//               );
//             })}
//             {(!slides || slides.length === 0) && (
//               <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
//             )}
//           </div>
//         </div>

//         <WeddingVenuesManagerMicroService />
//         <WeddingServicesManagerMicroService />
//         <WeddingPackagesManagerMicroService />
//         <WeddingRoomBlocksManagerMicroService />
//         <WeddingGalleryManagerMicroService />
//       </section>
//     );
//   }

//   // Other sections placeholder
//   return (
//     <section>
//       <div className="space-y-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//             <p className="mt-1 text-sm text-slate-500">Edit the content displayed on your wedding</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {saved && (
//               <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//                 <Check size={16} /> Saved successfully
//               </span>
//             )}
//             <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
//               <RotateCcw size={15} /> Reset
//             </button>
//             <button onClick={handleSave} disabled={!hasChanges} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${hasChanges ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-slate-300 cursor-not-allowed"}`}>
//               <Save size={15} /> Save Changes
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
//           {Object.entries(sectionLabels).map(([key, label]) => (
//             <button
//               key={key}
//               onClick={() => switchSection(key)}
//               className={`text-[10px] p-2 rounded-lg ${activeSection === key ? "bg-white shadow" : ""}`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="text-center py-20 text-gray-500">
//           <p>This section will be integrated soon.</p>
//           <p className="text-sm mt-2">Currently working on Hero Section integration.</p>
//         </div>
//       </div>

//       <WeddingVenuesManagerMicroService />
//       <WeddingServicesManagerMicroService />
//       <WeddingPackagesManagerMicroService />
//       <WeddingRoomBlocksManagerMicroService />
//       <WeddingGalleryManagerMicroService />
//     </section>
//   );
// }




// import { useEffect, useState } from "react";
// import { loadSiteData, saveSiteData } from "../data/store";
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
// } from "lucide-react";

// import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
// import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
// import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
// import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
// import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

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

// const sectionLabels = {
//   hero: "Hero Section",
//   envision_your_special_day: "Envision Your Special Day Section",
//   services: "Services Section",
//   why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
//   prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
//   wedding_accommodations: "Wedding Accommodations Section",
//   Location: "Location Section",
//   multiple_images: "Multiple Images Section",
// };

// export default function WeddingManager() {
//   const [data, setData] = useState(null);
//   const [activeSection, setActiveSection] = useState("hero");
//   const [editedSection, setEditedSection] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [editingSlideIndex, setEditingSlideIndex] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [slides, setSlides] = useState([]);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   // Fetch slides from backend
//   const fetchSlides = async () => {
//     try {
//       const result = await apiRequest("/wedding/slides", "GET");
//       if (result.success) {
//         const sorted = result.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
//         return sorted;
//       }
//       return [];
//     } catch (err) {
//       console.error("Fetch error:", err);
//       return [];
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       const loadData = async () => {
//         setLoading(true);
//         const fetchedSlides = await fetchSlides();
//         setSlides(fetchedSlides);
        
//         const siteData = loadSiteData();
//         setData(siteData);
        
//         // Set initial edited section based on active section
//         if (activeSection === "hero") {
//           setEditedSection({ images: fetchedSlides.map(s => s.image_url) });
//         } else {
//           // For other sections, use existing data or default structure
//           const existingData = siteData?.homepage?.[activeSection];
//           setEditedSection(existingData || getDefaultSectionData(activeSection));
//         }
//         setLoading(false);
//       };
//       loadData();
//     }
//   }, [token]);

//   const getDefaultSectionData = (section) => {
//     switch (section) {
//       case "envision_your_special_day":
//         return { title: "", subtitle: "", description: "", images: [] };
//       case "services":
//         return { items: [] };
//       case "why_choose_luxury_garden_palace":
//         return { title: "", description: "", imageUrl: "", features: [] };
//       case "prime_luxury_apartment_living":
//         return { title: "", subtitle: "", description: "", imageUrl: "", amenities: [] };
//       case "wedding_accommodations":
//         return { title: "", subtitle: "", description: "", imageUrl: "", amenities: [] };
//       case "Location":
//         return { title: "", subtitle: "", description: "", imageUrl: "", features: [] };
//       case "multiple_images":
//         return { images: [] };
//       default:
//         return { title: "", subtitle: "", description: "" };
//     }
//   };

//   const switchSection = (key) => {
//     if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
//     setActiveSection(key);
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
    
//     if (key === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//     } else {
//       // For other sections, use existing data from local storage or default
//       const defaultData = loadSiteData();
//       const existingData = defaultData?.homepage?.[key];
//       setEditedSection(existingData || getDefaultSectionData(key));
//     }
//     setHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   const updateField = (field, value) => {
//     setEditedSection({ ...editedSection, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const updateArrayField = (field, index, value) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr[index] = value;
//     updateField(field, arr);
//   };

//   const addArrayItem = (field) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr.push("");
//     updateField(field, arr);
//   };

//   const removeArrayItem = (field, index) => {
//     const arr = [...editedSection[field]];
//     arr.splice(index, 1);
//     updateField(field, arr);
//   };

//   // Slide management functions (for hero section)
//   const addNewSlide = () => {
//     setEditingSlideIndex(-1);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({
//       title: "",
//       subtitle: "",
//       description: "",
//       image_url: "",
//       sort_order: slides.length + 1,
//     });
//     setHasChanges(true);
//   };

//   const editSlide = (index) => {
//     setEditingSlideIndex(index);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ 
//       ...slides[index],
//     });
//     setHasChanges(false);
//   };

//   const cancelEditSlide = () => {
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ images: slides.map(s => s.image_url) });
//     setHasChanges(false);
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   const saveSlide = async () => {
//     setUploading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", editedSection.title || "");
//     formData.append("subtitle", editedSection.subtitle || "");
//     formData.append("description", editedSection.description || "");
//     formData.append("sort_order", editedSection.sort_order || slides.length + 1);
    
//     if (selectedFile) {
//       formData.append("image", selectedFile);
//     } else if (editedSection.image_url && !selectedFile) {
//       formData.append("image_url", editedSection.image_url);
//     }
    
//     let result;
//     if (editingSlideIndex === -1) {
//       result = await apiRequest("/admin/wedding/slides", "POST", formData, token, true);
//     } else {
//       formData.append("_method", "PUT");
//       const slideId = slides[editingSlideIndex].id;
//       result = await apiRequest(`/admin/wedding/slides/${slideId}`, "POST", formData, token, true);
//     }
    
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error saving slide");
//       if (result.errors) {
//         const errorMessages = Object.values(result.errors).flat().join(", ");
//         setError(errorMessages);
//       }
//     }
//     setUploading(false);
//   };

//   const deleteSlide = async (index) => {
//     if (!confirm("Delete this slide?")) return;
//     const slideId = slides[index].id;
//     const result = await apiRequest(`/admin/wedding/slides/${slideId}`, "DELETE", null, token);
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
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
//       await apiRequest(`/admin/wedding/slides/${newSlides[i].id}`, "PUT", { sort_order: i + 1 }, token);
//     }

//     const freshSlides = await fetchSlides();
//     setSlides(freshSlides);
//     setEditedSection({ images: freshSlides.map(s => s.image_url) });
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const handleSave = () => {
//     if (activeSection === "hero") {
//       if (editingSlideIndex !== null) {
//         saveSlide();
//       }
//     } else {
//       // For other sections, save to local storage
//       const updated = {
//         ...data,
//         homepage: {
//           ...data.homepage,
//           [activeSection]: editedSection,
//         },
//       };
//       saveSiteData(updated);
//       setData(updated);
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     }
//   };

//   const handleReset = () => {
//     if (activeSection === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[activeSection] });
//     }
//     setHasChanges(true);
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
//           <p className="text-gray-500 mt-2">Please login to manage wedding content</p>
//         </div>
//       </div>
//     );
//   }

//   // Hero Section Slide Editor View
//   if (activeSection === "hero" && editingSlideIndex !== null) {
//     const isNew = editingSlideIndex === -1;
//     const previewImage = imagePreview || editedSection.image_url;
    
//     return (
//       <section>
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-bold">{isNew ? "Add New Slide" : "Edit Slide"}</h2>
//               <p className="text-sm text-gray-500">Upload an image from your computer for the hero slider</p>
//             </div>
//             <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//               Cancel
//             </button>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-6">
//             <div className="space-y-4 bg-white p-6 rounded-xl">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Title</label>
//                 <input
//                   value={editedSection.title || ""}
//                   onChange={(e) => updateField("title", e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder="e.g., Exclusive Wedding Experience"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Subtitle</label>
//                 <input
//                   value={editedSection.subtitle || ""}
//                   onChange={(e) => updateField("subtitle", e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder="e.g., Luxury Wedding Venue"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Description</label>
//                 <textarea
//                   value={editedSection.description || ""}
//                   onChange={(e) => updateField("description", e.target.value)}
//                   className="w-full border p-2 rounded"
//                   rows={4}
//                   placeholder="Enter description"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Image</label>
//                 <div className="flex gap-2">
//                   <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm w-full justify-center">
//                     <Upload size={16} />
//                     Select Image from Computer
//                     <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//                   </label>
//                 </div>
//                 {selectedFile && (
//                   <p className="text-xs text-emerald-600 mt-2">Selected: {selectedFile.name}</p>
//                 )}
//                 {editedSection.image_url && !selectedFile && (
//                   <p className="text-xs text-gray-400 mt-2">Current image will be kept if no new image selected</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Display Order</label>
//                 <input
//                   type="number"
//                   value={editedSection.sort_order || slides.length + 1}
//                   onChange={(e) => updateField("sort_order", parseInt(e.target.value))}
//                   className="w-full border p-2 rounded"
//                   placeholder="Order number (lower = appears first)"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">Slides are displayed in ascending order</p>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="font-semibold mb-3">Preview</h3>
//               {previewImage && <img src={previewImage} className="rounded mb-3 w-full" alt="Preview" />}
//               {editedSection.title && <h3 className="font-bold text-lg">{editedSection.title}</h3>}
//               {editedSection.subtitle && <p className="text-sm text-amber-600">{editedSection.subtitle}</p>}
//               {editedSection.description && <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>}
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg">Cancel</button>
//             <button onClick={saveSlide} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
//               {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//               {isNew ? "Create Slide" : "Update Slide"}
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Hero Section Slides List View
//   if (activeSection === "hero" && editingSlideIndex === null) {
//     return (
//       <section>
//         <div className="space-y-6">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//               <p className="mt-1 text-sm text-slate-500">Edit the Hero Section content - Wedding Slides</p>
//             </div>
//             <div className="flex items-center gap-2">
//               {saved && (
//                 <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//                   <Check size={16} /> Saved successfully
//                 </span>
//               )}
//               <button onClick={addNewSlide} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//                 <Plus size={16} /> Add New Slide
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//               <AlertCircle size={16} /> {error}
//             </div>
//           )}

//           <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 mb-6">
//             {Object.entries(sectionLabels).map(([key, label]) => (
//               <button
//                 key={key}
//                 onClick={() => switchSection(key)}
//                 className={`text-[10px] p-2 rounded-lg ${activeSection === key ? "bg-white shadow" : ""}`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>

//           <div className="space-y-3">
//             {slides?.map((slide, index) => {
//               const imageUrl = slide.image_url && !slide.image_url.startsWith("http") 
//                 ? `http://127.0.0.1:8000/storage/${slide.image_url}` 
//                 : slide.image_url;
                
//               return (
//                 <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center">
//                   <img src={imageUrl} alt={slide.title} className="w-24 h-24 object-cover rounded" />
//                   <div className="flex-1">
//                     <h3 className="font-semibold">{slide.title}</h3>
//                     <p className="text-sm text-gray-500">{slide.subtitle}</p>
//                     <p className="text-sm text-gray-600 line-clamp-2">{slide.description}</p>
//                     <p className="text-xs text-gray-400 mt-1">Order: {slide.sort_order || index + 1}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     {index > 0 && (
//                       <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
//                         <ArrowUp size={16} />
//                       </button>
//                     )}
//                     {index < slides.length - 1 && (
//                       <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
//                         <ArrowDown size={16} />
//                       </button>
//                     )}
//                     <button onClick={() => editSlide(index)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//                     <button onClick={() => deleteSlide(index)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//                   </div>
//                 </div>
//               );
//             })}
//             {(!slides || slides.length === 0) && (
//               <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
//             )}
//           </div>
//         </div>

//         <WeddingVenuesManagerMicroService />
//         <WeddingServicesManagerMicroService />
//         <WeddingPackagesManagerMicroService />
//         <WeddingRoomBlocksManagerMicroService />
//         <WeddingGalleryManagerMicroService />
//       </section>
//     );
//   }

//   // =========================
//   // OTHER SECTIONS - FULL UI WITH INPUTS
//   // =========================

//   const showTitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showSubtitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showImage = !["why_choose_luxury_garden_palace", "services"].includes(activeSection);
//   const isTwoImages = activeSection === "envision_your_special_day" || activeSection === "prime_luxury_apartment_living";
//   const isFourImages = activeSection === "multiple_images" || activeSection === "hero";
//   const isServices = activeSection === "services";
//   const isFeatures = activeSection === "why_choose_luxury_garden_palace" || activeSection === "Location";
//   const isAmenities = activeSection === "prime_luxury_apartment_living" || activeSection === "wedding_accommodations";

//   return (
//     <section>
//       <div className="space-y-6">

//         {/* HEADER */}
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//             <p className="mt-1 text-sm text-slate-500">Edit the content displayed on your wedding</p>
//             {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//           </div>

//           <div className="flex items-center gap-2">
//             {saved && (
//               <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//                 <Check size={16} /> Saved successfully
//               </span>
//             )}
//             <button
//               onClick={handleReset}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//             >
//               <RotateCcw size={15} /> Reset
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={!hasChanges}
//               className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
//                 hasChanges
//                   ? "bg-gradient-to-r from-amber-500 to-amber-600"
//                   : "bg-slate-300 cursor-not-allowed"
//               }`}
//             >
//               <Save size={15} /> Save Changes
//             </button>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
//           {Object.entries(sectionLabels).map(([key, label]) => (
//             <button
//               key={key}
//               onClick={() => switchSection(key)}
//               className={`text-[10px] p-2 rounded-lg ${
//                 activeSection === key ? "bg-white shadow" : ""
//               }`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="grid lg:grid-cols-5 gap-6">

//           {/* LEFT - EDIT FORM */}
//           <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">
//             {showTitle && (
//               <input
//                 value={editedSection?.title || ""}
//                 onChange={(e) => updateField("title", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="Title"
//               />
//             )}

//             {showSubtitle && (
//               <input
//                 value={editedSection?.subtitle || ""}
//                 onChange={(e) => updateField("subtitle", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="Subtitle"
//               />
//             )}

//             {activeSection !== "multiple_images" && activeSection !== "services" && (
//               <textarea
//                 value={editedSection?.description || ""}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 rows={4}
//                 placeholder="Description"
//               />
//             )}

//             {showImage && !isTwoImages && !isFourImages && (
//               <input
//                 value={editedSection?.imageUrl || ""}
//                 onChange={(e) => updateField("imageUrl", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="Image URL"
//               />
//             )}

//             {isTwoImages &&
//               [0, 1].map((i) => (
//                 <input
//                   key={i}
//                   value={editedSection?.images?.[i] || ""}
//                   onChange={(e) => updateArrayField("images", i, e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder={`Image ${i + 1}`}
//                 />
//               ))}

//             {isFourImages &&
//               [0, 1, 2, 3].map((i) => (
//                 <input
//                   key={i}
//                   value={editedSection?.images?.[i] || ""}
//                   onChange={(e) => updateArrayField("images", i, e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder={`Image ${i + 1}`}
//                 />
//               ))}

//             {isServices &&
//               Array.from({ length: 12 }).map((_, i) => (
//                 <input
//                   key={i}
//                   value={editedSection?.items?.[i] || ""}
//                   onChange={(e) => updateArrayField("items", i, e.target.value)}
//                   className="w-full border p-2 rounded"
//                   placeholder={`Service ${i + 1}`}
//                 />
//               ))}

//             {/* Features for why_choose and Location */}
//             {isFeatures && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">Features</label>
//                 {editedSection?.features?.map((feature, idx) => (
//                   <div key={idx} className="flex gap-2 mb-2">
//                     <input
//                       value={feature}
//                       onChange={(e) => updateArrayField("features", idx, e.target.value)}
//                       className="flex-1 border p-2 rounded"
//                       placeholder={`Feature ${idx + 1}`}
//                     />
//                     <button
//                       onClick={() => removeArrayItem("features", idx)}
//                       className="px-3 bg-red-500 text-white rounded"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   onClick={() => addArrayItem("features")}
//                   className="text-sm text-amber-600 flex items-center gap-1"
//                 >
//                   + Add Feature
//                 </button>
//               </div>
//             )}

//             {/* Amenities for prime_luxury and accommodations */}
//             {isAmenities && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">Amenities</label>
//                 {editedSection?.amenities?.map((amenity, idx) => (
//                   <div key={idx} className="flex gap-2 mb-2">
//                     <input
//                       value={amenity}
//                       onChange={(e) => updateArrayField("amenities", idx, e.target.value)}
//                       className="flex-1 border p-2 rounded"
//                       placeholder={`Amenity ${idx + 1}`}
//                     />
//                     <button
//                       onClick={() => removeArrayItem("amenities", idx)}
//                       className="px-3 bg-red-500 text-white rounded"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   onClick={() => addArrayItem("amenities")}
//                   className="text-sm text-amber-600 flex items-center gap-1"
//                 >
//                   + Add Amenity
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* RIGHT - PREVIEW */}
//           <div className="lg:col-span-2 bg-white p-4 rounded-xl">
//             {editedSection?.imageUrl && (
//               <img src={editedSection.imageUrl} className="rounded mb-3 w-full" alt="Preview" />
//             )}
//             {editedSection?.images?.map((img, i) => (
//               img && <img key={i} src={img} className="rounded mb-2 w-full" alt={`Preview ${i + 1}`} />
//             ))}
//             <h3 className="font-bold text-lg">{editedSection?.title}</h3>
//             {showSubtitle && editedSection?.subtitle && (
//               <p className="text-sm text-amber-600">{editedSection.subtitle}</p>
//             )}
//             {editedSection?.description && (
//               <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>
//             )}
//             {editedSection?.features && editedSection.features.length > 0 && (
//               <ul className="text-sm mt-2 space-y-1">
//                 {editedSection.features.map((feature, i) => (
//                   feature && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {feature}</li>
//                 ))}
//               </ul>
//             )}
//             {editedSection?.amenities && editedSection.amenities.length > 0 && (
//               <ul className="text-sm mt-2 space-y-1">
//                 {editedSection.amenities.map((amenity, i) => (
//                   amenity && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {amenity}</li>
//                 ))}
//               </ul>
//             )}
//             {editedSection?.items && editedSection.items.length > 0 && (
//               <ul className="text-sm mt-2 list-disc pl-4">
//                 {editedSection.items.map((item, i) => (
//                   item && <li key={i}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* MICRO SERVICES */}
//       <WeddingVenuesManagerMicroService />
//       <WeddingServicesManagerMicroService />
//       <WeddingPackagesManagerMicroService />
//       <WeddingRoomBlocksManagerMicroService />
//       <WeddingGalleryManagerMicroService />
//     </section>
//   );
// }






















































// import { useEffect, useState } from "react";
// import { loadSiteData, saveSiteData } from "../data/store";
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
// } from "lucide-react";

// import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
// import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
// import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
// import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
// import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

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

// const sectionLabels = {
//   hero: "Hero Section",
//   envision_your_special_day: "Envision Your Special Day Section",
//   services: "Services Section",
//   why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
//   prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
//   wedding_accommodations: "Wedding Accommodations Section",
//   Location: "Location Section",
//   multiple_images: "Multiple Images Section",
// };

// // API Endpoints for Envision section
// const API_ENDPOINTS = {
//   envision_your_special_day: "/wedding/section1/venue",
// };

// const ADMIN_ENDPOINTS = {
//   envision_your_special_day: "/admin/wedding/section1/venue",
// };

// export default function WeddingManager() {
//   const [data, setData] = useState(null);
//   const [activeSection, setActiveSection] = useState("hero");
//   const [editedSection, setEditedSection] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [editingSlideIndex, setEditingSlideIndex] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [slides, setSlides] = useState([]);
//   const [envisionImages, setEnvisionImages] = useState([]);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   // Fetch slides from backend
//   const fetchSlides = async () => {
//     try {
//       const result = await apiRequest("/wedding/slides", "GET");
//       if (result.success) {
//         const sorted = result.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
//         return sorted;
//       }
//       return [];
//     } catch (err) {
//       console.error("Fetch error:", err);
//       return [];
//     }
//   };

//   // Fetch Envision section data from API
//   const fetchEnvisionData = async () => {
//     try {
//       const result = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//       if (result.success && result.data) {
//         return result.data;
//       }
//     } catch (err) {
//       console.error("Error fetching envision data:", err);
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (token) {
//       const loadData = async () => {
//         setLoading(true);
        
//         const fetchedSlides = await fetchSlides();
//         setSlides(fetchedSlides);
        
//         const envisionData = await fetchEnvisionData();
        
//         const siteData = loadSiteData();
        
//         const mergedData = {
//           ...siteData,
//           homepage: {
//             ...siteData?.homepage,
//             envisions: envisionData,
//           }
//         };
        
//         setData(mergedData);
        
//         if (activeSection === "hero") {
//           setEditedSection({ images: fetchedSlides.map(s => s.image_url) });
//         } else if (activeSection === "envision_your_special_day") {
//           setEditedSection(envisionData || { title: "", subtitle: "", description: "", images: [], image1_file: null, image2_file: null, image1_preview: null, image2_preview: null });
//           setEnvisionImages([envisionData?.images?.[0] || null, envisionData?.images?.[1] || null]);
//         } else {
//           setEditedSection({ ...siteData.homepage[activeSection] });
//         }
        
//         setLoading(false);
//       };
//       loadData();
//     }
//   }, [token]);

//   const switchSection = async (key) => {
//     if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
    
//     setActiveSection(key);
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
    
//     if (key === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//     } else if (key === "envision_your_special_day") {
//       try {
//         const result = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//         if (result.success && result.data) {
//           setEditedSection({ ...result.data, image1_file: null, image2_file: null, image1_preview: null, image2_preview: null });
//           setEnvisionImages([result.data.images?.[0] || null, result.data.images?.[1] || null]);
//         } else {
//           setEditedSection({ title: "", subtitle: "", description: "", images: [], image1_file: null, image2_file: null, image1_preview: null, image2_preview: null });
//           setEnvisionImages([null, null]);
//         }
//       } catch (err) {
//         setEditedSection({ title: "", subtitle: "", description: "", images: [], image1_file: null, image2_file: null, image1_preview: null, image2_preview: null });
//         setEnvisionImages([null, null]);
//       }
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[key] });
//     }
    
//     setHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   const updateField = (field, value) => {
//     setEditedSection({ ...editedSection, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const updateArrayField = (field, index, value) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr[index] = value;
//     updateField(field, arr);
//   };

//   const addArrayItem = (field) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr.push("");
//     updateField(field, arr);
//   };

//   const removeArrayItem = (field, index) => {
//     const arr = [...editedSection[field]];
//     arr.splice(index, 1);
//     updateField(field, arr);
//   };

//   // Handle image file selection for Envision section (like hero section)
//   const handleEnvisionImageSelect = (e, imageNumber) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
      
//       const previewUrl = URL.createObjectURL(file);
      
//       if (imageNumber === 1) {
//         setEditedSection({ ...editedSection, image1_file: file, image1_preview: previewUrl });
//         setEnvisionImages([previewUrl, envisionImages[1]]);
//       } else {
//         setEditedSection({ ...editedSection, image2_file: file, image2_preview: previewUrl });
//         setEnvisionImages([envisionImages[0], previewUrl]);
//       }
//       setHasChanges(true);
//       setError(null);
//     }
//   };

//   // Delete entire Envision section
//   const deleteEnvisionSection = async () => {
//     if (!confirm("Delete the entire Envision Your Special Day section? This action cannot be undone.")) return;
    
//     try {
//       const existing = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//       if (existing.success && existing.data && existing.data.id) {
//         const result = await apiRequest(`${ADMIN_ENDPOINTS.envision_your_special_day}/${existing.data.id}`, "DELETE", null, token);
//         if (result.success) {
//           setEditedSection({ title: "", subtitle: "", description: "", images: [], image1_file: null, image2_file: null, image1_preview: null, image2_preview: null });
//           setEnvisionImages([null, null]);
//           setHasChanges(false);
//           setSaved(true);
//           setTimeout(() => setSaved(false), 2500);
//         } else {
//           setError(result.message || "Error deleting section");
//         }
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     }
//   };

//   // Slide management functions (for hero section)
//   const addNewSlide = () => {
//     setEditingSlideIndex(-1);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({
//       title: "",
//       subtitle: "",
//       description: "",
//       image_url: "",
//       sort_order: slides.length + 1,
//     });
//     setHasChanges(true);
//   };

//   const editSlide = (index) => {
//     setEditingSlideIndex(index);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ ...slides[index] });
//     setHasChanges(false);
//   };

//   const cancelEditSlide = () => {
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ images: slides.map(s => s.image_url) });
//     setHasChanges(false);
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   const saveSlide = async () => {
//     setUploading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", editedSection.title || "");
//     formData.append("subtitle", editedSection.subtitle || "");
//     formData.append("description", editedSection.description || "");
//     formData.append("sort_order", editedSection.sort_order || slides.length + 1);
    
//     if (selectedFile) {
//       formData.append("image", selectedFile);
//     }
    
//     let result;
//     if (editingSlideIndex === -1) {
//       result = await apiRequest("/admin/wedding/slides", "POST", formData, token, true);
//     } else {
//       formData.append("_method", "PUT");
//       const slideId = slides[editingSlideIndex].id;
//       result = await apiRequest(`/admin/wedding/slides/${slideId}`, "POST", formData, token, true);
//     }
    
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error saving slide");
//       if (result.errors) {
//         const errorMessages = Object.values(result.errors).flat().join(", ");
//         setError(errorMessages);
//       }
//     }
//     setUploading(false);
//   };

//   const deleteSlide = async (index) => {
//     if (!confirm("Delete this slide?")) return;
//     const slideId = slides[index].id;
//     const result = await apiRequest(`/admin/wedding/slides/${slideId}`, "DELETE", null, token);
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
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
//       await apiRequest(`/admin/wedding/slides/${newSlides[i].id}`, "PUT", { sort_order: i + 1 }, token);
//     }

//     const freshSlides = await fetchSlides();
//     setSlides(freshSlides);
//     setEditedSection({ images: freshSlides.map(s => s.image_url) });
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   // Save Envision section to API with file uploads
//   const saveEnvisionSection = async () => {
//     setUploading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", editedSection.title || "");
//     formData.append("subtitle", editedSection.subtitle || "");
//     formData.append("description", editedSection.description || "");
    
//     // Add images if new files are selected
//     if (editedSection.image1_file) {
//       formData.append("image1", editedSection.image1_file);
//     }
//     if (editedSection.image2_file) {
//       formData.append("image2", editedSection.image2_file);
//     }
    
//     // Add existing image URLs if no new files
//     if (!editedSection.image1_file && envisionImages[0] && typeof envisionImages[0] === 'string') {
//       formData.append("existing_image1", envisionImages[0]);
//     }
//     if (!editedSection.image2_file && envisionImages[1] && typeof envisionImages[1] === 'string') {
//       formData.append("existing_image2", envisionImages[1]);
//     }
    
//     try {
//       const existing = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
      
//       let result;
//       if (existing.success && existing.data && existing.data.id) {
//         formData.append("_method", "PUT");
//         result = await apiRequest(`${ADMIN_ENDPOINTS.envision_your_special_day}/${existing.data.id}`, "POST", formData, token, true);
//       } else {
//         result = await apiRequest(ADMIN_ENDPOINTS.envision_your_special_day, "POST", formData, token, true);
//       }
      
//       if (result.success) {
//         const freshData = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//         if (freshData.success && freshData.data) {
//           setEditedSection({ ...freshData.data, image1_file: null, image2_file: null, image1_preview: null, image2_preview: null });
//           setEnvisionImages([freshData.data.images?.[0] || null, freshData.data.images?.[1] || null]);
//         }
//         setHasChanges(false);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 2500);
//       } else {
//         setError(result.message || "Error saving data");
//         if (result.errors) {
//           const errorMessages = Object.values(result.errors).flat().join(", ");
//           setError(errorMessages);
//         }
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSave = () => {
//     if (activeSection === "hero") {
//       if (editingSlideIndex !== null) {
//         saveSlide();
//       }
//     } else if (activeSection === "envision_your_special_day") {
//       saveEnvisionSection();
//     } else {
//       const updated = {
//         ...data,
//         homepage: {
//           ...data.homepage,
//           [activeSection]: editedSection,
//         },
//       };
//       saveSiteData(updated);
//       setData(updated);
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     }
//   };

//   const handleReset = () => {
//     if (activeSection === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//     } else if (activeSection === "envision_your_special_day") {
//       setEditedSection({ title: "", subtitle: "", description: "", images: [], image1_file: null, image2_file: null, image1_preview: null, image2_preview: null });
//       setEnvisionImages([null, null]);
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[activeSection] });
//     }
//     setHasChanges(true);
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
//           <p className="text-gray-500 mt-2">Please login to manage wedding content</p>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // RULES (MATCHED + CLEAN)
//   // =========================

//   const showTitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showSubtitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showImage = !["why_choose_luxury_garden_palace", "services"].includes(activeSection);
//   const isTwoImages = activeSection === "envision_your_special_day" || activeSection === "prime_luxury_apartment_living";
//   const isFourImages = activeSection === "multiple_images" || activeSection === "hero";
//   const isServices = activeSection === "services";
//   const isFeatures = activeSection === "why_choose_luxury_garden_palace" || activeSection === "Location";
//   const isAmenities = activeSection === "prime_luxury_apartment_living" || activeSection === "wedding_accommodations";

//   // Hero Section Slide Editor View
//   if (activeSection === "hero" && editingSlideIndex !== null) {
//     const isNew = editingSlideIndex === -1;
//     const previewImage = imagePreview || editedSection.image_url;
    
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold">{isNew ? "Add New Slide" : "Edit Slide"}</h2>
//             <p className="text-sm text-gray-500">Upload an image from your computer for the hero slider</p>
//           </div>
//           <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//             Cancel
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="space-y-4 bg-white p-6 rounded-xl">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={editedSection.title || ""}
//                 onChange={(e) => updateField("title", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="e.g., Exclusive Wedding Experience"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={editedSection.subtitle || ""}
//                 onChange={(e) => updateField("subtitle", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="e.g., Luxury Wedding Venue"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={editedSection.description || ""}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Image</label>
//               <div className="flex gap-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm w-full justify-center">
//                   <Upload size={16} />
//                   Select Image from Computer
//                   <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//                 </label>
//               </div>
//               {selectedFile && (
//                 <p className="text-xs text-emerald-600 mt-2">Selected: {selectedFile.name}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Display Order</label>
//               <input
//                 type="number"
//                 value={editedSection.sort_order || slides.length + 1}
//                 onChange={(e) => updateField("sort_order", parseInt(e.target.value))}
//                 className="w-full border p-2 rounded"
//                 placeholder="Order number (lower = appears first)"
//               />
//               <p className="text-xs text-gray-400 mt-1">Slides are displayed in ascending order</p>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {previewImage && <img src={previewImage} className="rounded mb-3 w-full" alt="Preview" />}
//             {editedSection.title && <h3 className="font-bold text-lg">{editedSection.title}</h3>}
//             {editedSection.subtitle && <p className="text-sm text-amber-600">{editedSection.subtitle}</p>}
//             {editedSection.description && <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg">Cancel</button>
//           <button onClick={saveSlide} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
//             {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//             {isNew ? "Create Slide" : "Update Slide"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Hero Section Slides List View
//   if (activeSection === "hero" && editingSlideIndex === null) {
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//             <p className="mt-1 text-sm text-slate-500">Edit the Hero Section content - Wedding Slides</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {saved && (
//               <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//                 <Check size={16} /> Saved successfully
//               </span>
//             )}
//             <button onClick={addNewSlide} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//               <Plus size={16} /> Add New Slide
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 mb-6">
//           {Object.entries(sectionLabels).map(([key, label]) => (
//             <button
//               key={key}
//               onClick={() => switchSection(key)}
//               className={`text-[10px] p-2 rounded-lg ${activeSection === key ? "bg-white shadow" : ""}`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-3">
//           {slides?.map((slide, index) => {
//             const imageUrl = slide.image_url && !slide.image_url.startsWith("http") 
//               ? `http://127.0.0.1:8000/storage/${slide.image_url}` 
//               : slide.image_url;
              
//             return (
//               <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center">
//                 <img src={imageUrl} alt={slide.title} className="w-24 h-24 object-cover rounded" />
//                 <div className="flex-1">
//                   <h3 className="font-semibold">{slide.title}</h3>
//                   <p className="text-sm text-gray-500">{slide.subtitle}</p>
//                   <p className="text-sm text-gray-600 line-clamp-2">{slide.description}</p>
//                   <p className="text-xs text-gray-400 mt-1">Order: {slide.sort_order || index + 1}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   {index > 0 && (
//                     <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
//                       <ArrowUp size={16} />
//                     </button>
//                   )}
//                   {index < slides.length - 1 && (
//                     <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
//                       <ArrowDown size={16} />
//                     </button>
//                   )}
//                   <button onClick={() => editSlide(index)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//                   <button onClick={() => deleteSlide(index)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//                 </div>
//               </div>
//             );
//           })}
//           {(!slides || slides.length === 0) && (
//             <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
//           )}
//         </div>

//         <WeddingVenuesManagerMicroService />
//         <WeddingServicesManagerMicroService />
//         <WeddingPackagesManagerMicroService />
//         <WeddingRoomBlocksManagerMicroService />
//         <WeddingGalleryManagerMicroService />
//       </div>
//     );
//   }

//   // =========================
//   // ENVISION YOUR SPECIAL DAY SECTION (WITH FILE UPLOAD AND DELETE SECTION)
//   // =========================
//   if (activeSection === "envision_your_special_day") {
//     const getImage1Url = () => {
//       if (editedSection.image1_preview) return editedSection.image1_preview;
//       if (envisionImages[0] && typeof envisionImages[0] === 'string') return envisionImages[0];
//       return null;
//     };
    
//     const getImage2Url = () => {
//       if (editedSection.image2_preview) return editedSection.image2_preview;
//       if (envisionImages[1] && typeof envisionImages[1] === 'string') return envisionImages[1];
//       return null;
//     };
    
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-xl font-bold">Envision Your Special Day Section</h2>
//             <p className="text-sm text-gray-500">Edit the content for this section</p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={handleReset} className="px-3 py-2 border rounded-lg flex items-center gap-2">
//               <RotateCcw size={15} /> Reset
//             </button>
//             <button
//               onClick={deleteEnvisionSection}
//               className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
//             >
//               <Trash2 size={15} /> Delete Section
//             </button>
//             <button 
//               onClick={handleSave} 
//               disabled={!hasChanges && !uploading} 
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${(hasChanges || uploading) ? "bg-amber-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
//             >
//               {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//               {uploading ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         {saved && (
//           <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
//             <Check size={16} /> Saved successfully!
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* LEFT - EDIT FORM */}
//           <div className="space-y-4 bg-white p-6 rounded-xl">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={editedSection?.title || ""}
//                 onChange={(e) => updateField("title", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Envision Your Special Day"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={editedSection?.subtitle || ""}
//                 onChange={(e) => updateField("subtitle", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Wedding Venues Luxury"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={editedSection?.description || ""}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
            
//             {/* Image 1 - Left Large Image */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image 1 (Left Large Image)</label>
//               <div className="flex gap-2 items-center">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                   <Upload size={16} />
//                   Upload Image 1
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={(e) => handleEnvisionImageSelect(e, 1)} 
//                     className="hidden" 
//                   />
//                 </label>
//               </div>
//               {getImage1Url() && (
//                 <div className="mt-2 relative">
//                   <img src={getImage1Url()} className="w-full h-40 object-cover rounded-lg" alt="Image 1 preview" />
//                   <button
//                     onClick={() => {
//                       setEditedSection({ ...editedSection, image1_file: null, image1_preview: null });
//                       setEnvisionImages([null, envisionImages[1]]);
//                       setHasChanges(true);
//                     }}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               )}
//               <p className="text-xs text-gray-400 mt-1">Click Upload to select an image from your computer</p>
//             </div>
            
//             {/* Image 2 - Bottom Right Small Image */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image 2 (Bottom Right Small Image)</label>
//               <div className="flex gap-2 items-center">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                   <Upload size={16} />
//                   Upload Image 2
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={(e) => handleEnvisionImageSelect(e, 2)} 
//                     className="hidden" 
//                   />
//                 </label>
//               </div>
//               {getImage2Url() && (
//                 <div className="mt-2 relative">
//                   <img src={getImage2Url()} className="w-full h-32 object-cover rounded-lg" alt="Image 2 preview" />
//                   <button
//                     onClick={() => {
//                       setEditedSection({ ...editedSection, image2_file: null, image2_preview: null });
//                       setEnvisionImages([envisionImages[0], null]);
//                       setHasChanges(true);
//                     }}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               )}
//               <p className="text-xs text-gray-400 mt-1">Click Upload to select an image from your computer</p>
//             </div>
//           </div>

//           {/* RIGHT - PREVIEW */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {getImage1Url() && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Left Large Image:</p>
//                 <img 
//                   src={getImage1Url()} 
//                   className="rounded-lg mb-3 w-full h-64 object-cover" 
//                   alt="Preview 1"
//                   onError={(e) => { e.target.src = "https://placehold.co/800x1000?text=No+Image"; }}
//                 />
//               </div>
//             )}
//             {getImage2Url() && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Bottom Right Small Image:</p>
//                 <img 
//                   src={getImage2Url()} 
//                   className="rounded-lg mb-3 w-full h-48 object-cover" 
//                   alt="Preview 2"
//                   onError={(e) => { e.target.src = "https://placehold.co/800x400?text=No+Image"; }}
//                 />
//               </div>
//             )}
//             <h2 className="font-bold text-xl mt-2">{editedSection?.title}</h2>
//             <p className="text-amber-600 text-sm">{editedSection?.subtitle}</p>
//             <p className="text-gray-600 text-sm mt-2">{editedSection?.description}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // ALL OTHER SECTIONS - FULL UI (PRESERVED)
//   // =========================

//   return (
//     <div className="space-y-6 p-6">
//       {/* HEADER */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//           <p className="mt-1 text-sm text-slate-500">Edit the content displayed on your wedding</p>
//           {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//         </div>

//         <div className="flex items-center gap-2">
//           {saved && (
//             <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//               <Check size={16} /> Saved successfully
//             </span>
//           )}
//           <button
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//           >
//             <RotateCcw size={15} /> Reset
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!hasChanges}
//             className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
//               hasChanges
//                 ? "bg-gradient-to-r from-amber-500 to-amber-600"
//                 : "bg-slate-300 cursor-not-allowed"
//             }`}
//           >
//             <Save size={15} /> Save Changes
//           </button>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
//         {Object.entries(sectionLabels).map(([key, label]) => (
//           <button
//             key={key}
//             onClick={() => switchSection(key)}
//             className={`text-[10px] p-2 rounded-lg ${
//               activeSection === key ? "bg-white shadow" : ""
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-5 gap-6">

//         {/* LEFT - EDIT FORM */}
//         <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">
//           {showTitle && (
//             <input
//               value={editedSection?.title || ""}
//               onChange={(e) => updateField("title", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Title"
//             />
//           )}

//           {showSubtitle && (
//             <input
//               value={editedSection?.subtitle || ""}
//               onChange={(e) => updateField("subtitle", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Subtitle"
//             />
//           )}

//           {activeSection !== "multiple_images" && activeSection !== "services" && (
//             <textarea
//               value={editedSection?.description || ""}
//               onChange={(e) => updateField("description", e.target.value)}
//               className="w-full border p-2 rounded"
//               rows={4}
//               placeholder="Description"
//             />
//           )}

//           {showImage && !isTwoImages && !isFourImages && (
//             <input
//               value={editedSection?.imageUrl || ""}
//               onChange={(e) => updateField("imageUrl", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Image URL"
//             />
//           )}

//           {isTwoImages &&
//             [0, 1].map((i) => (
//               <input
//                 key={i}
//                 value={editedSection?.images?.[i] || ""}
//                 onChange={(e) => updateArrayField("images", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Image ${i + 1}`}
//               />
//             ))}

//           {isFourImages &&
//             [0, 1, 2, 3].map((i) => (
//               <input
//                 key={i}
//                 value={editedSection?.images?.[i] || ""}
//                 onChange={(e) => updateArrayField("images", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Image ${i + 1}`}
//               />
//             ))}

//           {isServices &&
//             Array.from({ length: 12 }).map((_, i) => (
//               <input
//                 key={i}
//                 value={editedSection?.items?.[i] || ""}
//                 onChange={(e) => updateArrayField("items", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Service ${i + 1}`}
//               />
//             ))}

//           {/* Features for why_choose and Location */}
//           {isFeatures && (
//             <div>
//               <label className="block text-sm font-medium mb-2">Features</label>
//               {editedSection?.features?.map((feature, idx) => (
//                 <div key={idx} className="flex gap-2 mb-2">
//                   <input
//                     value={feature}
//                     onChange={(e) => updateArrayField("features", idx, e.target.value)}
//                     className="flex-1 border p-2 rounded"
//                     placeholder={`Feature ${idx + 1}`}
//                   />
//                   <button
//                     onClick={() => removeArrayItem("features", idx)}
//                     className="px-3 bg-red-500 text-white rounded"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={() => addArrayItem("features")}
//               className="text-sm text-amber-600 flex items-center gap-1"
//               >
//                 + Add Feature
//               </button>
//             </div>
//           )}

//           {/* Amenities for prime_luxury and accommodations */}
//           {isAmenities && (
//             <div>
//               <label className="block text-sm font-medium mb-2">Amenities</label>
//               {editedSection?.amenities?.map((amenity, idx) => (
//                 <div key={idx} className="flex gap-2 mb-2">
//                   <input
//                     value={amenity}
//                     onChange={(e) => updateArrayField("amenities", idx, e.target.value)}
//                     className="flex-1 border p-2 rounded"
//                     placeholder={`Amenity ${idx + 1}`}
//                   />
//                   <button
//                     onClick={() => removeArrayItem("amenities", idx)}
//                     className="px-3 bg-red-500 text-white rounded"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={() => addArrayItem("amenities")}
//                 className="text-sm text-amber-600 flex items-center gap-1"
//               >
//                 + Add Amenity
//               </button>
//             </div>
//           )}
//         </div>

//         {/* RIGHT - PREVIEW */}
//         <div className="lg:col-span-2 bg-white p-4 rounded-xl">
//           {editedSection?.imageUrl && (
//             <img src={editedSection.imageUrl} className="rounded mb-3 w-full" alt="Preview" />
//           )}
//           {editedSection?.images?.map((img, i) => (
//             img && <img key={i} src={img} className="rounded mb-2 w-full" alt={`Preview ${i + 1}`} />
//           ))}
//           <h3 className="font-bold text-lg">{editedSection?.title}</h3>
//           {showSubtitle && editedSection?.subtitle && (
//             <p className="text-sm text-amber-600">{editedSection.subtitle}</p>
//           )}
//           {editedSection?.description && (
//             <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>
//           )}
//           {editedSection?.features && editedSection.features.length > 0 && (
//             <ul className="text-sm mt-2 space-y-1">
//               {editedSection.features.map((feature, i) => (
//                 feature && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {feature}</li>
//               ))}
//             </ul>
//           )}
//           {editedSection?.amenities && editedSection.amenities.length > 0 && (
//             <ul className="text-sm mt-2 space-y-1">
//               {editedSection.amenities.map((amenity, i) => (
//                 amenity && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {amenity}</li>
//               ))}
//             </ul>
//           )}
//           {editedSection?.items && editedSection.items.length > 0 && (
//             <ul className="text-sm mt-2 list-disc pl-4">
//               {editedSection.items.map((item, i) => (
//                 item && <li key={i}>{item}</li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* MICRO SERVICES */}
//       <WeddingVenuesManagerMicroService />
//       <WeddingServicesManagerMicroService />
//       <WeddingPackagesManagerMicroService />
//       <WeddingRoomBlocksManagerMicroService />
//       <WeddingGalleryManagerMicroService />
//     </div>
//   );
// }






















// import { useEffect, useState } from "react";
// import { loadSiteData, saveSiteData } from "../data/store";
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
//   ArrowLeft,
// } from "lucide-react";

// import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
// import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
// import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
// import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
// import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

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

// const sectionLabels = {
//   hero: "Hero Section",
//   envision_your_special_day: "Envision Your Special Day Section",
//   services: "Services Section",
//   why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
//   prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
//   wedding_accommodations: "Wedding Accommodations Section",
//   Location: "Location Section",
//   multiple_images: "Multiple Images Section",
// };

// // API Endpoints for Envision section
// const API_ENDPOINTS = {
//   envision_your_special_day: "/wedding/section1/venue",
// };

// const ADMIN_ENDPOINTS = {
//   envision_your_special_day: "/admin/wedding/section1/venue",
// };

// export default function WeddingManager() {
//   const [data, setData] = useState(null);
//   const [activeSection, setActiveSection] = useState("hero");
//   const [editedSection, setEditedSection] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [editingSlideIndex, setEditingSlideIndex] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [slides, setSlides] = useState([]);
  
//   // Envision section specific state
//   const [envisionTitle, setEnvisionTitle] = useState("");
//   const [envisionSubtitle, setEnvisionSubtitle] = useState("");
//   const [envisionDescription, setEnvisionDescription] = useState("");
//   const [envisionImage1, setEnvisionImage1] = useState("");
//   const [envisionImage2, setEnvisionImage2] = useState("");
//   const [envisionImage1File, setEnvisionImage1File] = useState(null);
//   const [envisionImage2File, setEnvisionImage2File] = useState(null);
//   const [envisionImage1Preview, setEnvisionImage1Preview] = useState("");
//   const [envisionImage2Preview, setEnvisionImage2Preview] = useState("");
//   const [envisionHasChanges, setEnvisionHasChanges] = useState(false);
//   const [envisionSaving, setEnvisionSaving] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   // Fetch slides from backend
//   const fetchSlides = async () => {
//     try {
//       const result = await apiRequest("/wedding/slides", "GET");
//       if (result.success) {
//         const sorted = result.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
//         return sorted;
//       }
//       return [];
//     } catch (err) {
//       console.error("Fetch error:", err);
//       return [];
//     }
//   };

//   // Fetch Envision section data from API
//   const fetchEnvisionData = async () => {
//     try {
//       const result = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//       if (result.success && result.data) {
//         return result.data;
//       }
//     } catch (err) {
//       console.error("Error fetching envision data:", err);
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (token) {
//       const loadData = async () => {
//         setLoading(true);
        
//         const fetchedSlides = await fetchSlides();
//         setSlides(fetchedSlides);
        
//         const envisionData = await fetchEnvisionData();
        
//         const siteData = loadSiteData();
//         setData(siteData);
        
//         if (activeSection === "hero") {
//           setEditedSection({ images: fetchedSlides.map(s => s.image_url) });
//         } else if (activeSection === "envision_your_special_day") {
//           if (envisionData) {
//             setEnvisionTitle(envisionData.title || "");
//             setEnvisionSubtitle(envisionData.subtitle || "");
//             setEnvisionDescription(envisionData.description || "");
            
//             // Process image URLs
//             const img1 = envisionData.images?.[0] || "";
//             const img2 = envisionData.images?.[1] || "";
            
//             // Convert storage paths to full URLs for display
//             const displayImg1 = img1 && !img1.startsWith("http") 
//               ? `http://127.0.0.1:8000/storage/${img1.replace(/^\/storage\//, '')}` 
//               : img1;
//             const displayImg2 = img2 && !img2.startsWith("http") 
//               ? `http://127.0.0.1:8000/storage/${img2.replace(/^\/storage\//, '')}` 
//               : img2;
            
//             setEnvisionImage1(img1);
//             setEnvisionImage2(img2);
//             setEnvisionImage1Preview(displayImg1);
//             setEnvisionImage2Preview(displayImg2);
//           } else {
//             resetEnvisionForm();
//           }
//         } else {
//           setEditedSection({ ...siteData.homepage[activeSection] });
//         }
        
//         setLoading(false);
//       };
//       loadData();
//     }
//   }, [token]);

//   const resetEnvisionForm = () => {
//     setEnvisionTitle("");
//     setEnvisionSubtitle("");
//     setEnvisionDescription("");
//     setEnvisionImage1("");
//     setEnvisionImage2("");
//     setEnvisionImage1File(null);
//     setEnvisionImage2File(null);
//     setEnvisionImage1Preview("");
//     setEnvisionImage2Preview("");
//     setEnvisionHasChanges(false);
//   };

//   const switchSection = async (key) => {
//     if ((hasChanges || envisionHasChanges) && !confirm("You have unsaved changes. Discard them?")) return;
    
//     setActiveSection(key);
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
    
//     if (key === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//     } else if (key === "envision_your_special_day") {
//       const envisionData = await fetchEnvisionData();
//       if (envisionData) {
//         setEnvisionTitle(envisionData.title || "");
//         setEnvisionSubtitle(envisionData.subtitle || "");
//         setEnvisionDescription(envisionData.description || "");
        
//         const img1 = envisionData.images?.[0] || "";
//         const img2 = envisionData.images?.[1] || "";
        
//         const displayImg1 = img1 && !img1.startsWith("http") 
//           ? `http://127.0.0.1:8000/storage/${img1.replace(/^\/storage\//, '')}` 
//           : img1;
//         const displayImg2 = img2 && !img2.startsWith("http") 
//           ? `http://127.0.0.1:8000/storage/${img2.replace(/^\/storage\//, '')}` 
//           : img2;
        
//         setEnvisionImage1(img1);
//         setEnvisionImage2(img2);
//         setEnvisionImage1Preview(displayImg1);
//         setEnvisionImage2Preview(displayImg2);
//       } else {
//         resetEnvisionForm();
//       }
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[key] });
//     }
    
//     setHasChanges(false);
//     setEnvisionHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   const updateField = (field, value) => {
//     setEditedSection({ ...editedSection, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const updateArrayField = (field, index, value) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr[index] = value;
//     updateField(field, arr);
//   };

//   const addArrayItem = (field) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr.push("");
//     updateField(field, arr);
//   };

//   const removeArrayItem = (field, index) => {
//     const arr = [...editedSection[field]];
//     arr.splice(index, 1);
//     updateField(field, arr);
//   };

//   // Envision section handlers
//   const handleEnvisionTitleChange = (value) => {
//     setEnvisionTitle(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionSubtitleChange = (value) => {
//     setEnvisionSubtitle(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionDescriptionChange = (value) => {
//     setEnvisionDescription(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionImage1UrlChange = (value) => {
//     setEnvisionImage1(value);
//     setEnvisionImage1Preview(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionImage2UrlChange = (value) => {
//     setEnvisionImage2(value);
//     setEnvisionImage2Preview(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionImage1FileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setEnvisionImage1File(file);
//       setEnvisionImage1Preview(URL.createObjectURL(file));
//       setEnvisionHasChanges(true);
//       setSaved(false);
//       setError(null);
//     }
//   };

//   const handleEnvisionImage2FileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setEnvisionImage2File(file);
//       setEnvisionImage2Preview(URL.createObjectURL(file));
//       setEnvisionHasChanges(true);
//       setSaved(false);
//       setError(null);
//     }
//   };

//   const deleteEnvisionImage1 = () => {
//     setEnvisionImage1("");
//     setEnvisionImage1File(null);
//     setEnvisionImage1Preview("");
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const deleteEnvisionImage2 = () => {
//     setEnvisionImage2("");
//     setEnvisionImage2File(null);
//     setEnvisionImage2Preview("");
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const deleteEnvisionSection = async () => {
//     if (!confirm("Delete the entire Envision Your Special Day section? This action cannot be undone.")) return;
    
//     try {
//       const existing = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//       if (existing.success && existing.data && existing.data.id) {
//         const result = await apiRequest(`${ADMIN_ENDPOINTS.envision_your_special_day}/${existing.data.id}`, "DELETE", null, token);
//         if (result.success) {
//           resetEnvisionForm();
//           setEnvisionHasChanges(false);
//           setSaved(true);
//           setTimeout(() => setSaved(false), 2500);
//         } else {
//           setError(result.message || "Error deleting section");
//         }
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     }
//   };

//   const backToHero = () => {
//     if (envisionHasChanges && !confirm("You have unsaved changes. Discard them and go back?")) return;
//     setActiveSection("hero");
//     setEditedSection({ images: slides.map(s => s.image_url) });
//     setEditingSlideIndex(null);
//     setEnvisionHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   const saveEnvisionSection = async () => {
//     setEnvisionSaving(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", envisionTitle);
//     formData.append("subtitle", envisionSubtitle);
//     formData.append("description", envisionDescription);
    
//     // Handle images - priority: file upload > URL
//     if (envisionImage1File) {
//       formData.append("image0", envisionImage1File);
//     } else if (envisionImage1) {
//       formData.append("existing_image0", envisionImage1);
//     }
    
//     if (envisionImage2File) {
//       formData.append("image1", envisionImage2File);
//     } else if (envisionImage2) {
//       formData.append("existing_image1", envisionImage2);
//     }
    
//     try {
//       const existing = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
      
//       let result;
//       if (existing.success && existing.data && existing.data.id) {
//         formData.append("_method", "PUT");
//         result = await apiRequest(`${ADMIN_ENDPOINTS.envision_your_special_day}/${existing.data.id}`, "POST", formData, token, true);
//       } else {
//         result = await apiRequest(ADMIN_ENDPOINTS.envision_your_special_day, "POST", formData, token, true);
//       }
      
//       if (result.success) {
//         // Refresh data
//         const freshData = await fetchEnvisionData();
//         if (freshData) {
//           setEnvisionTitle(freshData.title || "");
//           setEnvisionSubtitle(freshData.subtitle || "");
//           setEnvisionDescription(freshData.description || "");
          
//           const img1 = freshData.images?.[0] || "";
//           const img2 = freshData.images?.[1] || "";
          
//           const displayImg1 = img1 && !img1.startsWith("http") 
//             ? `http://127.0.0.1:8000/storage/${img1.replace(/^\/storage\//, '')}` 
//             : img1;
//           const displayImg2 = img2 && !img2.startsWith("http") 
//             ? `http://127.0.0.1:8000/storage/${img2.replace(/^\/storage\//, '')}` 
//             : img2;
          
//           setEnvisionImage1(img1);
//           setEnvisionImage2(img2);
//           setEnvisionImage1Preview(displayImg1);
//           setEnvisionImage2Preview(displayImg2);
//         }
        
//         setEnvisionImage1File(null);
//         setEnvisionImage2File(null);
//         setEnvisionHasChanges(false);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 2500);
//       } else {
//         setError(result.message || "Error saving data");
//         if (result.errors) {
//           const errorMessages = Object.values(result.errors).flat().join(", ");
//           setError(errorMessages);
//         }
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setEnvisionSaving(false);
//     }
//   };

//   // Slide management functions (for hero section)
//   const addNewSlide = () => {
//     setEditingSlideIndex(-1);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({
//       title: "",
//       subtitle: "",
//       description: "",
//       image_url: "",
//       sort_order: slides.length + 1,
//     });
//     setHasChanges(true);
//   };

//   const editSlide = (index) => {
//     setEditingSlideIndex(index);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ ...slides[index] });
//     setHasChanges(false);
//   };

//   const cancelEditSlide = () => {
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ images: slides.map(s => s.image_url) });
//     setHasChanges(false);
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   const saveSlide = async () => {
//     setUploading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", editedSection.title || "");
//     formData.append("subtitle", editedSection.subtitle || "");
//     formData.append("description", editedSection.description || "");
//     formData.append("sort_order", editedSection.sort_order || slides.length + 1);
    
//     if (selectedFile) {
//       formData.append("image", selectedFile);
//     }
    
//     let result;
//     if (editingSlideIndex === -1) {
//       result = await apiRequest("/admin/wedding/slides", "POST", formData, token, true);
//     } else {
//       formData.append("_method", "PUT");
//       const slideId = slides[editingSlideIndex].id;
//       result = await apiRequest(`/admin/wedding/slides/${slideId}`, "POST", formData, token, true);
//     }
    
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error saving slide");
//       if (result.errors) {
//         const errorMessages = Object.values(result.errors).flat().join(", ");
//         setError(errorMessages);
//       }
//     }
//     setUploading(false);
//   };

//   const deleteSlide = async (index) => {
//     if (!confirm("Delete this slide?")) return;
//     const slideId = slides[index].id;
//     const result = await apiRequest(`/admin/wedding/slides/${slideId}`, "DELETE", null, token);
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
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
//       await apiRequest(`/admin/wedding/slides/${newSlides[i].id}`, "PUT", { sort_order: i + 1 }, token);
//     }

//     const freshSlides = await fetchSlides();
//     setSlides(freshSlides);
//     setEditedSection({ images: freshSlides.map(s => s.image_url) });
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const handleSave = () => {
//     if (activeSection === "hero") {
//       if (editingSlideIndex !== null) {
//         saveSlide();
//       }
//     } else if (activeSection === "envision_your_special_day") {
//       saveEnvisionSection();
//     } else {
//       const updated = {
//         ...data,
//         homepage: {
//           ...data.homepage,
//           [activeSection]: editedSection,
//         },
//       };
//       saveSiteData(updated);
//       setData(updated);
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     }
//   };

//   const handleReset = () => {
//     if (activeSection === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//     } else if (activeSection === "envision_your_special_day") {
//       resetEnvisionForm();
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[activeSection] });
//     }
//     setHasChanges(true);
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
//           <p className="text-gray-500 mt-2">Please login to manage wedding content</p>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // RULES (MATCHED + CLEAN)
//   // =========================

//   const showTitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showSubtitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showImage = !["why_choose_luxury_garden_palace", "services"].includes(activeSection);
//   const isTwoImages = activeSection === "envision_your_special_day" || activeSection === "prime_luxury_apartment_living";
//   const isFourImages = activeSection === "multiple_images" || activeSection === "hero";
//   const isServices = activeSection === "services";
//   const isFeatures = activeSection === "why_choose_luxury_garden_palace" || activeSection === "Location";
//   const isAmenities = activeSection === "prime_luxury_apartment_living" || activeSection === "wedding_accommodations";

//   // Hero Section Slide Editor View
//   if (activeSection === "hero" && editingSlideIndex !== null) {
//     const isNew = editingSlideIndex === -1;
//     const previewImage = imagePreview || editedSection.image_url;
    
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold">{isNew ? "Add New Slide" : "Edit Slide"}</h2>
//             <p className="text-sm text-gray-500">Upload an image from your computer for the hero slider</p>
//           </div>
//           <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//             Cancel
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="space-y-4 bg-white p-6 rounded-xl">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={editedSection.title || ""}
//                 onChange={(e) => updateField("title", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="e.g., Exclusive Wedding Experience"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={editedSection.subtitle || ""}
//                 onChange={(e) => updateField("subtitle", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="e.g., Luxury Wedding Venue"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={editedSection.description || ""}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Image</label>
//               <div className="flex gap-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm w-full justify-center">
//                   <Upload size={16} />
//                   Select Image from Computer
//                   <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//                 </label>
//               </div>
//               {selectedFile && (
//                 <p className="text-xs text-emerald-600 mt-2">Selected: {selectedFile.name}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Display Order</label>
//               <input
//                 type="number"
//                 value={editedSection.sort_order || slides.length + 1}
//                 onChange={(e) => updateField("sort_order", parseInt(e.target.value))}
//                 className="w-full border p-2 rounded"
//                 placeholder="Order number (lower = appears first)"
//               />
//               <p className="text-xs text-gray-400 mt-1">Slides are displayed in ascending order</p>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {previewImage && <img src={previewImage} className="rounded mb-3 w-full" alt="Preview" />}
//             {editedSection.title && <h3 className="font-bold text-lg">{editedSection.title}</h3>}
//             {editedSection.subtitle && <p className="text-sm text-amber-600">{editedSection.subtitle}</p>}
//             {editedSection.description && <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg">Cancel</button>
//           <button onClick={saveSlide} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
//             {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//             {isNew ? "Create Slide" : "Update Slide"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Hero Section Slides List View
//   if (activeSection === "hero" && editingSlideIndex === null) {
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//             <p className="mt-1 text-sm text-slate-500">Edit the Hero Section content - Wedding Slides</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {saved && (
//               <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//                 <Check size={16} /> Saved successfully
//               </span>
//             )}
//             <button onClick={addNewSlide} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//               <Plus size={16} /> Add New Slide
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 mb-6">
//           {Object.entries(sectionLabels).map(([key, label]) => (
//             <button
//               key={key}
//               onClick={() => switchSection(key)}
//               className={`text-[10px] p-2 rounded-lg ${activeSection === key ? "bg-white shadow" : ""}`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-3">
//           {slides?.map((slide, index) => {
//             const imageUrl = slide.image_url && !slide.image_url.startsWith("http") 
//               ? `http://127.0.0.1:8000/storage/${slide.image_url}` 
//               : slide.image_url;
              
//             return (
//               <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center">
//                 <img src={imageUrl} alt={slide.title} className="w-24 h-24 object-cover rounded" />
//                 <div className="flex-1">
//                   <h3 className="font-semibold">{slide.title}</h3>
//                   <p className="text-sm text-gray-500">{slide.subtitle}</p>
//                   <p className="text-sm text-gray-600 line-clamp-2">{slide.description}</p>
//                   <p className="text-xs text-gray-400 mt-1">Order: {slide.sort_order || index + 1}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   {index > 0 && (
//                     <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
//                       <ArrowUp size={16} />
//                     </button>
//                   )}
//                   {index < slides.length - 1 && (
//                     <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
//                       <ArrowDown size={16} />
//                     </button>
//                   )}
//                   <button onClick={() => editSlide(index)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//                   <button onClick={() => deleteSlide(index)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//                 </div>
//               </div>
//             );
//           })}
//           {(!slides || slides.length === 0) && (
//             <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
//           )}
//         </div>

//         <WeddingVenuesManagerMicroService />
//         <WeddingServicesManagerMicroService />
//         <WeddingPackagesManagerMicroService />
//         <WeddingRoomBlocksManagerMicroService />
//         <WeddingGalleryManagerMicroService />
//       </div>
//     );
//   }

//   // =========================
//   // ENVISION YOUR SPECIAL DAY SECTION (COMPLETE WITH BOTH UPLOAD AND URL)
//   // =========================
//   if (activeSection === "envision_your_special_day") {
//     return (
//       <div className="space-y-6 p-6">
//         {/* Back Button */}
//         <button
//           onClick={backToHero}
//           className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors mb-4"
//         >
//           <ArrowLeft size={20} />
//           Back to Hero Section
//         </button>

//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-xl font-bold">Envision Your Special Day Section</h2>
//             <p className="text-sm text-gray-500">Edit the content for this section (Upload or enter URL)</p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={handleReset} className="px-3 py-2 border rounded-lg flex items-center gap-2">
//               <RotateCcw size={15} /> Reset
//             </button>
//             <button
//               onClick={deleteEnvisionSection}
//               className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
//             >
//               <Trash2 size={15} /> Delete Section
//             </button>
//             <button 
//               onClick={handleSave} 
//               disabled={!envisionHasChanges && !envisionSaving} 
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${(envisionHasChanges || envisionSaving) ? "bg-amber-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
//             >
//               {envisionSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//               {envisionSaving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         {saved && (
//           <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
//             <Check size={16} /> Saved successfully!
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* LEFT - EDIT FORM */}
//           <div className="space-y-4 bg-white p-6 rounded-xl">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={envisionTitle}
//                 onChange={(e) => handleEnvisionTitleChange(e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Envision Your Special Day"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={envisionSubtitle}
//                 onChange={(e) => handleEnvisionSubtitleChange(e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Wedding Venues Luxury"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={envisionDescription}
//                 onChange={(e) => handleEnvisionDescriptionChange(e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
            
//             {/* Image 1 - Left Large Image */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image 1 (Left Large Image)</label>
//               <div className="flex gap-2 items-center mb-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                   <Upload size={16} />
//                   Upload
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleEnvisionImage1FileSelect} 
//                     className="hidden" 
//                   />
//                 </label>
//                 <input
//                   value={envisionImage1}
//                   onChange={(e) => handleEnvisionImage1UrlChange(e.target.value)}
//                   className="flex-1 border rounded-lg p-2.5"
//                   placeholder="Or enter image URL"
//                 />
//               </div>
//               {envisionImage1Preview && (
//                 <div className="mt-2 relative">
//                   <img src={envisionImage1Preview} className="w-full h-40 object-cover rounded-lg" alt="Image 1" />
//                   <button
//                     onClick={deleteEnvisionImage1}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               )}
//               <p className="text-xs text-gray-400">Upload from computer OR enter image URL</p>
//             </div>
            
//             {/* Image 2 - Bottom Right Small Image */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image 2 (Bottom Right Small Image)</label>
//               <div className="flex gap-2 items-center mb-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                   <Upload size={16} />
//                   Upload
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleEnvisionImage2FileSelect} 
//                     className="hidden" 
//                   />
//                 </label>
//                 <input
//                   value={envisionImage2}
//                   onChange={(e) => handleEnvisionImage2UrlChange(e.target.value)}
//                   className="flex-1 border rounded-lg p-2.5"
//                   placeholder="Or enter image URL"
//                 />
//               </div>
//               {envisionImage2Preview && (
//                 <div className="mt-2 relative">
//                   <img src={envisionImage2Preview} className="w-full h-32 object-cover rounded-lg" alt="Image 2" />
//                   <button
//                     onClick={deleteEnvisionImage2}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               )}
//               <p className="text-xs text-gray-400">Upload from computer OR enter image URL</p>
//             </div>
//           </div>

//           {/* RIGHT - PREVIEW */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {envisionImage1Preview && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Left Large Image:</p>
//                 <img 
//                   src={envisionImage1Preview} 
//                   className="rounded-lg mb-3 w-full h-64 object-cover" 
//                   alt="Preview 1"
//                   onError={(e) => { e.target.src = "https://placehold.co/800x1000?text=Invalid+Image"; }}
//                 />
//               </div>
//             )}
//             {envisionImage2Preview && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Bottom Right Small Image:</p>
//                 <img 
//                   src={envisionImage2Preview} 
//                   className="rounded-lg mb-3 w-full h-48 object-cover" 
//                   alt="Preview 2"
//                   onError={(e) => { e.target.src = "https://placehold.co/800x400?text=Invalid+Image"; }}
//                 />
//               </div>
//             )}
//             <h2 className="font-bold text-xl mt-2">{envisionTitle || "No Title"}</h2>
//             <p className="text-amber-600 text-sm">{envisionSubtitle || "No Subtitle"}</p>
//             <p className="text-gray-600 text-sm mt-2">{envisionDescription || "No Description"}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // ALL OTHER SECTIONS - FULL UI (PRESERVED)
//   // =========================

//   return (
//     <div className="space-y-6 p-6">
//       {/* HEADER */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//           <p className="mt-1 text-sm text-slate-500">Edit the content displayed on your wedding</p>
//           {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//         </div>

//         <div className="flex items-center gap-2">
//           {saved && (
//             <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//               <Check size={16} /> Saved successfully
//             </span>
//           )}
//           <button
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//           >
//             <RotateCcw size={15} /> Reset
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!hasChanges}
//             className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
//               hasChanges
//                 ? "bg-gradient-to-r from-amber-500 to-amber-600"
//                 : "bg-slate-300 cursor-not-allowed"
//             }`}
//           >
//             <Save size={15} /> Save Changes
//           </button>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
//         {Object.entries(sectionLabels).map(([key, label]) => (
//           <button
//             key={key}
//             onClick={() => switchSection(key)}
//             className={`text-[10px] p-2 rounded-lg ${
//               activeSection === key ? "bg-white shadow" : ""
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-5 gap-6">

//         {/* LEFT - EDIT FORM */}
//         <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">
//           {showTitle && (
//             <input
//               value={editedSection?.title || ""}
//               onChange={(e) => updateField("title", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Title"
//             />
//           )}

//           {showSubtitle && (
//             <input
//               value={editedSection?.subtitle || ""}
//               onChange={(e) => updateField("subtitle", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Subtitle"
//             />
//           )}

//           {activeSection !== "multiple_images" && activeSection !== "services" && (
//             <textarea
//               value={editedSection?.description || ""}
//               onChange={(e) => updateField("description", e.target.value)}
//               className="w-full border p-2 rounded"
//               rows={4}
//               placeholder="Description"
//             />
//           )}

//           {showImage && !isTwoImages && !isFourImages && (
//             <input
//               value={editedSection?.imageUrl || ""}
//               onChange={(e) => updateField("imageUrl", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Image URL"
//             />
//           )}

//           {isTwoImages &&
//             [0, 1].map((i) => (
//               <input
//                 key={i}
//                 value={editedSection?.images?.[i] || ""}
//                 onChange={(e) => updateArrayField("images", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Image ${i + 1}`}
//               />
//             ))}

//           {isFourImages &&
//             [0, 1, 2, 3].map((i) => (
//               <input
//                 key={i}
//                 value={editedSection?.images?.[i] || ""}
//                 onChange={(e) => updateArrayField("images", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Image ${i + 1}`}
//               />
//             ))}

//           {isServices &&
//             Array.from({ length: 12 }).map((_, i) => (
//               <input
//                 key={i}
//                 value={editedSection?.items?.[i] || ""}
//                 onChange={(e) => updateArrayField("items", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Service ${i + 1}`}
//               />
//             ))}

//           {/* Features for why_choose and Location */}
//           {isFeatures && (
//             <div>
//               <label className="block text-sm font-medium mb-2">Features</label>
//               {editedSection?.features?.map((feature, idx) => (
//                 <div key={idx} className="flex gap-2 mb-2">
//                   <input
//                     value={feature}
//                     onChange={(e) => updateArrayField("features", idx, e.target.value)}
//                     className="flex-1 border p-2 rounded"
//                     placeholder={`Feature ${idx + 1}`}
//                   />
//                   <button
//                     onClick={() => removeArrayItem("features", idx)}
//                     className="px-3 bg-red-500 text-white rounded"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={() => addArrayItem("features")}
//               className="text-sm text-amber-600 flex items-center gap-1"
//               >
//                 + Add Feature
//               </button>
//             </div>
//           )}

//           {/* Amenities for prime_luxury and accommodations */}
//           {isAmenities && (
//             <div>
//               <label className="block text-sm font-medium mb-2">Amenities</label>
//               {editedSection?.amenities?.map((amenity, idx) => (
//                 <div key={idx} className="flex gap-2 mb-2">
//                   <input
//                     value={amenity}
//                     onChange={(e) => updateArrayField("amenities", idx, e.target.value)}
//                     className="flex-1 border p-2 rounded"
//                     placeholder={`Amenity ${idx + 1}`}
//                   />
//                   <button
//                     onClick={() => removeArrayItem("amenities", idx)}
//                     className="px-3 bg-red-500 text-white rounded"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={() => addArrayItem("amenities")}
//                 className="text-sm text-amber-600 flex items-center gap-1"
//               >
//                 + Add Amenity
//               </button>
//             </div>
//           )}
//         </div>

//         {/* RIGHT - PREVIEW */}
//         <div className="lg:col-span-2 bg-white p-4 rounded-xl">
//           {editedSection?.imageUrl && (
//             <img src={editedSection.imageUrl} className="rounded mb-3 w-full" alt="Preview" />
//           )}
//           {editedSection?.images?.map((img, i) => (
//             img && <img key={i} src={img} className="rounded mb-2 w-full" alt={`Preview ${i + 1}`} />
//           ))}
//           <h3 className="font-bold text-lg">{editedSection?.title}</h3>
//           {showSubtitle && editedSection?.subtitle && (
//             <p className="text-sm text-amber-600">{editedSection.subtitle}</p>
//           )}
//           {editedSection?.description && (
//             <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>
//           )}
//           {editedSection?.features && editedSection.features.length > 0 && (
//             <ul className="text-sm mt-2 space-y-1">
//               {editedSection.features.map((feature, i) => (
//                 feature && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {feature}</li>
//               ))}
//             </ul>
//           )}
//           {editedSection?.amenities && editedSection.amenities.length > 0 && (
//             <ul className="text-sm mt-2 space-y-1">
//               {editedSection.amenities.map((amenity, i) => (
//                 amenity && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {amenity}</li>
//               ))}
//             </ul>
//           )}
//           {editedSection?.items && editedSection.items.length > 0 && (
//             <ul className="text-sm mt-2 list-disc pl-4">
//               {editedSection.items.map((item, i) => (
//                 item && <li key={i}>{item}</li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* MICRO SERVICES */}
//       <WeddingVenuesManagerMicroService />
//       <WeddingServicesManagerMicroService />
//       <WeddingPackagesManagerMicroService />
//       <WeddingRoomBlocksManagerMicroService />
//       <WeddingGalleryManagerMicroService />
//     </div>
//   );
// }




















// import { useEffect, useState } from "react";
// import { loadSiteData, saveSiteData } from "../data/store";
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
//   ArrowLeft,
// } from "lucide-react";

// import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
// import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
// import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
// import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
// import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

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

// const sectionLabels = {
//   hero: "Hero Section",
//   envision_your_special_day: "Envision Your Special Day Section",
//   services: "Services Section",
//   why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
//   prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
//   wedding_accommodations: "Wedding Accommodations Section",
//   Location: "Location Section",
//   multiple_images: "Multiple Images Section",
// };

// // API Endpoints for Envision section
// const API_ENDPOINTS = {
//   envision_your_special_day: "/wedding/section1/venue",
// };

// const ADMIN_ENDPOINTS = {
//   envision_your_special_day: "/admin/wedding/section1/venue",
// };

// export default function WeddingManager() {
//   const [data, setData] = useState(null);
//   const [activeSection, setActiveSection] = useState("hero");
//   const [editedSection, setEditedSection] = useState(null);
//   const [saved, setSaved] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [editingSlideIndex, setEditingSlideIndex] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [slides, setSlides] = useState([]);
  
//   // Envision section specific state
//   const [envisionTitle, setEnvisionTitle] = useState("");
//   const [envisionSubtitle, setEnvisionSubtitle] = useState("");
//   const [envisionDescription, setEnvisionDescription] = useState("");
//   const [envisionImage1, setEnvisionImage1] = useState("");
//   const [envisionImage2, setEnvisionImage2] = useState("");
//   const [envisionImage1File, setEnvisionImage1File] = useState(null);
//   const [envisionImage2File, setEnvisionImage2File] = useState(null);
//   const [envisionImage1Preview, setEnvisionImage1Preview] = useState("");
//   const [envisionImage2Preview, setEnvisionImage2Preview] = useState("");
//   const [envisionHasChanges, setEnvisionHasChanges] = useState(false);
//   const [envisionSaving, setEnvisionSaving] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     } else {
//       setError("Please login first");
//       setLoading(false);
//     }
//   }, []);

//   // Fetch slides from backend
//   const fetchSlides = async () => {
//     try {
//       const result = await apiRequest("/wedding/slides", "GET");
//       if (result.success) {
//         const sorted = result.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
//         return sorted;
//       }
//       return [];
//     } catch (err) {
//       console.error("Fetch error:", err);
//       return [];
//     }
//   };

//   // Fetch Envision section data from API
//   const fetchEnvisionData = async () => {
//     try {
//       const result = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//       if (result.success && result.data) {
//         return result.data;
//       }
//     } catch (err) {
//       console.error("Error fetching envision data:", err);
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (token) {
//       const loadData = async () => {
//         setLoading(true);
        
//         const fetchedSlides = await fetchSlides();
//         setSlides(fetchedSlides);
        
//         const envisionData = await fetchEnvisionData();
        
//         const siteData = loadSiteData();
//         setData(siteData);
        
//         if (activeSection === "hero") {
//           setEditedSection({ images: fetchedSlides.map(s => s.image_url) });
//         } else if (activeSection === "envision_your_special_day") {
//           if (envisionData) {
//             setEnvisionTitle(envisionData.title || "");
//             setEnvisionSubtitle(envisionData.subtitle || "");
//             setEnvisionDescription(envisionData.description || "");
            
//             // Process image URLs for display
//             const img1 = envisionData.images?.[0] || "";
//             const img2 = envisionData.images?.[1] || "";
            
//             // Convert storage paths to full URLs for display
//             const displayImg1 = img1 && !img1.startsWith("http") 
//               ? `http://127.0.0.1:8000/storage/${img1.replace(/^\/storage\//, '')}` 
//               : img1;
//             const displayImg2 = img2 && !img2.startsWith("http") 
//               ? `http://127.0.0.1:8000/storage/${img2.replace(/^\/storage\//, '')}` 
//               : img2;
            
//             setEnvisionImage1(img1);
//             setEnvisionImage2(img2);
//             setEnvisionImage1Preview(displayImg1);
//             setEnvisionImage2Preview(displayImg2);
//           } else {
//             resetEnvisionForm();
//           }
//         } else {
//           setEditedSection({ ...siteData.homepage[activeSection] });
//         }
        
//         setLoading(false);
//       };
//       loadData();
//     }
//   }, [token]);

//   const resetEnvisionForm = () => {
//     setEnvisionTitle("");
//     setEnvisionSubtitle("");
//     setEnvisionDescription("");
//     setEnvisionImage1("");
//     setEnvisionImage2("");
//     setEnvisionImage1File(null);
//     setEnvisionImage2File(null);
//     setEnvisionImage1Preview("");
//     setEnvisionImage2Preview("");
//     setEnvisionHasChanges(false);
//   };

//   const switchSection = async (key) => {
//     if ((hasChanges || envisionHasChanges) && !confirm("You have unsaved changes. Discard them?")) return;
    
//     setActiveSection(key);
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
    
//     if (key === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//     } else if (key === "envision_your_special_day") {
//       const envisionData = await fetchEnvisionData();
//       if (envisionData) {
//         setEnvisionTitle(envisionData.title || "");
//         setEnvisionSubtitle(envisionData.subtitle || "");
//         setEnvisionDescription(envisionData.description || "");
        
//         const img1 = envisionData.images?.[0] || "";
//         const img2 = envisionData.images?.[1] || "";
        
//         const displayImg1 = img1 && !img1.startsWith("http") 
//           ? `http://127.0.0.1:8000/storage/${img1.replace(/^\/storage\//, '')}` 
//           : img1;
//         const displayImg2 = img2 && !img2.startsWith("http") 
//           ? `http://127.0.0.1:8000/storage/${img2.replace(/^\/storage\//, '')}` 
//           : img2;
        
//         setEnvisionImage1(img1);
//         setEnvisionImage2(img2);
//         setEnvisionImage1Preview(displayImg1);
//         setEnvisionImage2Preview(displayImg2);
//       } else {
//         resetEnvisionForm();
//       }
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[key] });
//     }
    
//     setHasChanges(false);
//     setEnvisionHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   const updateField = (field, value) => {
//     setEditedSection({ ...editedSection, [field]: value });
//     setHasChanges(true);
//     setSaved(false);
//   };

//   const updateArrayField = (field, index, value) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr[index] = value;
//     updateField(field, arr);
//   };

//   const addArrayItem = (field) => {
//     const arr = editedSection[field] ? [...editedSection[field]] : [];
//     arr.push("");
//     updateField(field, arr);
//   };

//   const removeArrayItem = (field, index) => {
//     const arr = [...editedSection[field]];
//     arr.splice(index, 1);
//     updateField(field, arr);
//   };

//   // Envision section handlers
//   const handleEnvisionTitleChange = (value) => {
//     setEnvisionTitle(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionSubtitleChange = (value) => {
//     setEnvisionSubtitle(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionDescriptionChange = (value) => {
//     setEnvisionDescription(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionImage1UrlChange = (value) => {
//     setEnvisionImage1(value);
//     setEnvisionImage1Preview(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionImage2UrlChange = (value) => {
//     setEnvisionImage2(value);
//     setEnvisionImage2Preview(value);
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const handleEnvisionImage1FileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setEnvisionImage1File(file);
//       setEnvisionImage1Preview(URL.createObjectURL(file));
//       setEnvisionHasChanges(true);
//       setSaved(false);
//       setError(null);
//     }
//   };

//   const handleEnvisionImage2FileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setEnvisionImage2File(file);
//       setEnvisionImage2Preview(URL.createObjectURL(file));
//       setEnvisionHasChanges(true);
//       setSaved(false);
//       setError(null);
//     }
//   };

//   const deleteEnvisionImage1 = () => {
//     setEnvisionImage1("");
//     setEnvisionImage1File(null);
//     setEnvisionImage1Preview("");
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const deleteEnvisionImage2 = () => {
//     setEnvisionImage2("");
//     setEnvisionImage2File(null);
//     setEnvisionImage2Preview("");
//     setEnvisionHasChanges(true);
//     setSaved(false);
//   };

//   const deleteEnvisionSection = async () => {
//     if (!confirm("Delete the entire Envision Your Special Day section? This action cannot be undone.")) return;
    
//     try {
//       const existing = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
//       if (existing.success && existing.data && existing.data.id) {
//         const result = await apiRequest(`${ADMIN_ENDPOINTS.envision_your_special_day}/${existing.data.id}`, "DELETE", null, token);
//         if (result.success) {
//           resetEnvisionForm();
//           setEnvisionHasChanges(false);
//           setSaved(true);
//           setTimeout(() => setSaved(false), 2500);
//         } else {
//           setError(result.message || "Error deleting section");
//         }
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     }
//   };

//   const backToHero = () => {
//     if (envisionHasChanges && !confirm("You have unsaved changes. Discard them and go back?")) return;
//     setActiveSection("hero");
//     setEditedSection({ images: slides.map(s => s.image_url) });
//     setEditingSlideIndex(null);
//     setEnvisionHasChanges(false);
//     setSaved(false);
//     setError(null);
//   };

//   const saveEnvisionSection = async () => {
//     setEnvisionSaving(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", envisionTitle);
//     formData.append("subtitle", envisionSubtitle);
//     formData.append("description", envisionDescription);
    
//     // Handle image1 - priority: file upload > URL
//     if (envisionImage1File) {
//       formData.append("image0", envisionImage1File);
//     } else if (envisionImage1) {
//       formData.append("existing_image0", envisionImage1);
//     } else {
//       formData.append("existing_image0", "");
//     }
    
//     // Handle image2 - priority: file upload > URL
//     if (envisionImage2File) {
//       formData.append("image1", envisionImage2File);
//     } else if (envisionImage2) {
//       formData.append("existing_image1", envisionImage2);
//     } else {
//       formData.append("existing_image1", "");
//     }
    
//     try {
//       const existing = await apiRequest(API_ENDPOINTS.envision_your_special_day, "GET");
      
//       let result;
//       if (existing.success && existing.data && existing.data.id) {
//         formData.append("_method", "PUT");
//         result = await apiRequest(`${ADMIN_ENDPOINTS.envision_your_special_day}/${existing.data.id}`, "POST", formData, token, true);
//       } else {
//         result = await apiRequest(ADMIN_ENDPOINTS.envision_your_special_day, "POST", formData, token, true);
//       }
      
//       if (result.success) {
//         // Refresh data with the returned images
//         const freshData = result.data;
        
//         setEnvisionTitle(freshData.title || "");
//         setEnvisionSubtitle(freshData.subtitle || "");
//         setEnvisionDescription(freshData.description || "");
        
//         // Set image previews from returned data
//         const img1 = freshData.images?.[0] || "";
//         const img2 = freshData.images?.[1] || "";
        
//         setEnvisionImage1(img1);
//         setEnvisionImage2(img2);
//         setEnvisionImage1Preview(img1);
//         setEnvisionImage2Preview(img2);
        
//         setEnvisionImage1File(null);
//         setEnvisionImage2File(null);
//         setEnvisionHasChanges(false);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 2500);
//       } else {
//         setError(result.message || "Error saving data");
//         if (result.errors) {
//           const errorMessages = Object.values(result.errors).flat().join(", ");
//           setError(errorMessages);
//         }
//       }
//     } catch (err) {
//       setError("Network error: " + err.message);
//       console.error("Save error:", err);
//     } finally {
//       setEnvisionSaving(false);
//     }
//   };

//   // Slide management functions (for hero section)
//   const addNewSlide = () => {
//     setEditingSlideIndex(-1);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({
//       title: "",
//       subtitle: "",
//       description: "",
//       image_url: "",
//       sort_order: slides.length + 1,
//     });
//     setHasChanges(true);
//   };

//   const editSlide = (index) => {
//     setEditingSlideIndex(index);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ ...slides[index] });
//     setHasChanges(false);
//   };

//   const cancelEditSlide = () => {
//     setEditingSlideIndex(null);
//     setSelectedFile(null);
//     setImagePreview(null);
//     setEditedSection({ images: slides.map(s => s.image_url) });
//     setHasChanges(false);
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please select a valid image (JPEG, PNG, WebP, GIF)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     }
//   };

//   const saveSlide = async () => {
//     setUploading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append("title", editedSection.title || "");
//     formData.append("subtitle", editedSection.subtitle || "");
//     formData.append("description", editedSection.description || "");
//     formData.append("sort_order", editedSection.sort_order || slides.length + 1);
    
//     if (selectedFile) {
//       formData.append("image", selectedFile);
//     }
    
//     let result;
//     if (editingSlideIndex === -1) {
//       result = await apiRequest("/admin/wedding/slides", "POST", formData, token, true);
//     } else {
//       formData.append("_method", "PUT");
//       const slideId = slides[editingSlideIndex].id;
//       result = await apiRequest(`/admin/wedding/slides/${slideId}`, "POST", formData, token, true);
//     }
    
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     } else {
//       setError(result.message || "Error saving slide");
//       if (result.errors) {
//         const errorMessages = Object.values(result.errors).flat().join(", ");
//         setError(errorMessages);
//       }
//     }
//     setUploading(false);
//   };

//   const deleteSlide = async (index) => {
//     if (!confirm("Delete this slide?")) return;
//     const slideId = slides[index].id;
//     const result = await apiRequest(`/admin/wedding/slides/${slideId}`, "DELETE", null, token);
//     if (result.success) {
//       const freshSlides = await fetchSlides();
//       setSlides(freshSlides);
//       setEditedSection({ images: freshSlides.map(s => s.image_url) });
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
//       await apiRequest(`/admin/wedding/slides/${newSlides[i].id}`, "PUT", { sort_order: i + 1 }, token);
//     }

//     const freshSlides = await fetchSlides();
//     setSlides(freshSlides);
//     setEditedSection({ images: freshSlides.map(s => s.image_url) });
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const handleSave = () => {
//     if (activeSection === "hero") {
//       if (editingSlideIndex !== null) {
//         saveSlide();
//       }
//     } else if (activeSection === "envision_your_special_day") {
//       saveEnvisionSection();
//     } else {
//       const updated = {
//         ...data,
//         homepage: {
//           ...data.homepage,
//           [activeSection]: editedSection,
//         },
//       };
//       saveSiteData(updated);
//       setData(updated);
//       setHasChanges(false);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);
//     }
//   };

//   const handleReset = () => {
//     if (activeSection === "hero") {
//       setEditedSection({ images: slides.map(s => s.image_url) });
//       setEditingSlideIndex(null);
//       setSelectedFile(null);
//       setImagePreview(null);
//     } else if (activeSection === "envision_your_special_day") {
//       resetEnvisionForm();
//     } else {
//       const defaultData = loadSiteData();
//       setEditedSection({ ...defaultData.homepage[activeSection] });
//     }
//     setHasChanges(true);
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
//           <p className="text-gray-500 mt-2">Please login to manage wedding content</p>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // RULES (MATCHED + CLEAN)
//   // =========================

//   const showTitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showSubtitle = activeSection !== "multiple_images" && activeSection !== "services";
//   const showImage = !["why_choose_luxury_garden_palace", "services"].includes(activeSection);
//   const isTwoImages = activeSection === "envision_your_special_day" || activeSection === "prime_luxury_apartment_living";
//   const isFourImages = activeSection === "multiple_images" || activeSection === "hero";
//   const isServices = activeSection === "services";
//   const isFeatures = activeSection === "why_choose_luxury_garden_palace" || activeSection === "Location";
//   const isAmenities = activeSection === "prime_luxury_apartment_living" || activeSection === "wedding_accommodations";

//   // Hero Section Slide Editor View
//   if (activeSection === "hero" && editingSlideIndex !== null) {
//     const isNew = editingSlideIndex === -1;
//     const previewImage = imagePreview || editedSection.image_url;
    
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold">{isNew ? "Add New Slide" : "Edit Slide"}</h2>
//             <p className="text-sm text-gray-500">Upload an image from your computer for the hero slider</p>
//           </div>
//           <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//             Cancel
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="space-y-4 bg-white p-6 rounded-xl">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={editedSection.title || ""}
//                 onChange={(e) => updateField("title", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="e.g., Exclusive Wedding Experience"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={editedSection.subtitle || ""}
//                 onChange={(e) => updateField("subtitle", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder="e.g., Luxury Wedding Venue"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={editedSection.description || ""}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 className="w-full border p-2 rounded"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Image</label>
//               <div className="flex gap-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm w-full justify-center">
//                   <Upload size={16} />
//                   Select Image from Computer
//                   <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//                 </label>
//               </div>
//               {selectedFile && (
//                 <p className="text-xs text-emerald-600 mt-2">Selected: {selectedFile.name}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Display Order</label>
//               <input
//                 type="number"
//                 value={editedSection.sort_order || slides.length + 1}
//                 onChange={(e) => updateField("sort_order", parseInt(e.target.value))}
//                 className="w-full border p-2 rounded"
//                 placeholder="Order number (lower = appears first)"
//               />
//               <p className="text-xs text-gray-400 mt-1">Slides are displayed in ascending order</p>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {previewImage && <img src={previewImage} className="rounded mb-3 w-full" alt="Preview" />}
//             {editedSection.title && <h3 className="font-bold text-lg">{editedSection.title}</h3>}
//             {editedSection.subtitle && <p className="text-sm text-amber-600">{editedSection.subtitle}</p>}
//             {editedSection.description && <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={cancelEditSlide} className="px-4 py-2 border rounded-lg">Cancel</button>
//           <button onClick={saveSlide} disabled={uploading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
//             {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//             {isNew ? "Create Slide" : "Update Slide"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Hero Section Slides List View
//   if (activeSection === "hero" && editingSlideIndex === null) {
//     return (
//       <div className="space-y-6 p-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//             <p className="mt-1 text-sm text-slate-500">Edit the Hero Section content - Wedding Slides</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {saved && (
//               <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//                 <Check size={16} /> Saved successfully
//               </span>
//             )}
//             <button onClick={addNewSlide} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//               <Plus size={16} /> Add New Slide
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 mb-6">
//           {Object.entries(sectionLabels).map(([key, label]) => (
//             <button
//               key={key}
//               onClick={() => switchSection(key)}
//               className={`text-[10px] p-2 rounded-lg ${activeSection === key ? "bg-white shadow" : ""}`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-3">
//           {slides?.map((slide, index) => {
//             const imageUrl = slide.image_url && !slide.image_url.startsWith("http") 
//               ? `http://127.0.0.1:8000/storage/${slide.image_url}` 
//               : slide.image_url;
              
//             return (
//               <div key={slide.id} className="border rounded-lg p-4 flex gap-4 items-center">
//                 <img src={imageUrl} alt={slide.title} className="w-24 h-24 object-cover rounded" />
//                 <div className="flex-1">
//                   <h3 className="font-semibold">{slide.title}</h3>
//                   <p className="text-sm text-gray-500">{slide.subtitle}</p>
//                   <p className="text-sm text-gray-600 line-clamp-2">{slide.description}</p>
//                   <p className="text-xs text-gray-400 mt-1">Order: {slide.sort_order || index + 1}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   {index > 0 && (
//                     <button onClick={() => moveSlide(index, "up")} className="p-2 border rounded hover:bg-gray-50" title="Move Up">
//                       <ArrowUp size={16} />
//                     </button>
//                   )}
//                   {index < slides.length - 1 && (
//                     <button onClick={() => moveSlide(index, "down")} className="p-2 border rounded hover:bg-gray-50" title="Move Down">
//                       <ArrowDown size={16} />
//                     </button>
//                   )}
//                   <button onClick={() => editSlide(index)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
//                   <button onClick={() => deleteSlide(index)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
//                 </div>
//               </div>
//             );
//           })}
//           {(!slides || slides.length === 0) && (
//             <div className="text-center py-10 text-gray-500">No slides yet. Click "Add New Slide" to create one.</div>
//           )}
//         </div>

//         <WeddingVenuesManagerMicroService />
//         <WeddingServicesManagerMicroService />
//         <WeddingPackagesManagerMicroService />
//         <WeddingRoomBlocksManagerMicroService />
//         <WeddingGalleryManagerMicroService />
//       </div>
//     );
//   }

//   // =========================
//   // ENVISION YOUR SPECIAL DAY SECTION (IMAGES ONLY IN PREVIEW)
//   // =========================
//   if (activeSection === "envision_your_special_day") {
//     return (
//       <div className="space-y-6 p-6">
//         {/* Back Button */}
//         <button
//           onClick={backToHero}
//           className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors mb-4"
//         >
//           <ArrowLeft size={20} />
//           Back to Hero Section
//         </button>

//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-xl font-bold">Envision Your Special Day Section</h2>
//             <p className="text-sm text-gray-500">Edit the content for this section (Upload or enter URL)</p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={handleReset} className="px-3 py-2 border rounded-lg flex items-center gap-2">
//               <RotateCcw size={15} /> Reset
//             </button>
//             <button
//               onClick={deleteEnvisionSection}
//               className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
//             >
//               <Trash2 size={15} /> Delete Section
//             </button>
//             <button 
//               onClick={handleSave} 
//               disabled={!envisionHasChanges && !envisionSaving} 
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${(envisionHasChanges || envisionSaving) ? "bg-amber-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
//             >
//               {envisionSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
//               {envisionSaving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
//             <AlertCircle size={16} /> {error}
//           </div>
//         )}

//         {saved && (
//           <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
//             <Check size={16} /> Saved successfully!
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* LEFT - EDIT FORM (No images displayed here) */}
//           <div className="space-y-4 bg-white p-6 rounded-xl">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 value={envisionTitle}
//                 onChange={(e) => handleEnvisionTitleChange(e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Envision Your Special Day"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Subtitle</label>
//               <input
//                 value={envisionSubtitle}
//                 onChange={(e) => handleEnvisionSubtitleChange(e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 placeholder="e.g., Wedding Venues Luxury"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <textarea
//                 value={envisionDescription}
//                 onChange={(e) => handleEnvisionDescriptionChange(e.target.value)}
//                 className="w-full border rounded-lg p-2.5"
//                 rows={4}
//                 placeholder="Enter description"
//               />
//             </div>
            
//             {/* Image 1 - Left Large Image - No preview here, only upload button and URL input */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image 1 (Left Large Image)</label>
//               <div className="flex gap-2 items-center mb-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                   <Upload size={16} />
//                   Upload Image
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleEnvisionImage1FileSelect} 
//                     className="hidden" 
//                   />
//                 </label>
//                 <input
//                   value={envisionImage1}
//                   onChange={(e) => handleEnvisionImage1UrlChange(e.target.value)}
//                   className="flex-1 border rounded-lg p-2.5"
//                   placeholder="Or enter image URL"
//                 />
//               </div>
//               {envisionImage1File && !envisionImage1Preview && (
//                 <p className="text-xs text-emerald-600">File selected, will upload on save</p>
//               )}
//               <p className="text-xs text-gray-400">Upload from computer OR enter image URL</p>
//             </div>
            
//             {/* Image 2 - Bottom Right Small Image - No preview here, only upload button and URL input */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image 2 (Bottom Right Small Image)</label>
//               <div className="flex gap-2 items-center mb-2">
//                 <label className="cursor-pointer bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm">
//                   <Upload size={16} />
//                   Upload Image
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleEnvisionImage2FileSelect} 
//                     className="hidden" 
//                   />
//                 </label>
//                 <input
//                   value={envisionImage2}
//                   onChange={(e) => handleEnvisionImage2UrlChange(e.target.value)}
//                   className="flex-1 border rounded-lg p-2.5"
//                   placeholder="Or enter image URL"
//                 />
//               </div>
//               {envisionImage2File && !envisionImage2Preview && (
//                 <p className="text-xs text-emerald-600">File selected, will upload on save</p>
//               )}
//               <p className="text-xs text-gray-400">Upload from computer OR enter image URL</p>
//             </div>
//           </div>

//           {/* RIGHT - PREVIEW (Images ONLY displayed here) */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold mb-3">Preview</h3>
//             {envisionImage1Preview && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Left Large Image:</p>
//                 <img 
//                   src={envisionImage1Preview} 
//                   className="rounded-lg mb-3 w-full h-64 object-cover" 
//                   alt="Preview 1"
//                   onError={(e) => { 
//                     e.target.src = "https://placehold.co/800x1000?text=Invalid+Image";
//                   }}
//                 />
//               </div>
//             )}
//             {envisionImage2Preview && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Bottom Right Small Image:</p>
//                 <img 
//                   src={envisionImage2Preview} 
//                   className="rounded-lg mb-3 w-full h-48 object-cover" 
//                   alt="Preview 2"
//                   onError={(e) => { 
//                     e.target.src = "https://placehold.co/800x400?text=Invalid+Image";
//                   }}
//                 />
//               </div>
//             )}
//             {!envisionImage1Preview && !envisionImage2Preview && (
//               <div className="text-center py-10 text-gray-400">
//                 <p>No images to preview</p>
//                 <p className="text-xs mt-1">Upload images or enter URLs above, then click Save</p>
//               </div>
//             )}
//             <div className="mt-4 pt-3 border-t border-gray-200">
//               <h2 className="font-bold text-xl">{envisionTitle || "No Title"}</h2>
//               <p className="text-amber-600 text-sm">{envisionSubtitle || "No Subtitle"}</p>
//               <p className="text-gray-600 text-sm mt-2">{envisionDescription || "No Description"}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // ALL OTHER SECTIONS - FULL UI (PRESERVED)
//   // =========================

//   return (
//     <div className="space-y-6 p-6">
//       {/* HEADER */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Wedding homepage Content</h1>
//           <p className="mt-1 text-sm text-slate-500">Edit the content displayed on your wedding</p>
//           {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//         </div>

//         <div className="flex items-center gap-2">
//           {saved && (
//             <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
//               <Check size={16} /> Saved successfully
//             </span>
//           )}
//           <button
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//           >
//             <RotateCcw size={15} /> Reset
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!hasChanges}
//             className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
//               hasChanges
//                 ? "bg-gradient-to-r from-amber-500 to-amber-600"
//                 : "bg-slate-300 cursor-not-allowed"
//             }`}
//           >
//             <Save size={15} /> Save Changes
//           </button>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
//         {Object.entries(sectionLabels).map(([key, label]) => (
//           <button
//             key={key}
//             onClick={() => switchSection(key)}
//             className={`text-[10px] p-2 rounded-lg ${
//               activeSection === key ? "bg-white shadow" : ""
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-5 gap-6">

//         {/* LEFT - EDIT FORM */}
//         <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-xl">
//           {showTitle && (
//             <input
//               value={editedSection?.title || ""}
//               onChange={(e) => updateField("title", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Title"
//             />
//           )}

//           {showSubtitle && (
//             <input
//               value={editedSection?.subtitle || ""}
//               onChange={(e) => updateField("subtitle", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Subtitle"
//             />
//           )}

//           {activeSection !== "multiple_images" && activeSection !== "services" && (
//             <textarea
//               value={editedSection?.description || ""}
//               onChange={(e) => updateField("description", e.target.value)}
//               className="w-full border p-2 rounded"
//               rows={4}
//               placeholder="Description"
//             />
//           )}

//           {showImage && !isTwoImages && !isFourImages && (
//             <input
//               value={editedSection?.imageUrl || ""}
//               onChange={(e) => updateField("imageUrl", e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Image URL"
//             />
//           )}

//           {isTwoImages &&
//             [0, 1].map((i) => (
//               <input
//                 key={i}
//                 value={editedSection?.images?.[i] || ""}
//                 onChange={(e) => updateArrayField("images", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Image ${i + 1}`}
//               />
//             ))}

//           {isFourImages &&
//             [0, 1, 2, 3].map((i) => (
//               <input
//                 key={i}
//                 value={editedSection?.images?.[i] || ""}
//                 onChange={(e) => updateArrayField("images", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Image ${i + 1}`}
//               />
//             ))}

//           {isServices &&
//             Array.from({ length: 12 }).map((_, i) => (
//               <input
//                 key={i}
//                 value={editedSection?.items?.[i] || ""}
//                 onChange={(e) => updateArrayField("items", i, e.target.value)}
//                 className="w-full border p-2 rounded"
//                 placeholder={`Service ${i + 1}`}
//               />
//             ))}

//           {/* Features for why_choose and Location */}
//           {isFeatures && (
//             <div>
//               <label className="block text-sm font-medium mb-2">Features</label>
//               {editedSection?.features?.map((feature, idx) => (
//                 <div key={idx} className="flex gap-2 mb-2">
//                   <input
//                     value={feature}
//                     onChange={(e) => updateArrayField("features", idx, e.target.value)}
//                     className="flex-1 border p-2 rounded"
//                     placeholder={`Feature ${idx + 1}`}
//                   />
//                   <button
//                     onClick={() => removeArrayItem("features", idx)}
//                     className="px-3 bg-red-500 text-white rounded"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={() => addArrayItem("features")}
//               className="text-sm text-amber-600 flex items-center gap-1"
//               >
//                 + Add Feature
//               </button>
//             </div>
//           )}

//           {/* Amenities for prime_luxury and accommodations */}
//           {isAmenities && (
//             <div>
//               <label className="block text-sm font-medium mb-2">Amenities</label>
//               {editedSection?.amenities?.map((amenity, idx) => (
//                 <div key={idx} className="flex gap-2 mb-2">
//                   <input
//                     value={amenity}
//                     onChange={(e) => updateArrayField("amenities", idx, e.target.value)}
//                     className="flex-1 border p-2 rounded"
//                     placeholder={`Amenity ${idx + 1}`}
//                   />
//                   <button
//                     onClick={() => removeArrayItem("amenities", idx)}
//                     className="px-3 bg-red-500 text-white rounded"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={() => addArrayItem("amenities")}
//                 className="text-sm text-amber-600 flex items-center gap-1"
//               >
//                 + Add Amenity
//               </button>
//             </div>
//           )}
//         </div>

//         {/* RIGHT - PREVIEW */}
//         <div className="lg:col-span-2 bg-white p-4 rounded-xl">
//           {editedSection?.imageUrl && (
//             <img src={editedSection.imageUrl} className="rounded mb-3 w-full" alt="Preview" />
//           )}
//           {editedSection?.images?.map((img, i) => (
//             img && <img key={i} src={img} className="rounded mb-2 w-full" alt={`Preview ${i + 1}`} />
//           ))}
//           <h3 className="font-bold text-lg">{editedSection?.title}</h3>
//           {showSubtitle && editedSection?.subtitle && (
//             <p className="text-sm text-amber-600">{editedSection.subtitle}</p>
//           )}
//           {editedSection?.description && (
//             <p className="text-sm text-gray-500 mt-1">{editedSection.description}</p>
//           )}
//           {editedSection?.features && editedSection.features.length > 0 && (
//             <ul className="text-sm mt-2 space-y-1">
//               {editedSection.features.map((feature, i) => (
//                 feature && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {feature}</li>
//               ))}
//             </ul>
//           )}
//           {editedSection?.amenities && editedSection.amenities.length > 0 && (
//             <ul className="text-sm mt-2 space-y-1">
//               {editedSection.amenities.map((amenity, i) => (
//                 amenity && <li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span> {amenity}</li>
//               ))}
//             </ul>
//           )}
//           {editedSection?.items && editedSection.items.length > 0 && (
//             <ul className="text-sm mt-2 list-disc pl-4">
//               {editedSection.items.map((item, i) => (
//                 item && <li key={i}>{item}</li>
//               ))}
//             </ul>
  //           )}
  //         </div>
  //       </div>

  //       {/* MICRO SERVICES */}
  //       <WeddingVenuesManagerMicroService />
  //       <WeddingServicesManagerMicroService />
  //       <WeddingPackagesManagerMicroService />
  //       <WeddingRoomBlocksManagerMicroService />
  //       <WeddingGalleryManagerMicroService />
  //     </div>
  //   );
  // }















  import { useState } from "react";
  import HeroSectionManager from "./HeroSectionManager";
  import EnvisionSectionManager from "./EnvisionSectionManager";
  import ServicesSectionManager from "./ServicesSectionManager";
  import WhyChooseSectionManager from "./WhyChooseSectionManager";
  import PrimeApartmentSectionManager from "./PrimeApartmentSectionManager";
  import AccommodationsSectionManager from "./AccommodationsSectionManager";
  import LocationSectionManager from "./LocationSectionManager";
  import MultipleImagesSectionManager from "./MultipleImagesSectionManager";

  import WeddingVenuesManagerMicroService from "./wedding-microservices/WeddingVenuesManagerMicroService";
  import WeddingServicesManagerMicroService from "./wedding-microservices/WeddingServicesManagerMicroService";
  import WeddingPackagesManagerMicroService from "./wedding-microservices/WeddingPackagesManagerMicroService";
  import WeddingRoomBlocksManagerMicroService from "./wedding-microservices/WeddingRoomBlocksManagerMicroService";
  import WeddingGalleryManagerMicroService from "./wedding-microservices/WeddingGalleryManagerMicroService";

  const sectionLabels = {
    hero: "Hero Section",
    envision_your_special_day: "Envision Your Special Day Section",
    services: "Services Section",
    why_choose_luxury_garden_palace: "Why Choose Luxury Garden Palace Section",
    prime_luxury_apartment_living: "Prime Luxury Apartment Living Section",
    wedding_accommodations: "Wedding Accommodations Section",
    Location: "Location Section",
    multiple_images: "Multiple Images Section",
  };

  export default function WeddingManager() {
    const [activeSection, setActiveSection] = useState("hero");

    const renderSection = () => {
      switch (activeSection) {
        case "hero":
          return <HeroSectionManager />;
        case "envision_your_special_day":
          return <EnvisionSectionManager />;
        case "services":
          return <ServicesSectionManager />;
        case "why_choose_luxury_garden_palace":
          return <WhyChooseSectionManager />;
        case "prime_luxury_apartment_living":
          return <PrimeApartmentSectionManager />;
        case "wedding_accommodations":
          return <AccommodationsSectionManager />;
        case "Location":
          return <LocationSectionManager />;
        case "multiple_images":
          return <MultipleImagesSectionManager />;
        default:
          return <HeroSectionManager />;
      }
    };

    return (
      <div className="space-y-6 p-6">
        {/* TABS */}
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          {Object.entries(sectionLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`text-[10px] p-2 rounded-lg ${
                activeSection === key ? "bg-white shadow" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Render selected section */}
        <div className="bg-white rounded-xl shadow-sm">
          {renderSection()}
        </div>

        {/* MICRO SERVICES */}
        <WeddingVenuesManagerMicroService />
        <WeddingServicesManagerMicroService />
        <WeddingPackagesManagerMicroService />
        <WeddingRoomBlocksManagerMicroService />
        <WeddingGalleryManagerMicroService />
      </div>
    );
  }