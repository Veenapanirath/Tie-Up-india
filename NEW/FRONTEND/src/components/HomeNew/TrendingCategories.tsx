"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { productService } from "@/services/productService"

export function TrendingCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📈 Trending Categories</h2>
          <p className="text-xl text-gray-600">Explore our most popular product categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => (
            
            category.isTrending ? (
              <Link key={category._id} to={`/products?category=${encodeURIComponent(category.name)}`} className="group">
                <Card className="bg-white hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0 shadow-md">
                  <div className="aspect-square bg-gradient-to-br from-orange-50 to-green-50 relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {category.sub_category?.length || 0} subcategories
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ) : null


          ))}
        </div>
      </div>
    </section>
  )
}
