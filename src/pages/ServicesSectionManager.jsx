import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

export default function ServicesSectionManager() {
  const [services, setServices] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchServices();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/wedding/services`);
      const result = await response.json();
      console.log("Fetched services:", result);
      
      if (result.success) {
        setServices(result.data || []);
      } else {
        setError(result.message || "Failed to load services");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setIsAdding(true);
    setNewServiceName("");
    setError(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewServiceName("");
  };

  const handleSaveNewService = async () => {
    if (!newServiceName.trim()) {
      setError("Service name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/wedding/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ service_name: newServiceName.trim() })
      });
      
      const result = await response.json();
      console.log("Add service response:", result);
      
      if (result.success) {
        setIsAdding(false);
        setNewServiceName("");
        await fetchServices();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(result.message || "Error adding service");
        if (result.errors) {
          setError(Object.values(result.errors).flat().join(", "));
        }
      }
    } catch (err) {
      console.error("Error adding service:", err);
      setError("Network error: " + err.message);
    }
  };

  const handleEditService = (index, service) => {
    setEditingIndex(index);
    setEditValue(service.service_name);
    setEditId(service.id);
    setIsAdding(false);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      setError("Service name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/wedding/services/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ service_name: editValue.trim() })
      });
      
      const result = await response.json();
      console.log("Update service response:", result);
      
      if (result.success) {
        await fetchServices();
        setEditingIndex(null);
        setEditValue("");
        setEditId(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(result.message || "Error updating service");
      }
    } catch (err) {
      console.error("Error updating service:", err);
      setError("Network error: " + err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Delete this service?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/wedding/services/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      console.log("Delete service response:", result);
      
      if (result.success) {
        await fetchServices();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        if (editingIndex !== null) {
          setEditingIndex(null);
          setEditValue("");
          setEditId(null);
        }
      } else {
        setError(result.message || "Error deleting service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      setError("Network error: " + err.message);
    }
  };

  const handleReset = () => {
    fetchServices();
    setEditingIndex(null);
    setEditValue("");
    setEditId(null);
    setIsAdding(false);
    setNewServiceName("");
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
          <p className="text-gray-500 mt-2">Please login to manage services</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Services Section</h2>
          <p className="text-sm text-gray-500">Manage your wedding services list</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-3 py-2 border rounded-lg flex items-center gap-2">
            <RotateCcw size={15} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> Saved successfully!
        </div>
      )}

      <div className="space-y-2">
        {services.length === 0 && !isAdding && (
          <div className="text-center py-10 text-gray-500">No services yet. Click "Add New Service" to create one.</div>
        )}
        
        {/* Add New Service Form */}
        {isAdding && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex gap-2">
              <input
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="Enter service name"
                className="flex-1 border rounded-lg p-2"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveNewService();
                  }
                }}
              />
              <button onClick={handleSaveNewService} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Save
              </button>
              <button onClick={handleCancelAdd} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Services List */}
        {services.map((service, idx) => (
          <div key={service.id} className="border rounded-lg p-3 flex items-center justify-between">
            {editingIndex === idx ? (
              <div className="flex-1 flex gap-2">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 border rounded-lg p-2"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEdit();
                    }
                  }}
                />
                <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                <button onClick={() => setEditingIndex(null)} className="px-3 py-1 border rounded">Cancel</button>
              </div>
            ) : (
              <>
                <span className="text-gray-700">{service.service_name}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEditService(idx, service)} className="px-3 py-1 border rounded hover:bg-gray-50">Edit</button>
                  <button onClick={() => handleDeleteService(service.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {/* Add New Service Button */}
        {!isAdding && (
          <button 
            onClick={handleAddService} 
            className="mt-2 text-sm text-amber-600 flex items-center gap-1 hover:text-amber-700"
          >
            <Plus size={14} /> Add New Service
          </button>
        )}
      </div>
    </div>
  );
}