"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import EnquiryModal from "@/components/EnquiryModal";

export function TrendingProducts() {
  const [trendingProductsData, setTrendingProductsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await productService.getTrendingProducts();
      setTrendingProductsData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch trending products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnquiry = (product) => {
    setSelectedProduct(product);
    setShowEnquiryModal(true);
  };

  const nextSlide = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % Math.max(1, trendingProductsData.length - 3)
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.max(1, trendingProductsData.length - 3)) %
        Math.max(1, trendingProductsData.length - 3)
    );
  };

  const visibleProducts = trendingProductsData.slice(
    currentIndex,
    currentIndex + 4
  );

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
            🔥 Trending Products
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Discover what's popular in our marketplace
          </p>
          <Link to="/products">
            <Button
              variant="outline"
              size="lg"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              View All Products
            </Button>
          </Link>
        </div>

        {trendingProductsData.length > 0 ? (
          <div className="relative">
            {/* Navigation Buttons */}
            {trendingProductsData.length > 4 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-12 h-12 bg-white shadow-lg hover:shadow-xl"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full w-12 h-12 bg-white shadow-lg hover:shadow-xl"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No trending products available at the moment.
            </p>
          </div>
        )}

        {/* Enquiry Modal */}
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          product={selectedProduct}
          isLoggedIn={false} // replace with actual auth status if available
        />
      </div>
    </section>
  );
}
