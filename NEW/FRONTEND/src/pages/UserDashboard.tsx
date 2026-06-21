import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Heart, 
  Edit, 
  Save,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { userService, UserEnquiry, UserFavorite, UserProfile } from "@/services/userService";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<UserEnquiry[]>([]);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    currentPassword: "",
    newPassword: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, favoritesRes] = await Promise.all([
        userService.getUserDashboard(),
        userService.getFavorites()
      ]);
      
      setEnquiries(dashboardRes.data?.enquiries || []);
      setFavorites(favoritesRes.data?.favorites || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await userService.updateProfile(profileForm);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setOpenEditProfile(false);
      // Update local user data if needed
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await userService.removeFromFavorites(productId);
      setFavorites(prev => prev.filter(fav => fav.product._id !== productId));
      toast({
        title: "Success",
        description: "Product removed from favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Waiting</Badge>;
      case 'in process':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />In Process</Badge>;
      case 'done':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Done</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading user dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4 lg:p-6">
      {/* Header */}
      <Header />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <Dialog open={openEditProfile} onOpenChange={setOpenEditProfile}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 md:space-y-4">
              <div>
                <Label className="text-sm md:text-base">Name</Label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Email</Label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Phone</Label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Address</Label>
                <Input
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Current Password</Label>
                <Input
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                  placeholder="Required for password change"
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">New Password</Label>
                <Input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                  placeholder="Leave blank to keep current"
                  className="text-sm md:text-base"
                />
              </div>
              <Button onClick={handleProfileUpdate} className="w-full text-sm md:text-base">
                <Save className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <AnalyticsCard
          title="Total Enquiries"
          value={enquiries.length.toString()}
          icon={<ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />}
          description="Your product enquiries"
          trend="neutral"
        />
        <AnalyticsCard
          title="Favorites"
          value={favorites.length.toString()}
          icon={<Heart className="h-4 w-4 md:h-5 md:w-5" />}
          description="Saved products"
          trend="neutral"
        />
        <AnalyticsCard
          title="Active Enquiries"
          value={enquiries.filter(e => e.status === 'waiting' || e.status === 'in process').length.toString()}
          icon={<Clock className="h-4 w-4 md:h-5 md:w-5" />}
          description="Pending responses"
          trend="neutral"
        />
      </div>

      <Tabs defaultValue="enquiries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enquiries" className="text-xs md:text-sm">My Enquiries</TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs md:text-sm">My Favorites</TabsTrigger>
        </TabsList>

        {/* Enquiries Tab */}
        <TabsContent value="enquiries" className="space-y-4 md:space-y-6">
          {enquiries.length === 0 ? (
            <Card>
              <CardContent className="p-6 md:p-8 text-center">
                <ShoppingCart className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
                <p className="text-base md:text-lg font-medium text-foreground">No enquiries yet</p>
                <p className="text-sm md:text-base text-muted-foreground">Start exploring products and send enquiries</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {enquiries.map((enquiry) => {
                // Skip rendering if product is null or undefined
                if (!enquiry.product) {
                  return null;
                }
                
                return (
                  <Card key={enquiry._id}>
                    <CardContent className="p-3 md:p-4">
                      <div className="flex gap-3 md:gap-4">
                        <img 
                          src={enquiry.product.images && enquiry.product.images.length > 0 ? enquiry.product.images[0] : enquiry.product.image} 
                          alt={enquiry.product.name || 'Product'}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          {/* Product details */}
                          <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 truncate">
                            {enquiry.product.name || 'Unnamed Product'}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 md:mb-2 gap-1">
                            <span className="text-sm md:text-lg font-bold text-primary">
                              ₹{enquiry.product.price || 0}/{enquiry.product.unit || 'pcs'}
                            </span>
                            {getStatusBadge(enquiry.status)}
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                            Quantity: {enquiry.quantity || 1}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </p>

                          {/* ✅ Vendor details */}
                          {enquiry.product.vendor && (
                            <div className="mt-2 md:mt-3 border-t pt-2 text-xs md:text-sm text-gray-700">
                              <p className="font-medium">Vendor Details:</p>
                              <p className="truncate">👤 {enquiry.product.vendor.signupPerson?.name || 'N/A'} ({enquiry.product.vendor.signupPerson?.designation || 'N/A'})</p>
                              <p className="truncate">🏢 {enquiry.product.vendor.companyName || 'N/A'}</p>
                              <p className="truncate">📞 {enquiry.product.vendor.signupPerson?.phone || enquiry.product.vendor.officialPhone || "N/A"}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-4 md:space-y-6">
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="p-6 md:p-8 text-center">
                <Heart className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
                <p className="text-base md:text-lg font-medium text-foreground">No favorites yet</p>
                <p className="text-sm md:text-base text-muted-foreground">Save products you like to your favorites</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {favorites.map((favorite) => {
                // Skip rendering if product is null or undefined
                if (!favorite.product) {
                  return null;
                }
                
                return (
                  <Card key={favorite._id}>
                    <CardContent className="p-3 md:p-4">
                      <div className="aspect-square bg-gray-100 relative mb-3 md:mb-4">
                        <img
                          src={favorite.product.images && favorite.product.images.length > 0 ? favorite.product.images[0] : favorite.product.image}
                          alt={favorite.product.name || 'Product'}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1.5 right-1.5 md:top-2 md:right-2 h-6 w-6 md:h-8 md:w-8 p-0"
                          onClick={() => handleRemoveFavorite(favorite.product._id)}
                        >
                          <XCircle className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 line-clamp-1">
                        {favorite.product.name || 'Unnamed Product'}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2">
                        {favorite.product.description || 'No description available'}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <span className="text-sm md:text-lg font-bold text-primary">
                          ₹{favorite.product.price || 0}/{favorite.product.unit || 'pcs'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {favorite.product.category?.name || 'Uncategorized'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 md:mb-3">
                        Added: {new Date(favorite.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2 md:mt-3">
                        <Button 
                          onClick={() => navigate(`/product/${favorite.product._id}`)}
                          className="w-full text-xs md:text-sm"
                          size="sm"
                        >
                          View Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
