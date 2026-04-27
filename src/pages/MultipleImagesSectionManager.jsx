import { useState } from "react";
import {
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

export default function MultipleImagesSectionManager() {
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
  ]);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const addImage = () => {
    setImages([...images, ""]);
    setHasChanges(true);
  };

  const updateImage = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
    setHasChanges(true);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("wedding_multiple_images", JSON.stringify(images));
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setImages([
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
    ]);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Multiple Images Gallery</h2>
          <p className="text-sm text-gray-500">Manage your wedding gallery images (no text, only images)</p>
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
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          {images.map((img, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={img}
                onChange={(e) => updateImage(idx, e.target.value)}
                className="flex-1 border rounded-lg p-2.5"
                placeholder={`Image ${idx + 1} URL`}
              />
              <button onClick={() => removeImage(idx)} className="px-3 bg-red-500 text-white rounded-lg">×</button>
            </div>
          ))}
          <button onClick={addImage} className="text-sm text-amber-600 flex items-center gap-1 mt-2">
            <Plus size={14} /> Add Image
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Preview</h3>
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, idx) => (
              img && <img key={idx} src={img} className="rounded-lg w-full h-32 object-cover" alt={`Preview ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}