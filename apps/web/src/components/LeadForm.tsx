"use client";

import { useState } from "react";

export default function LeadForm({ defaultProduct = "GENERAL" }: { defaultProduct?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      productType: formData.get("productType"),
      message: formData.get("message"),
      sourcePage: window.location.pathname, // Tracks where they converted!
    };

    try {
      // NOTE: Replace this URL with your actual backend API URL
      // If running locally, it might be http://localhost:3001/leads/website
      const response = await fetch("https://palatial-api-url.onrender.com/leads/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit. Please try again or use WhatsApp.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
        <h3 className="text-xl font-bold text-green-700 mb-2">Request Received!</h3>
        <p className="text-green-600">
          Our team (or bot) will be in touch with your quote shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      
      {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="fullName" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Safaricom/Airtel)</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="0712 345 678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
          <select 
            name="productType" 
            defaultValue={defaultProduct}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="MOTOR">Motor Insurance</option>
            <option value="MEDICAL">Medical Insurance</option>
            <option value="HOME">Home Insurance</option>
            <option value="GENERAL">General Inquiry</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-70"
        >
          {loading ? "Sending..." : "Request Quote"}
        </button>
      </div>
    </form>
  );
}