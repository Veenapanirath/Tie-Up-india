"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";

export function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await productService.BestSellers();
      // For now, we'll simulate best sellers by taking random products
      // In a real app, you'd have sales data to determine this
      const products = response.data || [];
      const shuffled = products.sort(() => 0.5 - Math.random());
      setBestSellers(shuffled.slice(0, 8));
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
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
            🏆 Best Sellers
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Most popular products chosen by our customers
          </p>
          <Link to="/products?sort=popular">
            <Button
              variant="outline"
              size="lg"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
            >
              View All Best Sellers
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, index) => (
            <div key={product._id} className="relative">
              {index < 3 && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge
                    className={`
                    ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : "bg-orange-600"
                    }
                    text-white font-bold
                  `}
                  >
                    #{index + 1}
                  </Badge>
                </div>
              )}
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
