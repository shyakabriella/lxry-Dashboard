import { useState } from "react";
import {
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

export default function LocationSectionManager() {
  const [sectionData, setSectionData] = useState({
    title: "Location",
    subtitle: "Our venues",
    description: "Our stunning venue sets the scene for exceptional wedding celebrations with elegant gardens and luxurious facilities. We invite you to explore our ceremony spaces, reception halls, bridal suites, cocktail terraces, and so much more.",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop",
    features: [
      "Elegant gardens",
      "Luxurious facilities",
      "Ceremony spaces",
      "Reception halls",
      "Bridal suites",
      "Cocktail terraces"
    ]
  });
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = (field, value) => {
    setSectionData({ ...sectionData, [field]: value });
    setHasChanges(true);
    setSaved(false);
  };

  const addFeature = () => {
    const newFeatures = [...(sectionData.features || []), ""];
    updateField("features", newFeatures);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...(sectionData.features || [])];
    newFeatures[index] = value;
    updateField("features", newFeatures);
  };

  const removeFeature = (index) => {
    const newFeatures = [...(sectionData.features || [])];
    newFeatures.splice(index, 1);
    updateField("features", newFeatures);
  };

  const handleSave = () => {
    localStorage.setItem("wedding_location", JSON.stringify(sectionData));
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSectionData({
      title: "Location",
      subtitle: "Our venues",
      description: "Our stunning venue sets the scene for exceptional wedding celebrations with elegant gardens and luxurious facilities.",
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop",
      features: [
        "Elegant gardens",
        "Luxurious facilities",
        "Ceremony spaces",
        "Reception halls",
        "Bridal suites",
        "Cocktail terraces"
      ]
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Location Section</h2>
          <p className="text-sm text-gray-500">Edit the content for this section</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-3 py-2 border rounded-lg flex items-center gap-2">
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={handleSave} disabled={!hasChanges} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${hasChanges ? "bg-amber-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}>
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} /> Saved successfully!
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-6 rounded-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={sectionData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full border rounded-lg p-2.5"
              placeholder="Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              value={sectionData.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="w-full border rounded-lg p-2.5"
              placeholder="Subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={sectionData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full border rounded-lg p-2.5"
              rows={4}
              placeholder="Description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              value={sectionData.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              className="w-full border rounded-lg p-2.5"
              placeholder="Image URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            {sectionData.features?.map((feature, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={feature}
                  onChange={(e) => updateFeature(idx, e.target.value)}
                  className="flex-1 border rounded-lg p-2"
                  placeholder={`Feature ${idx + 1}`}
                />
                <button onClick={() => removeFeature(idx)} className="px-3 bg-red-500 text-white rounded">×</button>
              </div>
            ))}
            <button onClick={addFeature} className="text-sm text-amber-600 flex items-center gap-1">
              <Plus size={14} /> Add Feature
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Preview</h3>
          {sectionData.imageUrl && <img src={sectionData.imageUrl} className="rounded-lg mb-3 w-full" alt="Preview" />}
          <h2 className="font-bold text-xl">{sectionData.title}</h2>
          <p className="text-amber-600 text-sm">{sectionData.subtitle}</p>
          <p className="text-gray-600 text-sm mt-2">{sectionData.description}</p>
          <ul className="mt-3 space-y-1">
            {sectionData.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-amber-500">•</span> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}