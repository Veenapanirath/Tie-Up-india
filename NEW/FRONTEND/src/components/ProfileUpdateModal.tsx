import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, User, Mail, Phone, MapPin, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { userService, UserProfile } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userType: 'user' | 'vendor' | 'admin';
}

export function ProfileUpdateModal({ isOpen, onClose, onSuccess, userType }: ProfileUpdateModalProps) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    currentPassword: "",
    newPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileForm.name || !profileForm.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    if (profileForm.newPassword && !profileForm.currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required to set a new password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Use the appropriate service based on user type
      let response;
      if (userType === 'user') {
        response = await userService.updateProfile(profileForm);
      } else if (userType === 'vendor') {
        // For vendor, we might need a different service
        response = await userService.updateProfile(profileForm);
      } else {
        // For admin, we might need a different service
        response = await userService.updateProfile(profileForm);
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Update the user in context if needed
      if (updateUser && response?.data?.user) {
        updateUser(response.data.user);
      }

      // Reset password fields
      setProfileForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: ""
      }));

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
              placeholder="Your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </Label>
            <Input
              id="phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              placeholder="Your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input
              id="address"
              value={profileForm.address}
              onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
              placeholder="Your address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={profileForm.currentPassword}
              onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
              placeholder="Required to change password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={profileForm.newPassword}
              onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
              placeholder="Leave blank to keep current"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
