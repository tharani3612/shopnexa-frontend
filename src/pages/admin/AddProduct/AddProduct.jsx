
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  Link2,
  X,
  Package,
  Save,
} from "lucide-react";
import "./AddProduct.css";

const CATEGORY_API = "http://localhost:5000/api/admin/categories";
const PRODUCT_API = "http://localhost:5000/api/admin/products";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageMode, setImageMode] = useState("url");

  const [saving, setSaving] = useState(false);

  // =====================================
  // FETCH ACTIVE CATEGORIES FROM MONGODB
  // =====================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError("");

        const token = localStorage.getItem("adminToken");

        if (!token) {
          throw new Error(
            "Admin session not found. Please login again."
          );
        }

        const response = await fetch(CATEGORY_API, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load categories."
          );
        }

        const activeCategories = (data.categories || []).filter(
          (category) =>
            category.status === "Active"
        );

        setCategories(activeCategories);

        // Select first active category by default
        setFormData((prev) => ({
          ...prev,
          category: activeCategories.some(
            (category) => category.name === prev.category
          )
            ? prev.category
            : activeCategories[0]?.name || "",
        }));
      } catch (error) {
        console.error("Fetch Categories Error:", error);
        setCategoryError(error.message);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =====================================
  // HANDLE FORM INPUTS
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // HANDLE IMAGE URL
  // =====================================
  const handleImageUrl = (e) => {
    const value = e.target.value;

    setImageUrl(value);
    setImageError("");
    setImagePreview(value.trim());
  };

  // =====================================
  // HANDLE IMAGE FILE UPLOAD
  // =====================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image size must be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
      setImageUrl("");
      setImageError("");
    };

    reader.onerror = () => {
      setImageError(
        "Unable to read this image. Please try again."
      );
    };

    reader.readAsDataURL(file);
  };

  // =====================================
  // REMOVE IMAGE
  // =====================================
  const removeImage = () => {
    setImagePreview("");
    setImageUrl("");
    setImageError("");
  };

  // =====================================
  // SUBMIT PRODUCT TO MONGODB
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      alert("Please enter a valid product price.");
      return;
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (imageError) {
      alert(imageError);
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    setSaving(true);

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        image: imagePreview || "",
        isActive: true,
      };

      const response = await fetch(PRODUCT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to add product."
        );
      }

      alert("Product added successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("Add Product Error:", error);

      alert(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="admin-add-product"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HEADER */}
      <div className="add-product-header">
        <div>
          <Link
            to="/admin/products"
            className="back-products-link"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <h1>Add Product</h1>
          <p>Add a new product to your ShopNexa store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="add-product-layout">

          {/* LEFT - PRODUCT DETAILS */}
          <div className="add-product-main">
            <section className="add-product-card">

              <div className="add-card-heading">
                <div className="add-card-icon">
                  <Package size={19} />
                </div>

                <div>
                  <h2>Basic Information</h2>
                  <p>Enter your product details.</p>
                </div>
              </div>

              {/* PRODUCT NAME */}
              <div className="add-form-group">
                <label htmlFor="product-name">
                  Product Name <span>*</span>
                </label>

                <input
                  id="product-name"
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CATEGORY AND PRICE */}
              <div className="add-form-row">

                <div className="add-form-group">
                  <label htmlFor="product-category">
                    Category <span>*</span>
                  </label>

                  <select
                    id="product-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={
                      categoryLoading ||
                      categories.length === 0
                    }
                    required
                  >
                    {categoryLoading ? (
                      <option value="">
                        Loading categories...
                      </option>
                    ) : categories.length === 0 ? (
                      <option value="">
                        No active categories available
                      </option>
                    ) : (
                      <>
                        <option value="">
                          Select a category
                        </option>

                        {categories.map((category) => (
                          <option
                            key={category._id}
                            value={category.name}
                          >
                            {category.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  {categoryError && (
                    <small className="image-error">
                      {categoryError}
                    </small>
                  )}

                  {!categoryLoading &&
                    categories.length === 0 &&
                    !categoryError && (
                      <small>
                        Add an active category from Categories page.
                      </small>
                    )}
                </div>

                <div className="add-form-group">
                  <label htmlFor="product-price">
                    Price (₹) <span>*</span>
                  </label>

                  <input
                    id="product-price"
                    type="number"
                    name="price"
                    min="1"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* STOCK */}
              <div className="add-form-group">
                <label htmlFor="product-stock">
                  Stock Quantity <span>*</span>
                </label>

                <input
                  id="product-stock"
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  placeholder="Enter available quantity"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="add-form-group">
                <label htmlFor="product-description">
                  Product Description
                </label>

                <textarea
                  id="product-description"
                  name="description"
                  rows="5"
                  placeholder="Write a short description about this product..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* IMAGE UPLOAD */}
            <section className="add-product-card image-upload-card">

              <div className="add-card-heading">
                <div className="add-card-icon">
                  <ImagePlus size={19} />
                </div>

                <div>
                  <h2>Product Image</h2>
                  <p>
                    Add an image using a URL or upload a file.
                  </p>
                </div>
              </div>

              <div className="image-mode-tabs">
                <button
                  type="button"
                  className={
                    imageMode === "url" ? "selected" : ""
                  }
                  onClick={() => setImageMode("url")}
                >
                  <Link2 size={16} />
                  Image URL
                </button>

                <button
                  type="button"
                  className={
                    imageMode === "file" ? "selected" : ""
                  }
                  onClick={() => setImageMode("file")}
                >
                  <Upload size={16} />
                  Upload Image
                </button>
              </div>

              {imageMode === "url" ? (
                <div className="add-form-group image-url-group">
                  <label htmlFor="product-image-url">
                    Image URL
                  </label>

                  <input
                    id="product-image-url"
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    value={imageUrl}
                    onChange={handleImageUrl}
                  />

                  <small>
                    Paste an online image URL to preview your
                    product image.
                  </small>
                </div>
              ) : (
                <div className="product-file-upload">
                  <label htmlFor="product-image-file">
                    <Upload size={25} />
                    <strong>Click to upload an image</strong>
                    <span>
                      PNG, JPG, JPEG or WEBP (Max 2 MB)
                    </span>
                  </label>

                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {imageError && (
                <p className="image-error">
                  {imageError}
                </p>
              )}

              {imagePreview && (
                <div className="image-preview-section">
                  <div className="image-preview-heading">
                    <span>Image Preview</span>

                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Remove image"
                    >
                      <X size={15} />
                      Remove
                    </button>
                  </div>

                  <div className="product-image-preview">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      onError={() => {
                        setImageError(
                          "Image URL could not be loaded. Check the link."
                        );
                      }}
                      onLoad={() => setImageError("")}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT - PREVIEW AND ACTIONS */}
          <aside className="add-product-sidebar">

            {/* LIVE PRODUCT PREVIEW */}
            <section className="add-product-card product-live-preview">
              <h2>Product Preview</h2>
              <p>Preview how your product image looks.</p>

              <div className="live-product-image">
                {imagePreview && !imageError ? (
                  <img
                    src={imagePreview}
                    alt="Product"
                  />
                ) : (
                  <div className="empty-product-image">
                    <ImagePlus size={38} />
                    <span>No image selected</span>
                  </div>
                )}
              </div>

              <div className="live-product-details">
                <span>
                  {formData.category || "Category"}
                </span>

                <h3>
                  {formData.name || "Product Name"}
                </h3>

                <strong>
                  ₹
                  {formData.price
                    ? Number(formData.price).toLocaleString(
                        "en-IN"
                      )
                    : "0"}
                </strong>

                <small>
                  Stock: {formData.stock || "0"} units
                </small>
              </div>
            </section>

            {/* IMAGE GUIDELINES */}
            <section className="add-product-card add-product-tips">
              <h3>Image Guidelines</h3>

              <ul>
                <li>Use clear, high-quality images.</li>
                <li>Prefer a square image (1:1 ratio).</li>
                <li>Use JPG, PNG or WEBP formats.</li>
                <li>Keep uploaded files below 2 MB.</li>
              </ul>
            </section>

            {/* ACTION BUTTONS */}
            <div className="add-product-actions">
              <button
                type="button"
                className="cancel-product-btn"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-btn"
                disabled={
                  saving ||
                  categoryLoading ||
                  categories.length === 0
                }
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>

          </aside>
        </div>
      </form>
    </motion.div>
  );
}

export default AddProduct;
