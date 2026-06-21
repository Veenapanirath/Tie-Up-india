"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Link } from "react-router-dom"

export function Hero() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="bg-white">
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            <span className="text-orange-500">Tie</span>
            <span className="text-white text-stroke">-</span>
            <span className="text-green-600">Up</span>
            <span className="text-gray-900">-India</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            India's Premier B2B Marketplace
            <br />
            <span className="text-lg text-gray-500">Connecting Businesses Across the Nation</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Input
              type="text"
              placeholder="Search products, categories, or vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-20 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-orange-500 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <Link to="/products">
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                Search
              </Button>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-8 py-3 rounded-full shadow-lg"
              >
                Start Shopping
              </Button>
            </Link>
            <Link to="/signup/vendor">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full bg-transparent"
              >
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
