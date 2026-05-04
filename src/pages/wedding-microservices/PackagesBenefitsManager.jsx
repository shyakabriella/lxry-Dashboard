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
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
};

export default function PackagesBenefitsManager() {
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
      const result = await apiRequest("/wedding-packages/section4", "GET");
      console.log("Fetched benefits data:", result);
      
      if (result.success && result.data) {
        setItems(result.data.items || []);
        setSectionId(result.data.id);
        setHasChanges(false);
      } else {
        console.log("No benefits data found, using defaults");
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, ""]);
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const saveSection = async () => {
    const filteredItems = items.filter(item => item && item.trim() !== "");
    
    if (filteredItems.length === 0) {
      setError("Please add at least one benefit");
      return;
    }

    const submitData = { items: filteredItems };
    
    setSaving(true);
    try {
      let result;
      if (sectionId) {
        result = await apiRequest(`/admin/wedding-packages/section4/${sectionId}`, "PUT", submitData, token);
      } else {
        result = await apiRequest("/admin/wedding-packages/section4", "POST", submitData, token);
      }

      console.log("Save response:", result);

      if (result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchSectionData();
      } else {
        setError(result.message || "Error saving benefits");
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          setError(errorMessages);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save benefits. Please check your connection.");
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
          <h2 className="text-xl font-bold">Included Benefits</h2>
          <p className="text-sm text-gray-500">Manage the list of included benefits</p>
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
          <Check size={16} /> Benefits saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
          <label className="block text-sm font-medium mb-2">Benefits List</label>
          
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
                className="flex-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder={`Benefit ${idx + 1}`}
              />
              <button 
                onClick={() => removeItem(idx)} 
                className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          <button 
            onClick={addItem} 
            className="text-sm text-amber-600 flex items-center gap-1 hover:text-amber-700 transition"
          >
            <Plus size={14} /> Add Benefit
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Add, edit, or remove benefits from the list. Empty items will be ignored when saving.
          </p>
        </div>

        {/* Right - Live Preview */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Benefits Preview</h3>
          
          {items.length > 0 && items.some(item => item && item.trim() !== "") ? (
            <ul className="space-y-2">
              {items.map((item, idx) => (
                item && item.trim() !== "" && (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                )
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>No benefits added yet</p>
              <p className="text-xs mt-1">Click "Add Benefit" to create your list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}