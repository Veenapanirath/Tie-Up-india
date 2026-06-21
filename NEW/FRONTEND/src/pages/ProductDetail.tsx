import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Package, MapPin, Heart, ChevronDown, ChevronUp } from "lucide-react";
import EnquiryModal from "@/components/EnquiryModal";
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  highlight?: string[];
  unit?: string;
  formattedQuantity?: string;
  category: {
    name: string;
    _id: string;
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
  subCategory: string;
  isActive: boolean;
  isTrending: boolean;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  console.log("id" , id);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && user) {
      checkIfInFavorites();
    }
  }, [product, user]);

  const checkIfInFavorites = async () => {
    try {
      const response = await userService.getFavorites();
      const favoriteIds = response.data?.favorites?.map((fav: any) => fav.product._id) || [];
      setIsInFavorites(favoriteIds.includes(product?._id));
    } catch (error) {
      console.error('Failed to check favorites:', error);
    }
  };

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleEnquiry = () => {
    setShowEnquiryModal(true);
  };

  const handleAddToFavorites = async (productId: string) => {
    if (!user) {
      toast.error("Please login to add products to favorites");
      return;
    }

    try {
      await userService.addToFavorites(productId);
      setIsInFavorites(true);
      toast.success("Product added to favorites successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add to favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product not found</h2>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
              <img
                src={product.images && product.images.length > 0 ? product.images[selectedImageIndex] : product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer
                      ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {product.category?.name}
                </Badge>
                {product.isTrending && (
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    Trending
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              <div className="space-y-3 mb-4">
                <div className="text-4xl font-bold text-primary">
                  ₹{product.price?.toLocaleString()}/{product.unit || 'pcs'}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-700 bg-green-50 px-3 py-2 rounded-lg">
                    📦 Stock: {product.quantity}
                  </span>
                  <span className="text-sm text-gray-600">
                    by {product.vendor?.companyName}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Description</h3>
                <div className="space-y-3">
                  <p className={`text-muted-foreground leading-relaxed transition-all duration-300 ${
                    isDescriptionExpanded ? '' : 'line-clamp-3'
                  }`}>
                    {product.description}
                  </p>
                  {product.description && product.description.length > 150 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                    >
                      {isDescriptionExpanded ? (
                        <>
                          Show Less
                          <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View Details
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            {product.highlight && product.highlight.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">Key Highlights</h3>
                  <div className="space-y-2">
                    {product.highlight.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vendor Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Vendor Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium text-foreground">
                      {product.vendor?.companyName}
                    </span>
                    {product.vendor?.isVerified !== undefined && (
                      <Badge 
                      className={
                        product.vendor.isVerified
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-gray-100 text-gray-800 border border-gray-300"
                      }
                      // variant={product.vendor.isVerified ? "default" : "secondary"}
                      >
                        {product.vendor.isVerified ? "✓ Verified" : "Pending"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Contact Person:</span>
                    <span className="font-medium text-foreground">
                      {product.vendor?.signupPerson?.name} ({product.vendor?.signupPerson?.designation})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {product.quantity}
                    </div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {product.isActive ? "Active" : "Inactive"}
                    </div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleEnquiry}
                  className="flex-1 h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Send Enquiry
                </Button>
                <Button
                  variant={isInFavorites ? "default" : "outline"}
                  size="lg"
                  className="h-12 px-4"
                  onClick={() => handleAddToFavorites(product._id)}
                  disabled={isInFavorites}
                >
                  <Heart className={`h-5 w-5 ${isInFavorites ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                Contact the vendor directly for pricing and availability
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        product={product}
        isLoggedIn={!!user}
      />
    </div>
  );
}