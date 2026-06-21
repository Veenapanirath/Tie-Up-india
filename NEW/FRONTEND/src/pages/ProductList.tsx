import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, Heart } from "lucide-react";
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import EnquiryModal from '@/components/EnquiryModal';
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Header } from '@/components/Header';
import { ProductCard } from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: {
    name: string;
    _id: string;
    sub_category: Array<{
      name: string;
      _id: string;
    }>;
  };
  vendor: {
    signupPerson: {
      phone: string;
      name: string;
      designation: string;
    };
    companyName: string;
    isVerified?: boolean;
  };
  quantity: number;
  unit?: string;
  formattedQuantity?: string;
  subCategory: string;
  isActive: boolean;
  isTrending: boolean
}

export default function ProductList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [userFavorites, setUserFavorites] = useState<string[]>([]);


  useEffect(() => {
  const urlCategory = searchParams.get('category');
  if (urlCategory) {
    setSelectedCategory(urlCategory);
  }
}, [searchParams]);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  // Fetch user favorites if logged in
  useEffect(() => {
    if (user) {
      fetchUserFavorites();
    }
  }, [user]);

  const fetchUserFavorites = async () => {
    try {
      const response = await userService.getFavorites();
      const favoriteIds = response.data?.favorites?.map((fav: any) => fav.product._id) || [];
      setUserFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const products = (productsData as any)?.data || [];
  const categories = (categoriesData as any)?.data || [];

  // Get subcategories for selected category
  const selectedCategoryLower = selectedCategory?.toLowerCase();
  const availableSubCategories = selectedCategory === 'all'
    ? []
    : categories
        .find((cat: any) => (cat?.name || '').toLowerCase() === selectedCategoryLower)
        ?.sub_category || [];

  const filteredProducts = products
    .filter((product: Product) => {
      const productName = (product?.name || '').toString();
      const productDescription = (product?.description || '').toString();
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const price = Number(product?.price ?? 0);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      const productCategoryName = typeof (product as any)?.category === 'object'
        ? ((product as any)?.category?.name || '')
        : ((product as any)?.category || '');
      const matchesCategory = selectedCategory === 'all'
        || (productCategoryName && productCategoryName.toLowerCase() === selectedCategoryLower);

      const matchesSubCategory = selectedSubCategory === 'all'
        || ((product as any)?.subCategory || '').toLowerCase() === selectedSubCategory.toLowerCase();

      const isActive = product?.isActive === true;
      return isActive && matchesSearch && matchesPrice && matchesCategory && matchesSubCategory;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleEnquiry = (product: Product) => {
    setSelectedProduct(product);
    setShowEnquiryModal(true);
  };

  const handleAddToFavorites = async (productId: string) => {
    if (!user) {
      toast({
        title: "Info",
        description: "Please login to add products to favorites",
        variant: "default",
      });
      return;
    }

    try {
      await userService.addToFavorites(productId);
      setUserFavorites(prev => [...prev, productId]);
      toast({
        title: "Success",
        description: "Product added to favorites successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add to favorites",
        variant: "destructive",
      });
    }
  };

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubCategory('all');
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
 {/* Hero Section */}
<div className="relative py-16 px-4 overflow-hidden">
  {/* Background Image with Blur */}
  <div className="absolute inset-0 bg-[url('/assets/bg.jpg')] bg-cover bg-center blur-sm opacity-95 z-0"></div>

  {/* Overlay (optional for extra blur effect) */}
  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto text-center">
      <h1 className="font-libertinus text-6xl  font-bold text-white mb-6">
      Shop
    </h1>

  
    <p className="text-xl text-gray-400 mb-8">
      Give All You Need
    </p>

    {/* Search Bar */}
    <div className="max-w-2xl mx-auto relative">
      <Input
        type="text"
        placeholder="Search on Tie-Up-India"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-12 pr-20 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-primary"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Button className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full px-6">
        Search
      </Button>
    </div>
  </div>
</div>

        {/* <div className='border-r-4 p-10 bg-red-400 mx-24 rounded-lg -mt-10 z-20'>

                </div> */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category: any) => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory Filter */}
                {availableSubCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Subcategories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subcategories</SelectItem>
                        {availableSubCategories.map((subCat: any) => (
                          <SelectItem key={subCat._id} value={subCat.name}>
                            {subCat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>₹0</span>
                    <span>₹10,000</span>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

              
          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredProducts ? filteredProducts.length : 0} products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts && filteredProducts.length > 0 ? filteredProducts.map((product: Product) => (
                <Card key={product._id} className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : product.image || '/placeholder.svg'} 
                      alt={product.name || 'Product image'}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    />
                    <Badge className="absolute top-3 right-3 bg-primary text-white">
                      {product?.category && typeof (product as any).category === 'object' ? (product as any).category?.name : ((product as any).category || 'Uncategorized')}
                    </Badge>
                    {product.vendor && (
                      <Badge 
                      className={
                        `absolute top-3 left-3 ${
                          product.vendor.isVerified 
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        }`
                      }
                    >
                      {product.vendor.isVerified ? "✓ Verified" : "Pending"}
                    </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name || 'Unnamed Product'}
                    </h3>
                    <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl md:text-xl lg:text-xl font-bold text-primary">
                        ₹{product.price || 0}/{product.unit || "pcs"}
                      </span>
                    </div>
                      <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 bg-orange-50 px-2 py-1 rounded-md">
                           {product.quantity || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          by {product.vendor?.companyName || 'Unknown Vendor'}
                        </p>

                      
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">5.0 (1.2k Reviews)</span>
                        </div>
                      </div>
                    </div>
                    {product.subCategory && (
                      <Badge variant="secondary" className="mb-3">
                        {product.subCategory}
                      </Badge>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEnquiry(product)}
                      >
                        Enquiry
                      </Button>
                      <Button 
                        size="sm" 
                        variant={userFavorites.includes(product._id) ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleAddToFavorites(product._id)}
                        disabled={userFavorites.includes(product._id)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${userFavorites.includes(product._id) ? 'fill-current' : ''}`} />
                        {userFavorites.includes(product._id) ? 'Favorited' : 'Favorite'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No products available</p>
                </div>
              )}
            </div>

            {filteredProducts && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-6">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedSubCategory('all');
                    setPriceRange([0, 1000000]);
                    setSortBy('name');
                  }}
                >
                  Clear filters and show all products
                </Button>
                {products && products.length > 0 && (
                  <div className="mt-10 text-left">
                    <h3 className="text-lg font-semibold mb-4">Explore popular products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.slice(0, 8).map((p: any) => (
                        <ProductCard key={p._id} product={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        product={selectedProduct}
        isLoggedIn={false} // TODO: Replace with actual auth status
      />
    </div>
  );
}

