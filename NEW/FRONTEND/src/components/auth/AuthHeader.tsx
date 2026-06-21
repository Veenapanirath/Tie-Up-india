import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";

interface AuthHeaderProps {
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

export function AuthHeader({
  showBackButton = true,
  backTo = "/",
  title,
}: AuthHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link to={backTo}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            )}
             {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/Tie-UP-India.png" alt="Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold">
              <span className="text-orange-500">Tie</span>
              {/* <span className="text-gray-700">-</span> */}
              {/* <span className="text-blue-200 text-stroke-sm">Up</span> */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                  Up
                </span>
              {/* <span className="text-gray-700">-</span> */}
              <span className="text-green-600">India</span>
            </span>
          </Link>
            {title && (
              <div className="hidden md:block">
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-700 font-medium">{title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup/user">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
