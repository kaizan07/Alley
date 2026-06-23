import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f7f0e8] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg text-center">
          <h1 className="text-3xl font-bold text-[#4d4033] mb-4">Thank you for your order!</h1>
          <p className="text-gray-700 mb-2">Your order has been confirmed and will be delivered soon.</p>
          <p className="text-gray-600 mb-6">Order ID: <span className="font-mono">{orderId}</span></p>
          <Link to="/home" className="inline-block bg-[#4d4033] text-white px-6 py-3 rounded-lg hover:bg-[#3b3228] transition-colors">Go to Home</Link>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;


