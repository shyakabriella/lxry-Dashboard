import { useEffect, useState } from "react";
import {
  loadSiteData,
  saveSiteData,
} from "../data/store";
import { Plus, Save, Trash2, MessageSquare } from "lucide-react";

const emptyTestimonial = {
  id: "",
  name: "",
  role: "",
  content: "",
  avatar: "",
  rating: 5,
};

export default function TestimonialsManager() {
  const [data, setData] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyTestimonial);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const siteData = loadSiteData();
    setData(siteData);
    setTestimonials(siteData.testimonials);
  }, []);

  const saveAll = (updated) => {
    if (!data) return;
    const newData = { ...data, testimonials: updated };
    saveSiteData(newData);
    setData(newData);
    setTestimonials(updated);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditForm({ ...t });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditForm({ ...emptyTestimonial, id: "test-" + Date.now() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setEditForm(emptyTestimonial);
  };

  const saveEdit = () => {
    if (isCreating) {
      const updated = [...testimonials, editForm];
      saveAll(updated);
    } else if (editingId) {
      const updated = testimonials.map((t) => (t.id === editingId ? editForm : t));
      saveAll(updated);
    }
    cancelEdit();
  };

  const deleteTestimonial = (id) => {
    if (!confirm("Delete this testimonial?")) return;
    const updated = testimonials.filter((t) => t.id !== id);
    saveAll(updated);
    if (editingId === id) cancelEdit();
  };

  const updateField = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const isEditing = editingId !== null || isCreating;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage customer reviews displayed on your homepage
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all active:scale-[0.98]"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Testimonials list */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {testimonials.length} testimonials
          </p>
          {testimonials.map((t) => (
            <button
              key={t.id}
              onClick={() => startEdit(t)}
              className={`w-full text-left rounded-xl border transition-all p-4 ${
                editingId === t.id
                  ? "border-amber-400 shadow-md ring-2 ring-amber-100 bg-white"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= t.rating ? "text-amber-400" : "text-slate-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{t.content}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Edit panel */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="space-y-5">
              {/* Editor header */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <MessageSquare size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {isCreating ? "New Testimonial" : "Edit Testimonial"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isCreating ? "Add a customer review" : `Editing: ${editForm.name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelEdit}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white hover:from-amber-600 hover:to-amber-700 transition-all active:scale-[0.98]"
                  >
                    <Save size={14} />
                    {isCreating ? "Create" : "Save"}
                  </button>
                </div>
              </div>

              {/* Edit form */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. Grace & Emmanuel"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Role / Event
                    </label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      placeholder="e.g. Wedding - June 2024"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateField("rating", star)}
                        className="transition-transform hover:scale-110"
                      >
                        <svg
                          className={`h-7 w-7 ${
                            star <= editForm.rating ? "text-amber-400" : "text-slate-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-slate-500">
                      {editForm.rating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Testimonial Content
                  </label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    rows={5}
                    placeholder="What did the customer say..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm resize-y focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Preview */}
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-amber-50/50 to-white p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-amber-600 mb-3">
                    Preview
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${
                          star <= editForm.rating ? "text-amber-400" : "text-slate-200"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{editForm.content || "Testimonial content will appear here..."}"
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700">
                      {editForm.name ? editForm.name.charAt(0) : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {editForm.name || "Customer Name"}
                      </p>
                      <p className="text-xs text-slate-500">{editForm.role || "Role / Event"}</p>
                    </div>
                  </div>
                </div>

                {/* Delete button for existing */}
                {!isCreating && editingId && (
                  <button
                    onClick={() => deleteTestimonial(editingId)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Testimonial
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Select a testimonial to edit
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
