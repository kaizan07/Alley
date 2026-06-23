import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="bg-white rounded shadow p-4 hover:shadow-lg transition duration-200">
      <img
        src={product.images[0] || "placeholder.png"}
        alt={product.name}
        className="w-full h-60 object-cover rounded"
      />
      <h3 className="mt-2 font-medium text-lg">{product.title}</h3>
      <div className="flex items-center justify-between mt-2">
        <p className="text-stone-700 font-semibold">₹{product.price}</p>
        <ShoppingCart className="w-5 h-5 text-stone-600" />
      </div>
    </Link>
  );
};

export default ProductCard;
