
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  User, 
  Book, 
  MessageSquare, 
  Grid3X3,
  Menu,
  X,
  HandCoins,
  Package
} from "lucide-react";

interface AppSidebarProps {
  userType: "admin";
  className?: string;
}

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: BarChart3 },
  { label: "Vendors", path: "/admin/vendors", icon: User },
  { label: "Plans", path: "/admin/plans", icon: Book },
  { label: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  { label: "Categories", path: "/admin/categories", icon: Grid3X3 },
  { label: "Add Product", path: "/admin/add-product", icon: Package },
  { label: "All Transaction", path: "/admin/Transcation", icon: HandCoins  },
  { label: "Settings", path: "/admin/settings", icon: Grid3X3 },
  { label: "My Products", path: "/admin/my-products", icon: Package },
 ,
];

export function AppSidebar({ userType, className }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col",
      collapsed ? "w-12 md:w-16" : "w-64",
      className
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
        {adminLinks.map((link) => {
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
