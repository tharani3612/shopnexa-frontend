
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Save,
  ImagePlus,
  Tag,
  IndianRupee,
  Boxes,
  FileText,
} from "lucide-react";

import "./EditProduct.css";

const API_URL = "http://localhost:5000/api/admin/products";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  // FETCH EXISTING PRODUCT FROM MONGODB
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const token = localStorage.getItem("adminToken");

        if (!token) {
          throw new Error("Admin session expired. Please login again.");
        }

        const response = await fetch(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch product");
        }

        const existingProduct = data.product;

        if (!existingProduct) {
          setNotFound(true);
          return;
        }

        setProduct({
          name: existingProduct.name || "",
          category:
            typeof existingProduct.category === "object"
              ? existingProduct.category?.name || ""
              : existingProduct.category || "",
          price: existingProduct.price ?? "",
          stock: existingProduct.stock ?? "",
          image: existingProduct.image || "",
          description: existingProduct.description || "",
        });
      } catch (err) {
        console.error("Fetch Product Error:", err);
        setError(err.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE PRODUCT IN MONGODB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!product.category.trim()) {
      alert("Please select a category.");
      return;
    }

    if (product.price === "" || Number(product.price) <= 0) {
      alert("Please enter a valid product price.");
      return;
    }

    if (
      product.stock === "" ||
      !Number.isInteger(Number(product.stock)) ||
      Number(product.stock) < 0
    ) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session expired. Please login again.");
      }

      const updatedProduct = {
        name: product.name.trim(),
        category: product.category,
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.image.trim(),
        description: product.description.trim(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update product");
      }

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update Product Error:", err);
      alert(err.message || "Unable to update product");
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="edit-product-page">
        <div className="not-found-card">
          <Package size={42} />
          <h2>Loading Product...</h2>
          <p>Please wait while we fetch product details.</p>
        </div>
      </div>
    );
  }

  // PRODUCT NOT FOUND
  if (notFound) {
    return (
      <motion.div
        className="edit-product-page not-found-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="not-found-card">
          <Package size={42} />
          <h2>Product Not Found</h2>
          <p>The product you're trying to edit doesn't exist.</p>

          <Link to="/admin/products" className="back-products-btn">
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </div>
      </motion.div>
    );
  }

  // FETCH ERROR
  if (error) {
    return (
      <div className="edit-product-page not-found-page">
        <div className="not-found-card">
          <Package size={42} />
          <h2>Unable to Load Product</h2>
          <p>{error}</p>

          <Link to="/admin/products" className="back-products-btn">
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="edit-product-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* HEADER */}
      <div className="edit-product-header">
        <div>
          <Link to="/admin/products" className="back-products-btn">
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <h1>Edit Product</h1>
          <p>Update your product information and inventory.</p>
        </div>
      </div>

      <form className="edit-product-form" onSubmit={handleSubmit}>
        {/* FORM HEADING */}
        <div className="edit-form-heading">
          <div className="edit-form-heading-icon">
            <Package size={22} />
          </div>

          <div>
            <h2>Product Information</h2>
            <p>Make changes to your product details below.</p>
          </div>
        </div>

        {/* PRODUCT NAME */}
        <motion.div
          className="edit-form-group"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor="edit-name">
            Product Name <span>*</span>
          </label>

          <div className="edit-input-wrapper">
            <Package size={18} />

            <input
              id="edit-name"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
        </motion.div>

        {/* CATEGORY AND PRICE */}
        <div className="edit-form-row">
          <div className="edit-form-group">
            <label htmlFor="edit-category">
              Category <span>*</span>
            </label>

            <div className="edit-input-wrapper">
              <Tag size={18} />

              <select
                id="edit-category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Footwear">Footwear</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Accessories">Accessories</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-price">
              Price (₹) <span>*</span>
            </label>

            <div className="edit-input-wrapper">
              <IndianRupee size={18} />

              <input
                id="edit-price"
                type="number"
                name="price"
                min="1"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>
          </div>
        </div>

        {/* STOCK AND IMAGE */}
        <div className="edit-form-row">
          <div className="edit-form-group">
            <label htmlFor="edit-stock">
              Stock Quantity <span>*</span>
            </label>

            <div className="edit-input-wrapper">
              <Boxes size={18} />

              <input
                id="edit-stock"
                type="number"
                name="stock"
                min="0"
                step="1"
                value={product.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                required
              />
            </div>
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-image">Product Image URL</label>

            <div className="edit-input-wrapper">
              <ImagePlus size={18} />

              <input
                id="edit-image"
                type="url"
                name="image"
                value={product.image || ""}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        {product.image && (
          <motion.div
            className="edit-image-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="edit-image-preview-heading">
              <span>Current Product Image</span>
            </div>

            <img
              src={product.image}
              alt={product.name || "Product"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </motion.div>
        )}

        {/* DESCRIPTION */}
        <div className="edit-form-group description-group">
          <label htmlFor="edit-description">
            <FileText size={16} />
            Product Description
          </label>

          <textarea
            id="edit-description"
            name="description"
            rows="5"
            value={product.description || ""}
            onChange={handleChange}
            placeholder="Enter product description..."
          />
        </div>

        {/* ACTIONS */}
        <div className="edit-form-actions">
          <Link to="/admin/products" className="cancel-edit-btn">
            Cancel
          </Link>

          <button
            type="submit"
            className="update-product-btn"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default EditProduct;
