import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCategories, setExistingCategories] = useState([]);

  // Fetch existing categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update image previews whenever files change
  useEffect(() => {
    if (imageFiles.length > 0) {
      const previews = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);

      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [imageFiles]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setExistingCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!imageFiles.length) return [];

    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    const res = await axios.post("http://localhost:5000/api/upload", formData);
    return res.data.imagePaths;
  };

  const createCategoryIfNotExists = async (categoryName) => {
    try {
      // Check if category already exists
      const existingCategory = existingCategories.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (existingCategory) {
        return existingCategory._id;
      }

      // Create new category if it doesn't exist
      const newCategory = await axios.post("http://localhost:5000/api/categories", {
        name: categoryName,
        description: `Category for ${categoryName} products`
      });

      // Add to existing categories list
      setExistingCategories(prev => [...prev, newCategory.data]);
      
      return newCategory.data._id;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create category if it doesn't exist
      const categoryId = await createCategoryIfNotExists(product.category);

      // Upload images
      const imagePaths = await handleImageUpload();

      // Create the product with category ID
      const newProduct = {
        ...product,
        category: categoryId, // Use the category ID instead of name
        price: Number(product.price),
        stock: Number(product.stock),
        images: imagePaths,
      };

      await axios.post("http://localhost:5000/api/products/add", newProduct);

      alert("Product added successfully!");
      clearForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setProduct({
      title: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      images: [],
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "description", "price", "stock"].map((field) => (
          <input
            key={field}
            type={field === "price" || field === "stock" ? "number" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={product[field]}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        ))}

        {/* Category input with existing categories suggestion */}
        <div>
          <input
            type="text"
            name="category"
            placeholder="Category (will be created if new)"
            value={product.category}
            onChange={handleChange}
            className="border p-2 w-full"
            required
            list="existing-categories"
          />
          <datalist id="existing-categories">
            {existingCategories.map((category) => (
              <option key={category._id} value={category.name} />
            ))}
          </datalist>
          {/* <p className="text-sm text-gray-600 mt-1">
            Type a new category name or select from existing ones
          </p> */}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImageFiles(Array.from(e.target.files))}
          className="border p-2 w-full"
          required
        />

        {/* Image Preview Section */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-24 w-24 object-cover border rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
