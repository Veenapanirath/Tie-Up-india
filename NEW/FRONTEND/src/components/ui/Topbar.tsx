
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TopbarProps {
  userName: string;
  userType: "admin" | "vendor";
}

export function Topbar({ userName, userType }: TopbarProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {userType === "admin" ? "Admin Dashboard" : "Vendor Dashboard"}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-primary text-white">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-xl border border-gray-200" align="end">
            <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50">
              <User className="h-4 w-4" />
              <span>{userName}</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
