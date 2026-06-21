"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { brandService, Brand } from "@/services/brandService"

export function TrustedBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getAllBrands();
      setBrands(response.data?.brands || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      // Fallback to empty array if API fails
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">🤝 Trusted Brands & Partners</h2>
          <p className="text-xl text-gray-600">We work with India's leading companies and brands</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : brands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {brands.map((brand) => (
              <Card
                key={brand._id}
                className="bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-sm relative overflow-hidden"
              >
                {/* Gradient overlay for entire card */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-white to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className="mb-4 flex items-center justify-center h-16">
                    <img
                      src={brand.image || "/placeholder.svg"}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                    {brand.name}
                  </h4>
                  <p className="text-xs text-gray-500">{brand.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands available at the moment</p>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">Join thousands of successful businesses on our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Vendors</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
