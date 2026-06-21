
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {

  const navigate = useNavigate();

  return (

    // bg-gradient-to-t from-green-600 to-white text-white py-12 px-6
    <section className="bg-gradient-to-br from-orange-200 via-white  to-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Discover Amazing Products from 
          <span className="text-primary"> Local Vendors</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with trusted vendors and discover unique products in your area. 
          Join our marketplace to buy or sell with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/products")}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-semibold shadow-xl transition-all duration-200 hover:scale-105"
          >
            Shop Now
          </Button>
          <Button 
            onClick={() => navigate("/signup/vendor")}
            variant="outline" 
            size="lg" 
            className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105"
          >
            Become a Vendor
          </Button>
        </div>
      </div>
    </section>
  );
}
