"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";

export function NewArrivals() {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await productService.newArrivals();
      // Sort by creation date and take the latest 8 products
      const sortedProducts = (response.data || [])
        .sort((a, b) => {
          const dateA = new Date(b.createdAt || 0).getTime();
          const dateB = new Date(a.createdAt || 0).getTime();
          return dateA - dateB;
        })
        .slice(0, 8);
      setNewProducts(sortedProducts);
    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ New Arrivals
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Fresh products just added to our marketplace
          </p>
          <Link to="/products?sort=newest">
            <Button
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
            >
              View All New Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <div key={product._id} className="relative">
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </span>
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
