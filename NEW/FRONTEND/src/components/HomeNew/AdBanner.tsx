"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { adminService } from "@/services/adminService"

const bannerAds = [
  {
    id: 1,
    title: "Mega Electronics Sale",
    subtitle: "Up to 50% Off on All Electronics",
    description: "Latest smartphones, laptops, and home appliances at unbeatable prices",
    image: "/placeholder.svg?height=400&width=1200",
    ctaText: "Shop Now",
    ctaLink: "/products?category=Electronics",
    backgroundColor: "from-blue-600 to-purple-700",
  },
  {
    id: 2,
    title: "Fashion Week Special",
    subtitle: "Trending Styles for Men & Women",
    description: "Discover the latest fashion trends and exclusive collections",
    image: "/placeholder.svg?height=400&width=1200",
    ctaText: "Explore Fashion",
    ctaLink: "/products?category=Fashion",
    backgroundColor: "from-pink-500 to-rose-600",
  },
  {
    id: 3,
    title: "Industrial Equipment Expo",
    subtitle: "Heavy Machinery & Tools",
    description: "Professional grade equipment for all your industrial needs",
    image: "/placeholder.svg?height=400&width=1200",
    ctaText: "View Machinery",
    ctaLink: "/products?category=Machinery",
    backgroundColor: "from-gray-700 to-gray-900",
  },
  {
    id: 4,
    title: "Fresh Food & Agriculture",
    subtitle: "Farm Fresh Products Direct",
    description: "Quality agricultural products and fresh food items from verified suppliers",
    image: "/placeholder.svg?height=400&width=1200",
    ctaText: "Shop Fresh",
    ctaLink: "/products?category=Food Items",
    backgroundColor: "from-green-600 to-emerald-700",
  },
  {
    id: 5,
    title: "Home & Kitchen Essentials",
    subtitle: "Transform Your Living Space",
    description: "Premium furniture, appliances, and home decor items",
    image: "/placeholder.svg?height=400&width=1200",
    ctaText: "Shop Home",
    ctaLink: "/products?category=Home & Kitchen Appliances",
    backgroundColor: "from-orange-500 to-red-600",
  },
]

export function AdBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [apiAds, setApiAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return

    const adsToShow = apiAds.length > 0 ? apiAds : bannerAds;
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % adsToShow.length)
        setIsTransitioning(false)
      }, 300) // Half of transition duration
    }, 4000) // 4 seconds per slide

    return () => clearInterval(timer)
  }, [isAutoPlaying, apiAds])

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAds();
      if (response.data && response.data.length > 0) {
        setApiAds(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error);
      // Fallback to static ads
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    const adsToShow = apiAds.length > 0 ? apiAds : bannerAds;
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % adsToShow.length)
      setIsTransitioning(false)
    }, 300)
  }

  const prevSlide = () => {
    const adsToShow = apiAds.length > 0 ? apiAds : bannerAds;
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + adsToShow.length) % adsToShow.length)
      setIsTransitioning(false)
    }, 300)
  }

  const goToSlide = (index: number) => {
    if (index === currentSlide) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  const adsToShow = apiAds.length > 0 ? apiAds : bannerAds;
  const currentAd = adsToShow[currentSlide] || bannerAds[0];

  if (loading) {
    return (
      <section className="py-4 px-2 sm:py-6 sm:px-4 md:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500 text-sm sm:text-base">Loading ads...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 px-2 sm:py-6 sm:px-4 md:py-8 bg-gradient-to-br from-gray-50 via-white to-green-200">
      <div className="max-w-7xl mx-auto">
        {/* Banner Container */}
        <div
          className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentAd.image || currentAd.adImage || "/placeholder.svg"}
              alt={currentAd.title || "Advertisement"}
              className={`w-full h-full object-cover object-center transition-opacity duration-600 ease-in-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* <div className={`absolute inset-0 bg-gradient-to-r ${currentAd.backgroundColor || "from-gray-600 to-gray-800"} opacity-80`} /> */}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
              <div className="max-w-2xl text-white">
                {/* <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  {currentAd.title || "Special Offer"}
                </h2>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 opacity-90">
                  {currentAd.subtitle || "Discover amazing deals"}
                </h3>
                <p className="text-lg md:text-xl mb-8 opacity-80 leading-relaxed">
                  {currentAd.description || "Explore our latest products and exclusive offers"}
                </p> */}
                {/* <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                  asChild
                >
                  <a href={currentAd.ctaLink || "/products"}>
                    {currentAd.ctaText || "Shop Now"}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button> */}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {/* <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </Button> */}

          {/* Slide Indicators */}
          {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {adsToShow.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125 shadow-lg" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div> */}

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / adsToShow.length) * 100}%` }}
            />
          </div>

          {/* Ad Label */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm px-2 py-1 sm:px-3 rounded-full border border-white/30">
              Advertisement
            </span>
          </div>
        </div>

        {/* Banner Navigation Thumbnails */}
        {/* <div className="mt-6 flex justify-center space-x-4 overflow-x-auto pb-2">
          {adsToShow.map((ad, index) => (
            <button
              key={ad.id || ad._id || index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentSlide
                  ? "border-orange-500 scale-105 shadow-lg"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img src={ad.image || ad.adImage || "/placeholder.svg"} alt={ad.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div> */}

        {/* Banner Stats */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-1 sm:mb-2">24/7</div>
            <div className="text-sm sm:text-base text-gray-600">Customer Support</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1 sm:mb-2">Trusted</div>
            <div className="text-sm sm:text-base text-gray-600">Verified Vendors</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">Secure</div>
            <div className="text-sm sm:text-base text-gray-600">Payment Gateway</div>
          </div>
        </div>
      </div>
    </section>
  )
}
