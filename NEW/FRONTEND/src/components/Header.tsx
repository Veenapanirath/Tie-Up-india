"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Menu, X, User, LogOut, Settings, UserCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProfileUpdateModal } from "./ProfileUpdateModal"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  const getUserDashboardLink = () => {
    if (!user) return "/login";
    
    switch(user.role) {
      case "admin":
        return "/admin";
      case "vendor":
        return "/vendor";
      default:
        return "/user";
    }
  }
  
  const handleLogout = async () => {
    await logout();
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Contact
            </Link>
            <Link to="/signup/vendor">
              <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-6 py-2 rounded-full shadow-md">
                Become a Seller
              </Button>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/products">
              <Button variant="ghost" size="sm" className="hover:bg-orange-50">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-orange-50 rounded-full p-0 h-9 w-9">
                    <Avatar className="h-9 w-9 border-2 border-orange-100">
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-green-600 text-white text-xs">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getUserDashboardLink()} className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:bg-orange-50">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/privacy"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link to="/signup/vendor" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white w-full rounded-full">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
      
      {/* Profile Update Modal */}
      {isAuthenticated && (
        <ProfileUpdateModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          userType={user?.role as 'user' | 'vendor' | 'admin'}
        />
      )}
    </header>
  )
}
