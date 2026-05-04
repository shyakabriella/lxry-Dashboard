import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, AlertCircle, Plus, Trash2 } from "lucide-react";

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

export default function RoomBlocksEssentialsManager() {
  const [items, setItems] = useState([]);
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
      setLoading(true);
      const result = await apiRequest("/wedding-room-blocks/section3", "GET");
      
      if (result.success && result.data) {
        setItems(result.data.items || []);
        setSectionId(result.data.id);
        setHasChanges(false);
        setError(null);
      } else if (result.success === false) {
        // No data exists yet, start with empty array
        setItems([]);
        setSectionId(null);
        setHasChanges(false);
      }
    } catch (err) { 
      console.error(err);
      setError("Failed to load essentials data");
    } finally { 
      setLoading(false); 
    }
  };

  const addItem = () => { 
    setItems([...items, ""]); 
    setHasChanges(true); 
    setSaved(false);
  };
  
  const updateItem = (index, value) => { 
    const newItems = [...items]; 
    newItems[index] = value; 
    setItems(newItems); 
    setHasChanges(true); 
    setSaved(false); 
  };
  
  const removeItem = (index) => { 
    const newItems = items.filter((_, i) => i !== index); 
    setItems(newItems); 
    setHasChanges(true); 
    setSaved(false); 
  };

  const saveSection = async () => {
    if (!hasChanges) return;
    
    setSaving(true);
    setError(null);
    
    // Filter out empty items
    const filteredItems = items.filter(item => item.trim() !== "");
    const submitData = { items: filteredItems };
    
    try {
      let result;
      if (sectionId) {
        // Update existing section
        result = await apiRequest(`/admin/wedding-room-blocks/section3/${sectionId}`, "PUT", submitData, token);
      } else {
        // Create new section
        result = await apiRequest("/admin/wedding-room-blocks/section3", "POST", submitData, token);
      }
      
      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Refresh data to get updated ID if it was a new creation
        await fetchSectionData();
      } else { 
        setError(result.message || "Error saving essentials"); 
      }
    } catch (err) { 
      console.error(err);
      setError("Failed to save. Please try again."); 
    } finally { 
      setSaving(false); 
    }
  };

  const resetForm = () => {
    fetchSectionData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading essentials...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          <AlertCircle className="inline-block mr-2" size={20} />
          Please login first to manage essentials
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Restful Essentials</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the list of room essentials displayed on the website</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetForm} 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button 
            onClick={saveSection} 
            disabled={!hasChanges || saving} 
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              hasChanges && !saving 
                ? "bg-amber-500 hover:bg-amber-600 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700">
          <Check size={18} />
          <span>Essentials saved successfully!</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Essentials Items
            </label>
            <p className="text-xs text-gray-500">Add, edit, or remove room amenities and features</p>
          </div>
          
          <div className="p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No items added yet</p>
                <p className="text-sm mt-1">Click "Add Item" to start building your list</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input 
                      value={item} 
                      onChange={(e) => updateItem(idx, e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder={`Enter essential item ${idx + 1}`}
                    />
                  </div>
                  <button 
                    onClick={() => removeItem(idx)} 
                    className="px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
            
            <button 
              onClick={addItem} 
              className="mt-2 text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
            >
              <Plus size={16} />
              Add New Item
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-100">
            <h3 className="font-semibold text-lg text-gray-800">Live Preview</h3>
            <p className="text-xs text-gray-500 mt-1">How it appears on the website</p>
          </div>
          
          <div className="p-6">
            {items.filter(item => item.trim() !== "").length > 0 ? (
              <div>
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Restful Essentials</h4>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item, idx) => 
                    item && item.trim() !== "" && (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-300 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400">No items to preview</p>
                <p className="text-sm text-gray-400 mt-1">Add items using the editor panel</p>
              </div>
            )}
          </div>

          {items.filter(item => item.trim() !== "").length > 0 && (
            <div className="border-t border-gray-200 bg-gray-100 p-4">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Live website preview - {items.filter(item => item.trim() !== "").length} items
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About this section:</p>
            <p className="text-blue-700">This manages the "Restful Essentials" list shown in the wedding room blocks section. Items appear exactly as entered above. Empty items will be automatically removed when saving.</p>
          </div>
        </div>
      </div>
    </div>
  );
}