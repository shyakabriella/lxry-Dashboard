// import React, { useEffect, useState } from "react";

// // Use environment variables
// const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";
// const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "/storage";

// // Helper function to get full image URL
// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   if (path.startsWith('/storage')) return `${STORAGE_URL}${path}`;
//   if (path.startsWith('storage')) return `${STORAGE_URL}/${path}`;
//   return `${STORAGE_URL}/${path}`;
// };

// // Image Carousel Component for Accommodations
// function ImageCarousel({ images, title }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
  
//   const validImages = images?.filter(img => img && img.trim() !== "") || [];
  
//   if (validImages.length === 0) {
//     return (
//       <div className="relative h-[420px] w-full bg-gray-200 rounded-md flex items-center justify-center">
//         <p className="text-gray-400">No images available</p>
//       </div>
//     );
//   }

//   const goNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % validImages.length);
//   };

//   const goPrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
//   };

//   return (
//     <div className="relative group">
//       <div className="relative overflow-hidden rounded-md bg-white">
//         <img
//           src={getImageUrl(validImages[currentIndex])}
//           alt={`${title} - Image ${currentIndex + 1}`}
//           className="h-[420px] w-full rounded-md object-cover transition-all duration-700"
//           onError={(e) => {
//             e.target.src = "https://via.placeholder.com/800x500?text=Image+Not+Found";
//           }}
//         />
//       </div>

//       {validImages.length > 1 && (
//         <>
//           <button
//             onClick={goPrev}
//             className="absolute left-4 top-1/2 -translate-y-1/2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#a88f53] text-white opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-105 hover:bg-[#947b43] md:h-[44px] md:w-[44px]"
//             aria-label="Previous image"
//           >
//             <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
//               <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>

//           <button
//             onClick={goNext}
//             className="absolute right-4 top-1/2 -translate-y-1/2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#a88f53] text-white opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-105 hover:bg-[#947b43] md:h-[44px] md:w-[44px]"
//             aria-label="Next image"
//           >
//             <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
//               <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>

//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//             {validImages.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setCurrentIndex(idx)}
//                 className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                   currentIndex === idx ? 'bg-[#a88f53] w-4' : 'bg-white/70 hover:bg-white'
//                 }`}
//                 aria-label={`Go to image ${idx + 1}`}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // Accommodation Card Component (Section 2)
// function AccommodationCard({ item, reverse = false }) {
//   const images = item.images || ["", "", ""];
  
//   return (
//     <section className="bg-[#f1f0eb] py-10 sm:py-14 md:py-16 lg:py-18">
//       <div
//         className={`mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 px-5 sm:px-6 md:px-8 lg:gap-16 lg:px-10 ${
//           reverse ? "lg:grid-cols-[1fr_0.95fr]" : "lg:grid-cols-[0.95fr_1fr]"
//         }`}
//       >
//         <div className={`${reverse ? "order-2 lg:order-1" : "order-2"} max-w-[560px]`}>
//           <h2
//             className="text-[17px] font-normal leading-[0.98] text-[#23354a] sm:text-[25px] md:text-[30px]"
//             style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
//           >
//             {item.title}
//           </h2>

//           {item.subtitle && (
//             <p className="mt-6 text-[12px] font-semibold leading-[1.5] text-[#113a54] sm:text-[13px] md:text-[14px]">
//               {item.subtitle}
//             </p>
//           )}

//           {item.description && (
//             <p className="mt-6 text-[11px] leading-[1.8] text-[#171717] sm:text-[12px] md:text-[13px]">
//               {item.description}
//             </p>
//           )}
//         </div>

//         <div className={`${reverse ? "order-1 lg:order-2" : "order-1"}`}>
//           <ImageCarousel images={images} title={item.title} />
//         </div>
//       </div>
//     </section>
//   );
// }

// // Main Component
// export default function RoomBlock() {
//   // Hero Data
//   const [heroData, setHeroData] = useState({
//     title: "Room Blocks",
//     background_image: "/images/bed9.JPG",
//   });
  
//   // Section 1 - Meeting Rooms Data (FROM YOUR MANAGER API)
//   const [meetingData, setMeetingData] = useState({
//     title: "Meeting Rooms in California",
//     subtitle: "Premium Meeting Spaces",
//     description: "Our state-of-the-art meeting rooms are designed for productivity and comfort..."
//   });
  
//   // Section 2 - Accommodations Data
//   const [accommodations, setAccommodations] = useState([]);
  
//   // Section 3 - Essentials Data
//   const [essentials, setEssentials] = useState([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Fetch Hero Section (if API endpoint exists)
//       try {
//         const heroResponse = await fetch(`${API_URL}/wedding-room-blocks/hero`);
//         const heroResult = await heroResponse.json();
        
//         if (heroResult.success && heroResult.data) {
//           const imageValue = heroResult.data.background_image || heroResult.data.image_url;
//           setHeroData({
//             title: heroResult.data.title || "Room Blocks",
//             background_image: getImageUrl(imageValue) || "/images/bed9.JPG",
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching hero:", err);
//       }
      
//       // ========== SECTION 1 - MEETING ROOMS (Using your existing API) ==========
//       try {
//         const section1Response = await fetch(`${API_URL}/wedding-room-blocks/section1`);
//         const section1Result = await section1Response.json();
        
//         if (section1Result.success && section1Result.data) {
//           setMeetingData({
//             title: section1Result.data.title || "Meeting Rooms in California",
//             subtitle: section1Result.data.subtitle || "",
//             description: section1Result.data.description || ""
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching section1:", err);
//       }
      
//       // ========== SECTION 2 - ACCOMMODATION TYPES ==========
//       try {
//         const section2Response = await fetch(`${API_URL}/wedding-room-blocks/section2`);
//         const section2Result = await section2Response.json();
        
//         if (section2Result.success && section2Result.data) {
//           const sortedData = [...section2Result.data].sort((a, b) => 
//             (a.sort_order || 0) - (b.sort_order || 0)
//           );
//           setAccommodations(sortedData);
//         }
//       } catch (err) {
//         console.error("Error fetching section2:", err);
//       }
      
//       // ========== SECTION 3 - ESSENTIALS ==========
//       try {
//         const section3Response = await fetch(`${API_URL}/wedding-room-blocks/section3`);
//         const section3Result = await section3Response.json();
        
//         if (section3Result.success && section3Result.data && section3Result.data.items) {
//           const items = section3Result.data.items;
//           const columns = [];
//           const itemsPerColumn = Math.ceil(items.length / 3);
          
//           for (let i = 0; i < 3; i++) {
//             const start = i * itemsPerColumn;
//             const end = start + itemsPerColumn;
//             columns.push(items.slice(start, end));
//           }
          
//           setEssentials(columns);
//         } else {
//           // Fallback essentials
//           setEssentials([
//             ["Heating & Air-Conditioning", "Satellite TV"],
//             ["In-Room Coffee Service", "Iron & Ironing Board"],
//             ["Free Wi-Fi Access", "Hair Dryer"]
//           ]);
//         }
//       } catch (err) {
//         console.error("Error fetching section3:", err);
//         setEssentials([
//           ["Heating & Air-Conditioning", "Satellite TV"],
//           ["In-Room Coffee Service", "Iron & Ironing Board"],
//           ["Free Wi-Fi Access", "Hair Dryer"]
//         ]);
//       }
      
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to load content. Please refresh the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-[#f1f0eb] min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mx-auto" />
//           <p className="mt-4 text-gray-600">Loading amazing rooms...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-hidden bg-[#f1f0eb] text-[#171717]" style={{ fontFamily: "Montserrat, sans-serif" }}>
      
//       {/* ========== HERO SECTION ========== */}
//       <section className="relative min-h-[72vh] overflow-hidden">
//         <img
//           src={getImageUrl(heroData.background_image) || "/images/bed9.JPG"}
//           alt="Room blocks hero"
//           className="absolute inset-0 h-full w-full object-cover"
//           onError={(e) => {
//             e.target.src = "/images/bed9.JPG";
//           }}
//         />
//         <div className="absolute inset-0 bg-[rgba(30,24,18,0.30)]" />
//         <div className="absolute left-0 right-0 top-[118px] z-10 hidden border-t border-white/45 lg:block" />
//         <div className="relative z-20 mx-auto flex min-h-[72vh] max-w-[1600px] items-center justify-center px-5 text-center sm:px-6 md:px-8 lg:px-10">
//           <div className="pt-28 pb-16 md:pt-32 md:pb-20">
//             <h1
//               className="text-[15px] font-normal leading-[0.95] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] sm:text-[20px] md:text-[43px] lg:text-[40px]"
//               style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
//             >
//               {heroData.title}
//             </h1>
//           </div>
//         </div>
//       </section>

//       {/* ========== SECTION 1 - MEETING ROOMS (DYNAMIC FROM YOUR MANAGER) ========== */}
//       <section className="bg-[#f1f0eb] py-16 sm:py-20 md:py-24 lg:py-28">
//         <div className="mx-auto max-w-[980px] px-5 text-center sm:px-6 md:px-8">
//           <p className="text-[12px] font-normal text-[#a37f58] sm:text-[14px]">
//             Meeting Rooms
//           </p>
//           <h2
//             className="mt-3 text-[17px] font-normal leading-[0.98] text-[#23354a] sm:text-[25px] md:text-[30px]"
//             style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
//           >
//             {meetingData.title}
//           </h2>
//           {meetingData.subtitle && (
//             <p className="mt-3 text-[12px] font-semibold text-[#113a54] sm:text-[13px] md:text-[14px]">
//               {meetingData.subtitle}
//             </p>
//           )}
//           <p className="mx-auto mt-6 max-w-[860px] text-[12px] leading-[1.8] text-[#181818] sm:text-[13px] md:text-[14px]">
//             {meetingData.description}
//           </p>
//         </div>
//       </section>

//       {/* ========== SECTION 2 - ACCOMMODATIONS ========== */}
//       {accommodations.length > 0 ? (
//         accommodations.map((item, index) => (
//           <AccommodationCard 
//             key={item.id} 
//             item={item} 
//             reverse={index % 2 === 1}
//           />
//         ))
//       ) : (
//         <section className="bg-[#f1f0eb] py-20">
//           <div className="text-center">
//             <p className="text-gray-500">No accommodations available at the moment.</p>
//           </div>
//         </section>
//       )}

//       {/* ========== SECTION 3 - RESTFUL ESSENTIALS ========== */}
//       <section className="bg-[#f3f2ee] py-14 sm:py-16 md:py-20">
//         <div className="mx-auto max-w-[1280px] px-5 sm:px-6 md:px-8 lg:px-10">
//           <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
//             <span className="h-px flex-1 bg-[#b59a74]" />
//             <h2
//               className="shrink-0 text-center text-[20px] font-normal leading-none text-[#23354a] sm:text-[26px] md:text-[32px]"
//               style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
//             >
//               Restful Essentials
//             </h2>
//             <span className="h-px flex-1 bg-[#b59a74]" />
//           </div>

//           <div className="mt-10 grid grid-cols-1 gap-y-3 sm:mt-12 lg:grid-cols-3 lg:gap-x-10 xl:gap-x-16">
//             {essentials.length > 0 ? (
//               essentials.map((column, index) => (
//                 <ul key={index} className="space-y-4 px-2 md:px-4">
//                   {column.map((item) => (
//                     <li
//                       key={item}
//                       className="flex items-start gap-3 text-[10px] leading-[1.7] text-[#161616] sm:text-[11px] md:text-[12px]"
//                     >
//                       <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#9b7a58]" />
//                       <span>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               ))
//             ) : (
//               <div className="col-span-3 text-center text-gray-500">
//                 Loading essentials...
//               </div>
//             )}
//           </div>

//           <div className="mt-12">
//             <span className="block h-px w-full bg-[#b59a74]" />
//           </div>
//         </div>
//       </section>

//       {/* Error Message */}
//       {error && (
//         <div className="fixed bottom-4 right-4 z-50">
//           <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
//             {error}
//             <button 
//               onClick={fetchAllData}
//               className="ml-3 underline hover:no-underline"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}
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
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
};

export default function RoomBlocksMeetingManager() {
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
      const result = await apiRequest("/wedding-room-blocks/section1", "GET");
      console.log("Fetched meeting rooms data:", result);
      
      if (result.success && result.data) {
        setSectionData({
          title: result.data.title || "",
          subtitle: result.data.subtitle || "",
          description: result.data.description || "",
        });
        setSectionId(result.data.id);
        setHasChanges(false);
      } else {
        console.log("No meeting rooms data found, using defaults");
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

  const saveSection = async () => {
    if (!sectionData.title) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    try {
      let result;
      if (sectionId) {
        result = await apiRequest(`/admin/wedding-room-blocks/section1/${sectionId}`, "PUT", sectionData, token);
      } else {
        result = await apiRequest("/admin/wedding-room-blocks/section1", "POST", sectionData, token);
      }

      console.log("Save response:", result);

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
      setError("Failed to save section. Please check your connection.");
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Meeting Rooms Section</h2>
          <p className="text-sm text-gray-500">Manage the meeting rooms content displayed on the website</p>
        </div>
        <div className="flex gap-2">
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              value={sectionData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Enter title (e.g., Meeting Rooms in California)"
            />
            <p className="text-xs text-gray-500 mt-1">Main heading for the meeting rooms section</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              value={sectionData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Enter subtitle (e.g., Premium Meeting Spaces)"
            />
            <p className="text-xs text-gray-500 mt-1">Optional subtitle displayed below the title</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={sectionData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              rows={6}
              placeholder="Enter detailed description of your meeting rooms"
            />
            <p className="text-xs text-gray-500 mt-1">Detailed information about the meeting rooms</p>
          </div>
        </div>

        {/* Right - Live Preview */}
        <div className="bg-gray-50 p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-sm p-6 text-center">
            <p className="text-[13px] uppercase tracking-[0.2em] text-amber-600 font-medium">
              Meeting Rooms
            </p>
            <h2 className="font-bold text-2xl text-gray-800 mt-2 mb-3">
              {sectionData.title || "No title saved"}
            </h2>
            {sectionData.subtitle && (
              <p className="text-amber-600 text-sm font-medium mb-4">
                {sectionData.subtitle}
              </p>
            )}
            <p className="text-gray-600 text-sm leading-relaxed">
              {sectionData.description || "No description provided"}
            </p>
          </div>

          {/* Website Preview Styling */}
          <div className="mt-4 p-4 bg-[#f1f0eb] rounded-lg">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Website preview - This is how it will appear on the site
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}