
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Building2, Users, Phone, Mail } from "lucide-react";
import { vendorAdminService, VendorInfo } from "@/services/vendorAdminService";
import { toast } from "@/hooks/use-toast";

export default function AdminVendors() {
  const [vendors, setVendors] = useState<VendorInfo[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.signupPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.signupPerson.phone.includes(searchTerm) ||
      vendor.officialMail.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [searchTerm, vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorAdminService.getAllVendors();
      setVendors(response.data || []);
      setFilteredVendors(response.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (vendorId: string) => {
    navigate(`/admin/vendors/${vendorId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          Vendor Management
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Manage and monitor all registered vendors
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Search className="h-4 w-4 md:h-5 md:w-5" />
            Search Vendors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by company name, contact person, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm md:text-base"
              />
            </div>
            <Button 
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="w-full sm:w-auto text-sm md:text-base"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-lg md:text-2xl font-bold">{vendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Verified Vendors</p>
                <p className="text-lg md:text-2xl font-bold">{vendors.filter(v => v.isVerified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Search Results</p>
                <p className="text-lg md:text-2xl font-bold">{filteredVendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">All Vendors ({filteredVendors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {filteredVendors.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-muted-foreground text-sm md:text-base">
                No vendors found matching your search criteria.
              </div>
            ) : (
              filteredVendors.map((vendor) => (
                <div 
                  key={vendor._id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                      {vendor.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">{vendor.companyName}</h4>
                      <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {vendor.signupPerson.name} ({vendor.signupPerson.designation})
                      </p>
                      <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                        {vendor.signupPerson.phone && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {vendor.signupPerson.phone}
                          </span>
                        )}
                        {vendor.officialMail && (
                          <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3" />
                            {vendor.officialMail}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {vendor.numberOfProducts} products • Team: {vendor.teamSize} • {vendor.firmType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          vendor.isVerified
                            ? "bg-green-100 text-green-800 border border-green-300 text-xs"
                            : "bg-gray-100 text-gray-800 border border-gray-300 text-xs"
                        }
                      >
                        {vendor.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    <Button 
                      size="sm"
                      onClick={() => handleViewDetails(vendor.userId)}
                      className="flex items-center gap-1 text-xs md:text-sm"
                    >
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
