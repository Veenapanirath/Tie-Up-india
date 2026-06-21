
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: number;
  name: string;
  image: string;
  productCount: number;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-xl font-bold mb-1">{category.name}</h3>
            <p className="text-sm opacity-90">{category.productCount} products</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
