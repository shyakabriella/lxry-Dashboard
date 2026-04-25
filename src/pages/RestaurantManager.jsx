import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Edit3,
  Image,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  UtensilsCrossed,
  Wine,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const emptyCategoryForm = {
  id: null,
  name: "",
  type: "restaurant",
  is_active: true,
};

const emptyItemForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  sort_order: 0,
  category: "",
  category_id: null,
  tab: "restaurant",
  image: "",
  imageFile: null,
  imagePreview: "",
  is_active: true,
};

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("auth_token");
}

function buildImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("blob:")) {
    return path;
  }

  if (path.startsWith("/storage/")) {
    return `${API_ROOT_URL}${path}`;
  }

  if (path.startsWith("storage/")) {
    return `${API_ROOT_URL}/${path}`;
  }

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

function getItems(data) {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function RestaurantManager() {
  const [activeType, setActiveType] = useState("restaurant");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [showItemForm, setShowItemForm] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => {
        const type =
          category.type || category.tab || category.section || "restaurant";

        return type === activeType;
      })
      .filter((category) =>
        category.name?.toLowerCase().includes(categorySearch.toLowerCase())
      );
  }, [categories, activeType, categorySearch]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(itemSearch.toLowerCase()) ||
        item.description?.toLowerCase().includes(itemSearch.toLowerCase());

      return matchesSearch;
    });
  }, [menuItems, itemSearch]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(null);
    setMenuItems([]);
    setCategoryForm((prev) => ({
      ...prev,
      type: activeType,
    }));
  }, [activeType]);

  useEffect(() => {
    if (selectedCategory) {
      fetchMenuItems(selectedCategory);
    }
  }, [selectedCategory]);

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 2500);
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/restaurant-menu-categories`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load categories. Make sure restaurant-menu-categories API exists."
        );
      }

      setCategories(getItems(data));
    } catch (err) {
      setError(err.message || "Unable to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchMenuItems = async (category) => {
    try {
      setLoadingItems(true);
      setError("");

      const params = new URLSearchParams();

      params.append("tab", activeType);

      if (category?.id) {
        params.append("category_id", category.id);
      }


      const response = await fetch(
        `${API_BASE_URL}/restaurant-menu-items?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load menu items.");
      }

      const items = getItems(data)
        .filter((item) => {
          const itemTab = item.tab || item.type || activeType;
          const sameTab = itemTab === activeType;

          const sameCategoryById =
            category?.id && Number(item.category_id) === Number(category.id);

          const sameCategoryByName =
            category?.name && item.category === category.name;

          return sameTab && (sameCategoryById || sameCategoryByName);
        })
        .map((item) => ({
          ...item,
          imagePreview: buildImageUrl(item.image || item.image_url || ""),
          is_active: toBoolean(item.is_active),
        }));

      setMenuItems(items);
    } catch (err) {
      setError(err.message || "Unable to load menu items.");
    } finally {
      setLoadingItems(false);
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setError("");
    setSuccess("");
    setShowCategoryForm(false);
    setShowItemForm(false);
    setCategorySearch("");
    setItemSearch("");
  };

  const handleCategoryFieldChange = (field, value) => {
    setCategoryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openNewCategoryForm = () => {
    setCategoryForm({
      ...emptyCategoryForm,
      type: activeType,
    });

    setShowCategoryForm(true);
    setError("");
  };

  const editCategory = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name || "",
      type: category.type || category.tab || category.section || activeType,
      is_active: toBoolean(category.is_active),
    });

    setShowCategoryForm(true);
    setError("");
  };

  const saveCategory = async () => {
    try {
      setSavingCategory(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const isUpdate = Boolean(categoryForm.id);

      const url = isUpdate
        ? `${API_BASE_URL}/restaurant-menu-categories/${categoryForm.id}`
        : `${API_BASE_URL}/restaurant-menu-categories`;

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryForm.name,
          type: categoryForm.type,
          is_active: categoryForm.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = getErrorMessage(
          data,
          ["name", "type", "is_active"],
          "Failed to save category."
        );

        throw new Error(message);
      }

      await fetchCategories();

      if (selectedCategory?.id === data?.data?.id) {
        setSelectedCategory(data.data);
      }

      setCategoryForm({
        ...emptyCategoryForm,
        type: activeType,
      });

      setShowCategoryForm(false);

      showSuccess(
        isUpdate
          ? "Category updated successfully."
          : "Category created successfully."
      );
    } catch (err) {
      setError(err.message || "Something went wrong while saving category.");
    } finally {
      setSavingCategory(false);
    }
  };

  const deleteCategory = async (category) => {
    if (
      !confirm(
        `Delete "${category.name}" category? Items under this category may also be affected.`
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/restaurant-menu-categories/${category.id}`,
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
        throw new Error(data?.message || "Failed to delete category.");
      }

      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null);
        setMenuItems([]);
      }

      await fetchCategories();

      showSuccess("Category deleted successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while deleting category.");
    }
  };

  const openNewItemForm = () => {
    if (!selectedCategory) {
      setError("Please select a category first.");
      return;
    }

    setItemForm({
      ...emptyItemForm,
      category: selectedCategory.name,
      category_id: selectedCategory.id,
      tab: activeType,
    });

    setShowItemForm(true);
    setError("");
  };

  const editItem = (item) => {
    setItemForm({
      id: item.id,
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      sort_order: item.sort_order ?? 0,
      category: item.category || selectedCategory?.name || "",
      category_id: item.category_id || selectedCategory?.id || null,
      tab: item.tab || item.type || activeType,
      image: item.image || item.image_url || "",
      imageFile: null,
      imagePreview: buildImageUrl(item.image || item.image_url || ""),
      is_active: toBoolean(item.is_active),
    });

    setShowItemForm(true);
    setError("");
  };

  const handleItemFieldChange = (field, value) => {
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

      if (!selectedCategory) {
        throw new Error("Please select category first.");
      }

      if (!itemForm.imageFile && !itemForm.id) {
        throw new Error("Please upload item image first.");
      }

      const isUpdate = Boolean(itemForm.id);

      const url = isUpdate
        ? `${API_BASE_URL}/restaurant-menu-items/${itemForm.id}`
        : `${API_BASE_URL}/restaurant-menu-items`;

      const formData = new FormData();

      formData.append("name", itemForm.name);
      formData.append("description", itemForm.description || "");
      formData.append("price", itemForm.price || 0);
      formData.append("sort_order", itemForm.sort_order || 0);
      formData.append("category", selectedCategory.name);
      formData.append("category_id", selectedCategory.id);
      formData.append("tab", activeType);
      formData.append("is_active", itemForm.is_active ? "1" : "0");

      if (itemForm.imageFile) {
        formData.append("image", itemForm.imageFile);
      }

      if (isUpdate) {
        formData.append("_method", "PUT");
      }

      /**
       * Your old routes used POST for update:
       * Route::post('restaurant-menu-items/{id}', update)
       * So this keeps update compatible with your existing Laravel route.
       */
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
          [
            "name",
            "description",
            "price",
            "sort_order",
            "category",
            "category_id",
            "tab",
            "image",
            "is_active",
          ],
          "Failed to save menu item."
        );

        throw new Error(message);
      }

      setItemForm(emptyItemForm);
      setShowItemForm(false);

      await fetchMenuItems(selectedCategory);

      showSuccess(
        isUpdate
          ? "Menu item updated successfully."
          : "Menu item created successfully."
      );
    } catch (err) {
      setError(err.message || "Something went wrong while saving item.");
    } finally {
      setSavingItem(false);
    }
  };

  const deleteItem = async (item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/restaurant-menu-items/${item.id}`,
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
        throw new Error(data?.message || "Failed to delete menu item.");
      }

      await fetchMenuItems(selectedCategory);

      showSuccess("Menu item deleted successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while deleting item.");
    }
  };

  const currentTypeLabel =
    activeType === "restaurant" ? "Our Restaurant" : "Our Bar";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/30">
              <UtensilsCrossed size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Restaurant & Bar Menu
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                First create categories under Restaurant or Bar, then add food
                or drinks under each category.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchCategories();

            if (selectedCategory) {
              fetchMenuItems(selectedCategory);
            }
          }}
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

      {/* RESTAURANT / BAR SWITCH */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleTypeChange("restaurant")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeType === "restaurant"
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <UtensilsCrossed size={18} />
            Our Restaurant
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("bar")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeType === "bar"
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Wine size={18} />
            Our Bar
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* LEFT: CATEGORY LIST */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {currentTypeLabel} Categories
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Click category to manage its items.
                </p>
              </div>

              <button
                type="button"
                onClick={openNewCategoryForm}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
              >
                <Plus size={15} />
                Category
              </button>
            </div>

            <div className="mb-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search size={15} className="text-slate-400" />

              <input
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories..."
                className="h-11 w-full bg-transparent px-3 text-sm outline-none"
              />
            </div>

            {loadingCategories ? (
              <LoadingBox label="Loading categories..." />
            ) : filteredCategories.length === 0 ? (
              <EmptyBox
                label={`No ${currentTypeLabel.toLowerCase()} categories yet.`}
              />
            ) : (
              <div className="space-y-2">
                {filteredCategories.map((category) => {
                  const isActive = selectedCategory?.id === category.id;

                  return (
                    <div
                      key={category.id}
                      className={`rounded-xl border p-3 transition ${
                        isActive
                          ? "border-amber-300 bg-amber-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowItemForm(false);
                          setItemForm(emptyItemForm);
                        }}
                        className="flex w-full items-center justify-between gap-3 text-left"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {category.name}
                          </h3>

                          <p className="mt-1 text-[11px] font-semibold text-amber-600">
                            {toBoolean(category.is_active)
                              ? "Active"
                              : "Inactive"}
                          </p>
                        </div>

                        <ChevronRight
                          size={18}
                          className={
                            isActive ? "text-amber-600" : "text-slate-400"
                          }
                        />
                      </button>

                      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => editCategory(category)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                          <Edit3 size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CATEGORY FORM */}
          {showCategoryForm && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                  {categoryForm.id ? "Edit Category" : "Create Category"}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setCategoryForm({
                      ...emptyCategoryForm,
                      type: activeType,
                    });
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="space-y-4">
                <Field label="Category Name">
                  <input
                    value={categoryForm.name}
                    onChange={(e) =>
                      handleCategoryFieldChange("name", e.target.value)
                    }
                    placeholder="Example: Breakfast, Cocktails, Soft Drinks"
                    className="form-input"
                  />
                </Field>

                <Field label="Belongs To">
                  <select
                    value={categoryForm.type}
                    onChange={(e) =>
                      handleCategoryFieldChange("type", e.target.value)
                    }
                    className="form-input"
                  >
                    <option value="restaurant">Our Restaurant</option>
                    <option value="bar">Our Bar</option>
                  </select>
                </Field>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Active Category
                  </span>

                  <input
                    type="checkbox"
                    checked={categoryForm.is_active}
                    onChange={(e) =>
                      handleCategoryFieldChange("is_active", e.target.checked)
                    }
                    className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                </label>

                <button
                  type="button"
                  onClick={saveCategory}
                  disabled={savingCategory}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingCategory ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {savingCategory ? "Saving..." : "Save Category"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: ITEMS UNDER SELECTED CATEGORY */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedCategory
                    ? `${selectedCategory.name} Items`
                    : "Select Category"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedCategory
                    ? `Add food or drink under ${selectedCategory.name}.`
                    : "Choose a category from the left side first."}
                </p>
              </div>

              <button
                type="button"
                onClick={openNewItemForm}
                disabled={!selectedCategory}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Plus size={16} />
                Add Food / Drink
              </button>
            </div>
          </div>

          {showItemForm && selectedCategory && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {itemForm.id ? "Edit Food / Drink" : "Create Food / Drink"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Under category:{" "}
                    <span className="font-bold text-amber-600">
                      {selectedCategory.name}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowItemForm(false);
                    setItemForm(emptyItemForm);
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-4">
                  <Field label="Name">
                    <input
                      value={itemForm.name}
                      onChange={(e) =>
                        handleItemFieldChange("name", e.target.value)
                      }
                      placeholder="Example: Grilled Chicken, Mojito"
                      className="form-input"
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      value={itemForm.description}
                      onChange={(e) =>
                        handleItemFieldChange("description", e.target.value)
                      }
                      rows={4}
                      placeholder="Short item description..."
                      className="form-input resize-y"
                    />
                  </Field>

                  <Field label="Price">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) =>
                        handleItemFieldChange("price", e.target.value)
                      }
                      placeholder="Example: 15"
                      className="form-input"
                    />
                  </Field>

                  <Field label="Sort Order">
                    <input
                      type="number"
                      min="0"
                      value={itemForm.sort_order}
                      onChange={(e) =>
                        handleItemFieldChange("sort_order", e.target.value)
                      }
                      placeholder="Example: 1"
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
                        handleItemFieldChange("is_active", e.target.checked)
                      }
                      className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={saveItem}
                    disabled={savingItem}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingItem ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}

                    {savingItem ? "Saving..." : "Save Food / Drink"}
                  </button>
                </div>

                <div>
                  <Field label="Image">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-amber-400 hover:bg-amber-50/40">
                      <Image size={26} className="mb-2 text-amber-500" />

                      <span className="text-sm font-semibold text-slate-700">
                        Upload image
                      </span>

                      <span className="mt-1 text-xs text-slate-400">
                        JPG, PNG, WEBP
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleItemImageChange}
                        className="hidden"
                      />
                    </label>
                  </Field>

                  {itemForm.imagePreview && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={itemForm.imagePreview}
                        alt="Item preview"
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Search size={15} className="text-slate-400" />

                <input
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  placeholder="Search foods or drinks..."
                  className="h-11 w-full bg-transparent px-3 text-sm outline-none"
                />
              </div>

              <p className="text-xs font-semibold text-slate-500">
                {filteredItems.length} item(s)
              </p>
            </div>

            {!selectedCategory ? (
              <EmptyBox label="Select a category to see its food or drinks." />
            ) : loadingItems ? (
              <LoadingBox label="Loading foods and drinks..." />
            ) : filteredItems.length === 0 ? (
              <EmptyBox label="No food or drink found under this category." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="aspect-video bg-slate-100">
                      {item.imagePreview ? (
                        <img
                          src={item.imagePreview}
                          alt={item.name}
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
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs font-semibold text-amber-600">
                            {money(item.price)}
                          </p>

                          <p className="mt-1 text-[11px] font-medium text-slate-400">
                            Order: {item.sort_order ?? 0}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            toBoolean(item.is_active)
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {toBoolean(item.is_active) ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {item.description && (
                        <p className="line-clamp-3 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => editItem(item)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                          <Edit3 size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
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
          </div>
        </div>
      </div>

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

function LoadingBox({ label }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
      <Loader2 size={17} className="animate-spin text-amber-500" />
      {label}
    </div>
  );
}

function EmptyBox({ label }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
      {label}
    </div>
  );
}