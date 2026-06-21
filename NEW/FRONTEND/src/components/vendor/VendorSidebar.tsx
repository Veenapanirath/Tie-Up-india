
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Package,
  Calendar,
  List,
  MessageSquare,
  Menu,
  X
} from "lucide-react";

const vendorLinks = [
  { label: "Dashboard", path: "/vendor", icon: BarChart3 },
  { label: "Add Product", path: "/vendor/add-product", icon: Package },
  { label: "My Products", path: "/vendor/products", icon: List },
  { label: "Enquiries", path: "/vendor/enquiries", icon: MessageSquare },
  { label: "My Plan", path: "/vendor/plan", icon: Calendar },
];

export function VendorSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col",
      collapsed ? "w-12 md:w-16" : "w-64"
    )}>
      <div className="p-2 md:p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <NavLink to="/">
            <h2 className="font-bold text-lg md:text-xl">
              <span className="text-orange-500">Tie</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">Up</span>
              <span className="text-green-600">India</span>
            </h2>
          </NavLink>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-gray-100"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2">
        {vendorLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center px-2 md:px-3 py-2 rounded-xl md:rounded-2xl transition-all duration-200 hover:scale-105",
                isActive 
                  ? "bg-primary text-white shadow-md" 
                  : "text-gray-700 hover:bg-gray-100",
                collapsed ? "justify-center" : "space-x-2 md:space-x-3"
              )}
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium text-sm md:text-base">{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
