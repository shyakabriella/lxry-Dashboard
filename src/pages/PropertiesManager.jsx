import { useEffect, useState } from "react";
import {
  loadSiteData,
  saveSiteData,
} from "../data/store";
import {
  Plus,
  X,
  Save,
  Trash2,
  Star,
  DollarSign,
  Users,
  Building2,
} from "lucide-react";

const emptyProperty = {
  id: "",
  name: "",
  type: "Indoor Venue",
  description: "",
  shortDescription: "",
  price: "",
  capacity: "",
  size: "",
  imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
  amenities: [],
  featured: false,
  gallery: [],
};

const venueTypes = ["Indoor Venue", "Outdoor Venue", "Rooftop Venue", "Garden Venue", "Poolside Venue"];

export default function PropertiesManager() {
  const [data, setData] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editedProperty, setEditedProperty] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  useEffect(() => {
    setData(loadSiteData());
  }, []);

  const selectProperty = (prop) => {
    if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
    setSelectedProperty(prop);
    setEditedProperty({ ...prop });
    setIsCreating(false);
    setHasChanges(false);
  };

  const startCreating = () => {
    if (hasChanges && !confirm("You have unsaved changes. Discard them?")) return;
    const newProp = { ...emptyProperty, id: "prop-" + Date.now() };
    setSelectedProperty(newProp);
    setEditedProperty(newProp);
    setIsCreating(true);
    setHasChanges(false);
  };

  const updateField = (field, value) => {
    if (!editedProperty) return;
    setEditedProperty({ ...editedProperty, [field]: value });
    setHasChanges(true);
  };

  const addAmenity = () => {
    if (!editedProperty || !newAmenity.trim()) return;
    updateField("amenities", [...editedProperty.amenities, newAmenity.trim()]);
    setNewAmenity("");
  };

  const removeAmenity = (index) => {
    if (!editedProperty) return;
    const updated = editedProperty.amenities.filter((_, i) => i !== index);
    updateField("amenities", updated);
  };

  const addGalleryImage = () => {
    if (!editedProperty || !newGalleryUrl.trim()) return;
    updateField("gallery", [...editedProperty.gallery, newGalleryUrl.trim()]);
    setNewGalleryUrl("");
  };

  const removeGalleryImage = (index) => {
    if (!editedProperty) return;
    const updated = editedProperty.gallery.filter((_, i) => i !== index);
    updateField("gallery", updated);
  };

  const handleSave = () => {
    if (!data || !editedProperty) return;

    let updatedProperties;
    if (isCreating) {
      updatedProperties = [...data.property, editedProperty];
    } else {
      updatedProperties = data.property.map((p) =>
        p.id === editedProperty.id ? editedProperty : p
      );
    }

    const updated = { ...data, property: updatedProperties };
    saveSiteData(updated);
    setData(updated);
    setSelectedProperty(editedProperty);
    setIsCreating(false);
    setHasChanges(false);
  };

  const handleDelete = () => {
    if (!data || !editedProperty || isCreating) return;
    if (!confirm(`Delete "${editedProperty.name}"? This cannot be undone.`)) return;

    const updatedProperties = data.properties.filter((p) => p.id !== editedProperty.id);
    const updated = { ...data, property: updatedProperties };
    saveSiteData(updated);
    setData(updated);
    setSelectedProperty(null);
    setEditedProperty(null);
    setHasChanges(false);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Property</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage venue spaces — click a card to edit its content
          </p>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all active:scale-[0.98]"
        >
          <Plus size={16} />
          Add Property
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Property cards list */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Click a card to edit
          </p>
          {data.property.map((prop) => (
            <button
              key={prop.id}
              onClick={() => selectProperty(prop)}
              className={`w-full text-left rounded-xl border transition-all overflow-hidden ${
                selectedProperty?.id === prop.id
                  ? "border-amber-400 shadow-md ring-2 ring-amber-100"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex gap-3 p-3">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={prop.imageUrl}
                    alt={prop.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{prop.name}</p>
                    {prop.featured && (
                      <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{prop.type}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {prop.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={11} /> {prop.price}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Property editor panel */}
        <div className="lg:col-span-2">
          {editedProperty ? (
            <div className="space-y-5">
              {/* Editor header */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <Building2 size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {isCreating ? "New Property" : editedProperty.name || "Untitled"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isCreating ? "Fill in the details below" : "Edit property details"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isCreating && (
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all ${
                      hasChanges
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98]"
                        : "cursor-not-allowed bg-slate-300"
                    }`}
                  >
                    <Save size={14} />
                    {isCreating ? "Create" : "Save"}
                  </button>
                </div>
              </div>

              {/* Editor form */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
                {/* Image preview */}
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={editedProperty.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800";
                    }}
                  />
                </div>

                {/* Basic fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                    <input
                      type="text"
                      value={editedProperty.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Property name"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                    <select
                      value={editedProperty.type}
                      onChange={(e) => updateField("type", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    >
                      {venueTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
                    <input
                      type="text"
                      value={editedProperty.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      placeholder="e.g. From $5,000"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Capacity</label>
                    <input
                      type="text"
                      value={editedProperty.capacity}
                      onChange={(e) => updateField("capacity", e.target.value)}
                      placeholder="e.g. 500 guests"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Size</label>
                    <input
                      type="text"
                      value={editedProperty.size}
                      onChange={(e) => updateField("size", e.target.value)}
                      placeholder="e.g. 6,000 sq ft"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Main Image URL
                    </label>
                    <input
                      type="url"
                      value={editedProperty.imageUrl}
                      onChange={(e) => updateField("imageUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Short Description
                    </label>
                    <textarea
                      value={editedProperty.shortDescription}
                      onChange={(e) => updateField("shortDescription", e.target.value)}
                      rows={2}
                      placeholder="Brief one-liner for the card..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm resize-y focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Full Description
                    </label>
                    <textarea
                      value={editedProperty.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      rows={5}
                      placeholder="Detailed description..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm resize-y focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editedProperty.featured}
                    onChange={(e) => updateField("featured", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                    Featured property (shown prominently on homepage)
                  </label>
                </div>

                {/* Amenities */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editedProperty.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200"
                      >
                        {amenity}
                        <button
                          onClick={() => removeAmenity(i)}
                          className="ml-0.5 text-amber-400 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                      placeholder="Add amenity..."
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                    <button
                      onClick={addAmenity}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gallery Images
                  </label>
                  {editedProperty.gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {editedProperty.gallery.map((url, i) => (
                        <div key={i} className="group relative aspect-video overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={url}
                            alt={`Gallery ${i + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300";
                            }}
                          />
                          <button
                            onClick={() => removeGalleryImage(i)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryImage())}
                      placeholder="Add image URL..."
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                    <button
                      onClick={addGalleryImage}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20">
              <div className="text-center">
                <Building2 size={40} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Select a property card to edit
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  or create a new one with the button above
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
