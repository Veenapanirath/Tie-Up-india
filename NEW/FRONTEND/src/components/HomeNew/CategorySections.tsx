"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";

const featuredCategories = [
  { name: "Fashion", icon: "👗", color: "from-pink-500 to-purple-600" },
  { name: "Electronics", icon: "📱", color: "from-blue-500 to-cyan-600" },
  { name: "Machinery", icon: "⚙️", color: "from-gray-600 to-gray-800" },
  { name: "Food Items", icon: "🍎", color: "from-green-500 to-emerald-600" },
];

export function CategorySections() {
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, []);

  const fetchCategoryProducts = async () => {
    try {
      const response = await productService.getProducts();
      const products = response.data || [];

      // Group products by category
      const grouped = {};
      featuredCategories.forEach((category) => {
        grouped[category.name] = products
          .filter((product) => product.category?.name === category.name)
          .slice(0, 4);
      });

      setCategoryProducts(grouped);
    } catch (error) {
      console.error("Failed to fetch category products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-16">
        {featuredCategories.map((category) => (
          <div key={category.name}>
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl shadow-lg`}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">
                    Explore our {category.name.toLowerCase()} collection
                  </p>
                </div>
              </div>
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
              >
                <Button
                  variant="outline"
                  className="border-gray-300 hover:border-gray-400 bg-transparent"
                >
                  View All
                </Button>
              </Link>
            </div>

            {/* Products Grid */}
            {categoryProducts[category.name]?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryProducts[category.name].map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-white border-dashed border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">
                    No {category.name} Products Yet
                  </h4>
                  <p className="text-gray-500">
                    Products in this category will appear here soon.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
