import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
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
  };
  quantity: number;
  unit?: string;
  formattedQuantity?: string;
  subCategory: string;
  isActive: boolean;
  isTrending: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    console.log("navigating");
    
    navigate(`/product/${product._id}`);
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-accent text-black font-medium">
          {product.category?.name}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 text-lg">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          by {product.vendor?.companyName}
        </p>
      
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ₹{product.price}/{product.unit || 'pcs'}
            </span>
           
          </div>
          <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
               {product.quantity}
            </span>
          </div>
          <Button
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
            onClick={handleViewDetail}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
