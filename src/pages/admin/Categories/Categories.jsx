
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, FolderOpen, Tags } from "lucide-react";
import "./Categories.css";

const API_URL = "https://shopnexa-backend-wjk6.onrender.com/api/admin/categories";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // FETCH CATEGORIES FROM MONGODB
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin session not found. Please login again."
        );
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch categories."
        );
      }

      setCategories(data.categories || []);
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      setError(err.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD CATEGORIES WHEN PAGE OPENS
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // RESET FORM
  const handleCancel = () => {
    setCategoryName("");
    setDescription("");
    setEditingId(null);
  };

  // ADD OR UPDATE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      alert("Please enter category name.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedName.toLowerCase() &&
        category._id !== editingId
    );

    if (duplicate) {
      alert("Category already exists!");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin session not found. Please login again.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: trimmedName,
            description: description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Failed to ${isEditing ? "update" : "add"} category.`
        );
      }

      alert(
        isEditing
          ? "Category updated successfully!"
          : "Category added successfully!"
      );

      handleCancel();

      // Refresh latest data from MongoDB
      await fetchCategories();
    } catch (err) {
      console.error("Save Category Error:", err);
      alert(err.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  // EDIT CATEGORY
  const handleEdit = (category) => {
    setCategoryName(category.name);
    setDescription(category.description || "");
    setEditingId(category._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin session not found. Please login again.");
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete category."
        );
      }

      setCategories((current) =>
        current.filter((category) => category._id !== id)
      );

      if (editingId === id) {
        handleCancel();
      }

      alert("Category deleted successfully!");
    } catch (err) {
      console.error("Delete Category Error:", err);
      alert(err.message || "Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  // PAGE ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="admin-categories"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HEADER */}
      <motion.div
        className="categories-header"
        variants={itemVariants}
      >
        <div className="categories-heading">
          <div className="categories-title-icon">
            <Tags size={25} />
          </div>

          <div>
            <h1>Categories</h1>
            <p>
              Organize and manage your product categories
            </p>
          </div>
        </div>

        <motion.div
          className="category-count"
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.25 }}
        >
          <div className="category-count-icon">
            <FolderOpen size={23} />
          </div>

          <div>
            <span>Total Categories</span>
            <strong>{categories.length}</strong>
          </div>
        </motion.div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="categories-content">

        {/* CATEGORY FORM */}
        <motion.form
          className="category-form"
          onSubmit={handleSubmit}
          variants={itemVariants}
          layout
        >
          <div className="category-form-heading">
            <span className="category-section-icon">
              <FolderOpen size={20} />
            </span>

            <div>
              <h2>
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>

              <p>
                {editingId
                  ? "Update your category details"
                  : "Create a new product category"}
              </p>
            </div>
          </div>

          <div className="category-form-group">
            <label htmlFor="categoryName">
              Category Name *
            </label>

            <input
              id="categoryName"
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) =>
                setCategoryName(e.target.value)
              }
              maxLength={50}
              required
            />
          </div>

          <div className="category-form-group">
            <label htmlFor="categoryDescription">
              Description
            </label>

            <textarea
              id="categoryDescription"
              placeholder="Enter category description..."
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              maxLength={200}
            />

            <span className="category-character-count">
              {description.length}/200 characters
            </span>
          </div>

          <div className="category-form-actions">
            <motion.button
              type="submit"
              className="category-save-btn"
              disabled={saving}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Add Category"}
            </motion.button>

            <AnimatePresence>
              {editingId && (
                <motion.button
                  type="button"
                  className="category-cancel-btn"
                  onClick={handleCancel}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -2 }}
                >
                  Cancel
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        {/* CATEGORIES LIST */}
        <motion.div
          className="categories-list"
          variants={itemVariants}
        >
          <div className="categories-list-header">
            <div>
              <h2>All Categories</h2>
              <p>
                View and manage your existing categories
              </p>
            </div>

            <span className="categories-total-badge">
              {categories.length} Items
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="empty-categories">
              <h3>Unable to load categories</h3>
              <p>{error}</p>

              <button
                type="button"
                onClick={fetchCategories}
              >
                Try Again
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading && !error && (
            <div className="empty-categories">
              <h3>Loading categories...</h3>
              <p>Please wait while we fetch your categories.</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && categories.length === 0 && (
            <motion.div
              className="empty-categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-category-icon">
                <FolderOpen size={35} />
              </div>

              <h3>No Categories Found</h3>
              <p>
                Add your first category using the form.
              </p>
            </motion.div>
          )}

          {/* CATEGORY TABLE */}
          {!loading && !error && categories.length > 0 && (
            <div className="categories-table-wrapper">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {categories.map((category, index) => (
                      <motion.tr
                        key={category._id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td>
                          <span className="category-index">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>

                        <td>
                          <div className="category-name-cell">
                            <span className="category-row-icon">
                              <FolderOpen size={17} />
                            </span>

                            <strong>{category.name}</strong>
                          </div>
                        </td>

                        <td className="category-description-cell">
                          {category.description || "—"}
                        </td>

                        <td>
                          <div className="category-actions">
                            <motion.button
                              type="button"
                              className="category-edit-btn"
                              onClick={() => handleEdit(category)}
                              title="Edit category"
                              aria-label={`Edit ${category.name}`}
                              whileHover={{
                                scale: 1.1,
                                y: -2,
                              }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Pencil size={16} />
                            </motion.button>

                            <motion.button
                              type="button"
                              className="category-delete-btn"
                              onClick={() =>
                                handleDelete(category._id)
                              }
                              title="Delete category"
                              aria-label={`Delete ${category.name}`}
                              disabled={deletingId === category._id}
                              whileHover={{
                                scale: 1.1,
                                y: -2,
                              }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Categories;
