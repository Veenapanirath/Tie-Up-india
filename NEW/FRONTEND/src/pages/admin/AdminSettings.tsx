import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { Search, Filter, Star, Package, ShoppingBag } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  image?: string;
  sub_category: Array<{
    name: string;
    _id: string;
  }>;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  images?: string[];
  description: string;
  quantity: number;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory?: string;
  vendor: {
    companyName: string;
    _id: string;
  };
  isActive: boolean;
  isTrending: boolean;
  unit?: string;
  formattedQuantity?: string;
}

export default function AdminSettings() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const [updatingTrending, setUpdatingTrending] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  useEffect(() => {
    filterProducts();
  }, [products, productSearchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        productService.getCategories(),
        productService.getProducts()
      ]);
      
      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const filterProducts = () => {
    let filtered = products;

    if (productSearchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.vendor?.companyName?.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryTrendingToggle = async (categoryId: string, isTrending: boolean) => {
    setUpdatingTrending(categoryId);
    try {
      await productService.setTrendingCategory(categoryId, isTrending);
      
      setCategories(prev => prev.map(category => 
        category._id === categoryId 
          ? { ...category, isTrending }
          : category
      ));

      toast({
        title: "Success",
        description: `Category ${isTrending ? 'marked as' : 'removed from'} trending`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update trending status",
        variant: "destructive",
      });
    } finally {
      setUpdatingTrending(null);
    }
  };

  const handleProductTrendingToggle = async (productId: string, isTrending: boolean) => {
    setUpdatingTrending(productId);
    try {
      await productService.setTrendingProduct(productId, isTrending);
      
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, isTrending }
          : product
      ));

      toast({
        title: "Success",
        description: `Product ${isTrending ? 'marked as' : 'removed from'} trending`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update trending status",
        variant: "destructive",
      });
    } finally {
      setUpdatingTrending(null);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2">Manage trending items and other settings</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => window.location.href = '/admin/ads'} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Manage Ads
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin/brands'} 
            className="bg-green-600 hover:bg-green-700"
          >
            Manage Brands
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">
            <Package className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="products">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Trending Categories Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <Card key={category._id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 relative">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      {category.isTrending && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                          <Star className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">
                          {category.sub_category?.length || 0} subcategories
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Mark as Trending
                        </span>
                        <Switch
                          checked={category.isTrending}
                          onCheckedChange={(checked) => handleCategoryTrendingToggle(category._id, checked)}
                          disabled={updatingTrending === category._id}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No categories found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Trending Products Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products or vendors..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product._id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isTrending && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                          <Star className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        by {product.vendor?.companyName || 'Unknown Vendor'}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-primary">
                          ₹{product.price}/{product.unit || 'pcs'}
                        </span>
                        <Badge variant="outline">
                          {product.category?.name}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Mark as Trending
                        </span>
                        <Switch
                          checked={product.isTrending}
                          onCheckedChange={(checked) => handleProductTrendingToggle(product._id, checked)}
                          disabled={updatingTrending === product._id}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No products found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}