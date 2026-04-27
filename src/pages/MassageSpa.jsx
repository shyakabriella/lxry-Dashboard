import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Edit3,
  Image,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const emptyPageForm = {
  hero_title: "",
  hero_subtitle: "",
  hero_image: "",
  heroImageFile: null,
  heroImagePreview: "",

  intro_eyebrow: "",
  intro_title: "",
  intro_description: "",

  experience_title: "",
  experience_description: "",
  experience_image: "",
  experienceImageFile: null,
  experienceImagePreview: "",

  is_active: true,
};

const emptyItemForm = {
  id: null,
  section: "spa_service",
  title: "",
  description: "",
  image: "",
  imageFile: null,
  imagePreview: "",
  sort_order: 0,
  is_active: true,
};

const emptyBenefitForm = {
  id: null,
  title: "",
  sort_order: 0,
  is_active: true,
};

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("auth_token");
}

function buildImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("blob:")) return path;
  if (path.startsWith("/storage/")) return `${API_ROOT_URL}${path}`;
  if (path.startsWith("storage/")) return `${API_ROOT_URL}/${path}`;

  return `${API_ROOT_URL}/storage/${path}`;
}

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function getErrorMessage(data, fields, fallback) {
  for (const field of fields) {
    const message = data?.errors?.[field]?.[0];
    if (message) return message;
  }

  return data?.message || fallback;
}

export default function MassageSpa() {
  const [activeTab, setActiveTab] = useState("page");

  const [pageForm, setPageForm] = useState(emptyPageForm);
  const [items, setItems] = useState([]);
  const [benefits, setBenefits] = useState([]);

  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [benefitForm, setBenefitForm] = useState(emptyBenefitForm);

  const [showItemForm, setShowItemForm] = useState(false);
  const [showBenefitForm, setShowBenefitForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [savingBenefit, setSavingBenefit] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const spaServices = useMemo(() => {
    return items.filter((item) => item.section === "spa_service");
  }, [items]);

  const wellnessEnhancements = useMemo(() => {
    return items.filter((item) => item.section === "wellness_enhancement");
  }, [items]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 2500);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/admin/massage-spa`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load Massage & Spa data.");
      }

      const page = data?.data?.page || null;
      const apiItems = data?.data?.items || [];
      const apiBenefits = data?.data?.benefits || [];

      if (page) {
        setPageForm({
          hero_title: page.hero_title || "",
          hero_subtitle: page.hero_subtitle || "",
          hero_image: page.hero_image || "",
          heroImageFile: null,
          heroImagePreview: buildImageUrl(page.hero_image || ""),

          intro_eyebrow: page.intro_eyebrow || "",
          intro_title: page.intro_title || "",
          intro_description: page.intro_description || "",

          experience_title: page.experience_title || "",
          experience_description: page.experience_description || "",
          experience_image: page.experience_image || "",
          experienceImageFile: null,
          experienceImagePreview: buildImageUrl(page.experience_image || ""),

          is_active: toBoolean(page.is_active),
        });
      } else {
        setPageForm(emptyPageForm);
      }

      setItems(
        apiItems.map((item) => ({
          ...item,
          imagePreview: buildImageUrl(item.image || ""),
          is_active: toBoolean(item.is_active),
        }))
      );

      setBenefits(
        apiBenefits.map((benefit) => ({
          ...benefit,
          is_active: toBoolean(benefit.is_active),
        }))
      );
    } catch (err) {
      setError(err.message || "Something went wrong while loading data.");
    } finally {
      setLoading(false);
    }
  };

  const updatePageField = (field, value) => {
    setPageForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePageImageChange = (field, previewField, fileField, e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPageForm((prev) => ({
      ...prev,
      [field]: "",
      [fileField]: file,
      [previewField]: URL.createObjectURL(file),
    }));
  };

  const savePage = async () => {
    try {
      setSavingPage(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const formData = new FormData();

      formData.append("hero_title", pageForm.hero_title || "");
      formData.append("hero_subtitle", pageForm.hero_subtitle || "");

      formData.append("intro_eyebrow", pageForm.intro_eyebrow || "");
      formData.append("intro_title", pageForm.intro_title || "");
      formData.append("intro_description", pageForm.intro_description || "");

      formData.append("experience_title", pageForm.experience_title || "");
      formData.append(
        "experience_description",
        pageForm.experience_description || ""
      );

      formData.append("is_active", pageForm.is_active ? "1" : "0");

      if (pageForm.heroImageFile) {
        formData.append("hero_image", pageForm.heroImageFile);
      }

      if (pageForm.experienceImageFile) {
        formData.append("experience_image", pageForm.experienceImageFile);
      }

      const response = await fetch(`${API_BASE_URL}/admin/massage-spa/page`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          [
            "hero_title",
            "hero_subtitle",
            "hero_image",
            "intro_eyebrow",
            "intro_title",
            "intro_description",
            "experience_title",
            "experience_description",
            "experience_image",
            "is_active",
          ],
          "Failed to save Massage & Spa page."
        );

        throw new Error(message);
      }

      await fetchAdminData();
      showSuccess("Massage & Spa page saved successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while saving page.");
    } finally {
      setSavingPage(false);
    }
  };

  const openNewItemForm = (section = "spa_service") => {
    setItemForm({
      ...emptyItemForm,
      section,
    });

    setShowItemForm(true);
    setActiveTab("items");
    setError("");
  };

  const editItem = (item) => {
    setItemForm({
      id: item.id,
      section: item.section || "spa_service",
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
      imageFile: null,
      imagePreview: buildImageUrl(item.image || ""),
      sort_order: item.sort_order ?? 0,
      is_active: toBoolean(item.is_active),
    });

    setShowItemForm(true);
    setActiveTab("items");
    setError("");
  };

  const updateItemField = (field, value) => {
    setItemForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setItemForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const saveItem = async () => {
    try {
      setSavingItem(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const isUpdate = Boolean(itemForm.id);

      if (!itemForm.imageFile && !isUpdate) {
        throw new Error("Please upload item image first.");
      }

      const url = isUpdate
        ? `${API_BASE_URL}/admin/massage-spa/items/${itemForm.id}`
        : `${API_BASE_URL}/admin/massage-spa/items`;

      const formData = new FormData();

      formData.append("section", itemForm.section);
      formData.append("title", itemForm.title);
      formData.append("description", itemForm.description || "");
      formData.append("sort_order", itemForm.sort_order || 0);
      formData.append("is_active", itemForm.is_active ? "1" : "0");

      if (itemForm.imageFile) {
        formData.append("image", itemForm.imageFile);
      }

      if (isUpdate) {
        formData.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          ["section", "title", "description", "image", "sort_order", "is_active"],
          "Failed to save Massage & Spa item."
        );

        throw new Error(message);
      }

      setItemForm(emptyItemForm);
      setShowItemForm(false);

      await fetchAdminData();
      showSuccess(isUpdate ? "Item updated successfully." : "Item created successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while saving item.");
    } finally {
      setSavingItem(false);
    }
  };

  const deleteItem = async (item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/massage-spa/items/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete item.");
      }

      await fetchAdminData();
      showSuccess("Item deleted successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while deleting item.");
    }
  };

  const openNewBenefitForm = () => {
    setBenefitForm(emptyBenefitForm);
    setShowBenefitForm(true);
    setActiveTab("benefits");
    setError("");
  };

  const editBenefit = (benefit) => {
    setBenefitForm({
      id: benefit.id,
      title: benefit.title || "",
      sort_order: benefit.sort_order ?? 0,
      is_active: toBoolean(benefit.is_active),
    });

    setShowBenefitForm(true);
    setActiveTab("benefits");
    setError("");
  };

  const updateBenefitField = (field, value) => {
    setBenefitForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveBenefit = async () => {
    try {
      setSavingBenefit(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const isUpdate = Boolean(benefitForm.id);

      const url = isUpdate
        ? `${API_BASE_URL}/admin/massage-spa/benefits/${benefitForm.id}`
        : `${API_BASE_URL}/admin/massage-spa/benefits`;

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: benefitForm.title,
          sort_order: benefitForm.sort_order || 0,
          is_active: benefitForm.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          ["title", "sort_order", "is_active"],
          "Failed to save benefit."
        );

        throw new Error(message);
      }

      setBenefitForm(emptyBenefitForm);
      setShowBenefitForm(false);

      await fetchAdminData();
      showSuccess(
        isUpdate
          ? "Benefit updated successfully."
          : "Benefit created successfully."
      );
    } catch (err) {
      setError(err.message || "Something went wrong while saving benefit.");
    } finally {
      setSavingBenefit(false);
    }
  };

  const deleteBenefit = async (benefit) => {
    if (!confirm(`Delete "${benefit.title}"?`)) return;

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/massage-spa/benefits/${benefit.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete benefit.");
      }

      await fetchAdminData();
      showSuccess("Benefit deleted successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while deleting benefit.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          <Loader2 size={18} className="animate-spin text-amber-500" />
          Loading Massage & Spa data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/30">
              <Sparkles size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Massage & Spa Content
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage hero, intro, spa services, wellness enhancements, and benefits.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <Check size={17} />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* TABS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="grid gap-2 md:grid-cols-3">
          <TabButton
            active={activeTab === "page"}
            onClick={() => setActiveTab("page")}
            label="Main Page"
          />

          <TabButton
            active={activeTab === "items"}
            onClick={() => setActiveTab("items")}
            label="Services & Wellness"
          />

          <TabButton
            active={activeTab === "benefits"}
            onClick={() => setActiveTab("benefits")}
            label="Benefits"
          />
        </div>
      </div>

      {activeTab === "page" && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <Panel title="Hero Section">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Hero Title">
                  <input
                    value={pageForm.hero_title}
                    onChange={(e) =>
                      updatePageField("hero_title", e.target.value)
                    }
                    placeholder="Spa & Wellness"
                    className="form-input"
                  />
                </Field>

                <Field label="Hero Subtitle">
                  <input
                    value={pageForm.hero_subtitle}
                    onChange={(e) =>
                      updatePageField("hero_subtitle", e.target.value)
                    }
                    placeholder="Luxury Spa Experience in Kigali"
                    className="form-input"
                  />
                </Field>
              </div>

              <ImageUpload
                label="Hero Image"
                preview={pageForm.heroImagePreview}
                onChange={(e) =>
                  handlePageImageChange(
                    "hero_image",
                    "heroImagePreview",
                    "heroImageFile",
                    e
                  )
                }
              />
            </Panel>

            <Panel title="Intro Section">
              <Field label="Intro Eyebrow">
                <input
                  value={pageForm.intro_eyebrow}
                  onChange={(e) =>
                    updatePageField("intro_eyebrow", e.target.value)
                  }
                  placeholder="Luxury Spa Experience in Kigali, Rwanda"
                  className="form-input"
                />
              </Field>

              <Field label="Intro Title">
                <input
                  value={pageForm.intro_title}
                  onChange={(e) =>
                    updatePageField("intro_title", e.target.value)
                  }
                  placeholder="Relaxation & Rejuvenation"
                  className="form-input"
                />
              </Field>

              <Field label="Intro Description">
                <textarea
                  value={pageForm.intro_description}
                  onChange={(e) =>
                    updatePageField("intro_description", e.target.value)
                  }
                  rows={4}
                  placeholder="Write intro description..."
                  className="form-input resize-y"
                />
              </Field>
            </Panel>

            <Panel title="Complete Wellness Experience">
              <Field label="Experience Title">
                <input
                  value={pageForm.experience_title}
                  onChange={(e) =>
                    updatePageField("experience_title", e.target.value)
                  }
                  placeholder="Complete Wellness Experience"
                  className="form-input"
                />
              </Field>

              <Field label="Experience Description">
                <textarea
                  value={pageForm.experience_description}
                  onChange={(e) =>
                    updatePageField("experience_description", e.target.value)
                  }
                  rows={4}
                  placeholder="Write experience description..."
                  className="form-input resize-y"
                />
              </Field>

              <ImageUpload
                label="Experience Image"
                preview={pageForm.experienceImagePreview}
                onChange={(e) =>
                  handlePageImageChange(
                    "experience_image",
                    "experienceImagePreview",
                    "experienceImageFile",
                    e
                  )
                }
              />
            </Panel>

            <Panel title="Status">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-700">
                  Active Page
                </span>

                <input
                  type="checkbox"
                  checked={pageForm.is_active}
                  onChange={(e) =>
                    updatePageField("is_active", e.target.checked)
                  }
                  className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
              </label>

              <button
                type="button"
                onClick={savePage}
                disabled={savingPage}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingPage ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}

                {savingPage ? "Saving..." : "Save Page Content"}
              </button>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="Live Preview">
              <PreviewCard
                image={pageForm.heroImagePreview}
                eyebrow={pageForm.hero_subtitle}
                title={pageForm.hero_title || "Spa & Wellness"}
                description="Hero section preview"
              />

              <PreviewCard
                image={pageForm.experienceImagePreview}
                eyebrow={pageForm.intro_eyebrow}
                title={pageForm.intro_title || "Relaxation & Rejuvenation"}
                description={pageForm.intro_description}
              />
            </Panel>
          </div>
        </div>
      )}

      {activeTab === "items" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Spa Services & Wellness Enhancements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create cards shown under Spa Services and Wellness Enhancements.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openNewItemForm("spa_service")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
              >
                <Plus size={16} />
                Spa Service
              </button>

              <button
                type="button"
                onClick={() => openNewItemForm("wellness_enhancement")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus size={16} />
                Wellness
              </button>
            </div>
          </div>

          {showItemForm && (
            <Panel title={itemForm.id ? "Edit Item" : "Create Item"}>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                  <Field label="Section">
                    <select
                      value={itemForm.section}
                      onChange={(e) =>
                        updateItemField("section", e.target.value)
                      }
                      className="form-input"
                    >
                      <option value="spa_service">Spa Service</option>
                      <option value="wellness_enhancement">
                        Wellness Enhancement
                      </option>
                    </select>
                  </Field>

                  <Field label="Title">
                    <input
                      value={itemForm.title}
                      onChange={(e) =>
                        updateItemField("title", e.target.value)
                      }
                      placeholder="Example: Custom Massage Treatments"
                      className="form-input"
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      value={itemForm.description}
                      onChange={(e) =>
                        updateItemField("description", e.target.value)
                      }
                      rows={4}
                      placeholder="Write description..."
                      className="form-input resize-y"
                    />
                  </Field>

                  <Field label="Sort Order">
                    <input
                      type="number"
                      value={itemForm.sort_order}
                      onChange={(e) =>
                        updateItemField("sort_order", e.target.value)
                      }
                      className="form-input"
                    />
                  </Field>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-700">
                      Active Item
                    </span>

                    <input
                      type="checkbox"
                      checked={itemForm.is_active}
                      onChange={(e) =>
                        updateItemField("is_active", e.target.checked)
                      }
                      className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={saveItem}
                      disabled={savingItem}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingItem ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}

                      {savingItem ? "Saving..." : "Save Item"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowItemForm(false);
                        setItemForm(emptyItemForm);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>

                <ImageUpload
                  label="Item Image"
                  preview={itemForm.imagePreview}
                  onChange={handleItemImageChange}
                />
              </div>
            </Panel>
          )}

          <ItemSection
            title="Spa Services"
            items={spaServices}
            onEdit={editItem}
            onDelete={deleteItem}
          />

          <ItemSection
            title="Wellness Enhancements"
            items={wellnessEnhancements}
            onEdit={editItem}
            onDelete={deleteItem}
          />
        </div>
      )}

      {activeTab === "benefits" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Spa Benefits
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage benefit bullet points shown at the bottom of the page.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewBenefitForm}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              <Plus size={16} />
              Benefit
            </button>
          </div>

          {showBenefitForm && (
            <Panel title={benefitForm.id ? "Edit Benefit" : "Create Benefit"}>
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_160px]">
                <Field label="Benefit Title">
                  <input
                    value={benefitForm.title}
                    onChange={(e) =>
                      updateBenefitField("title", e.target.value)
                    }
                    placeholder="Example: Professional Massage Therapists"
                    className="form-input"
                  />
                </Field>

                <Field label="Sort Order">
                  <input
                    type="number"
                    value={benefitForm.sort_order}
                    onChange={(e) =>
                      updateBenefitField("sort_order", e.target.value)
                    }
                    className="form-input"
                  />
                </Field>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Active
                  </span>

                  <input
                    type="checkbox"
                    checked={benefitForm.is_active}
                    onChange={(e) =>
                      updateBenefitField("is_active", e.target.checked)
                    }
                    className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveBenefit}
                  disabled={savingBenefit}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingBenefit ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {savingBenefit ? "Saving..." : "Save Benefit"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowBenefitForm(false);
                    setBenefitForm(emptyBenefitForm);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </Panel>
          )}

          <Panel title="Saved Benefits">
            {benefits.length === 0 ? (
              <EmptyBox label="No benefits saved yet." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {benefit.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Order: {benefit.sort_order ?? 0}
                        </p>
                      </div>

                      <StatusBadge active={toBoolean(benefit.is_active)} />
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => editBenefit(benefit)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Edit3 size={13} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteBenefit(benefit)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      <style>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition: all 0.15s ease;
        }

        .form-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

function ImageUpload({ label, preview, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-amber-400 hover:bg-amber-50/40">
        <Upload size={26} className="mb-2 text-amber-500" />

        <span className="text-sm font-semibold text-slate-700">
          Upload image
        </span>

        <span className="mt-1 text-xs text-slate-400">
          JPG, PNG, WEBP
        </span>

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={onChange}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <img
            src={preview}
            alt="Preview"
            className="h-52 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

function PreviewCard({ image, eyebrow, title, description }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      {image ? (
        <div className="aspect-video bg-slate-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm text-slate-400">
          No image
        </div>
      )}

      <div className="space-y-2 p-4">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            {eyebrow}
          </p>
        )}

        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        {description && (
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function ItemSection({ title, items, onEdit, onDelete }) {
  return (
    <Panel title={title}>
      {items.length === 0 ? (
        <EmptyBox label={`No ${title.toLowerCase()} saved yet.`} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-video bg-slate-100">
                {item.imagePreview ? (
                  <img
                    src={item.imagePreview}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Order: {item.sort_order ?? 0}
                    </p>
                  </div>

                  <StatusBadge active={toBoolean(item.is_active)} />
                </div>

                {item.description && (
                  <p className="line-clamp-3 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Edit3 size={13} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function EmptyBox({ label }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
      {label}
    </div>
  );
}