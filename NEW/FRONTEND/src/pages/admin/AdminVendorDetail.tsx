import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  FileText,
  Users,
  TrendingUp,
  ShoppingCart,
  Save,
  Plus,
  Delete,
  Download,
  ImageIcon,
  Upload,
  Loader2
} from "lucide-react";
import { vendorAdminService, VendorDetailResponse } from "@/services/vendorAdminService";
import { productService } from "@/services/productService";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export default function AdminVendorDetail() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState<VendorDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [editSubscriptionOpen, setEditSubscriptionOpen] = useState(false);
  const [editEnquiryOpen, setEditEnquiryOpen] = useState(false);
  const [editVendorOpen, setEditVendorOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [subscriptionForm, setSubscriptionForm] = useState({
    startDate: "",
    endDate: "",
    remainingProductCount: 0,
    amountPaid: 0
  });
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    phoneno: "",
    highlight: [""],
    unit: "pcs"
  });

  const [vendorForm, setVendorForm] = useState({
    companyName: "",
    firmType: "",
    companyAddress: "",
    officialPhone: "",
    officialMail: "",
    category: "",
    products: "",
    numberOfProducts: 0,
    annualIncome: 0,
    gstNumber: "",
    website: "",
    teamSize: 0,
    signupPerson: {
      name: "",
      designation: "",
      phone: ""
    }
  });

  // Helper function to check if document is PDF
  const isPDFDocument = (documentUrl: string) => {
    return documentUrl.toLowerCase().includes('.pdf') || 
           documentUrl.includes('attachment=true') ||
           documentUrl.includes('/raw/download');
  };

  // Function to download PDF document
  const handleDownloadDocument = async (documentUrl: string, fileName?: string) => {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = fileName || 'company-document.pdf';
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Document download started",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetail();
    }
  }, [vendorId]);

  const fetchVendorDetail = async () => {
    try {
      setLoading(true);
      const response = await vendorAdminService.getVendorDetail(vendorId!);
      setVendorData(response);
      
      // Initialize vendor form
      if (response.vendorInfo) {
        setVendorForm({
          companyName: response.vendorInfo.companyName || "",
          firmType: response.vendorInfo.firmType || "",
          companyAddress: response.vendorInfo.companyAddress || "",
          officialPhone: response.vendorInfo.officialPhone || "",
          officialMail: response.vendorInfo.officialMail || "",
          category: response.vendorInfo.category || "",
          products: response.vendorInfo.products || "",
          numberOfProducts: response.vendorInfo.numberOfProducts || 0,
          annualIncome: response.vendorInfo.annualIncome || 0,
          gstNumber: response.vendorInfo.gstNumber || "",
          website: response.vendorInfo.website || "",
          teamSize: response.vendorInfo.teamSize || 0,
          signupPerson: {
            name: response.vendorInfo.signupPerson?.name || "",
            designation: response.vendorInfo.signupPerson?.designation || "",
            phone: response.vendorInfo.signupPerson?.phone || ""
          }
        });
      }
      
      // Initialize subscription form
      if (response.subscription) {
        setSubscriptionForm({
          startDate: response.subscription.startDate.split('T')[0],
          endDate: response.subscription.endDate.split('T')[0],
          remainingProductCount: response.subscription.remainingProductCount,
          amountPaid: response.subscription.amountPaid
        });
      } else {
        // Reset form when no subscription
        setSubscriptionForm({
          startDate: "",
          endDate: "",
          remainingProductCount: 0,
          amountPaid: 0
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vendor details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async () => {
    try {
      if (!vendorData?.subscription) return;
      
      await vendorAdminService.updateSubscription(vendorData.subscription._id, subscriptionForm);
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
      setEditSubscriptionOpen(false);
      fetchVendorDetail();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEnquiry = async (status: string) => {
    try {
      if (!selectedEnquiry) return;
      
      await vendorAdminService.updateEnquiry(selectedEnquiry._id, { status });
      toast({
        title: "Success",
        description: "Enquiry updated successfully",
      });
      setEditEnquiryOpen(false);
      setSelectedEnquiry(null);
      fetchVendorDetail();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enquiry",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    try {
      await vendorAdminService.deleteEnquiry(enquiryId);
      toast({
        title: "Success",
        description: "Enquiry deleted successfully",
      });
      fetchVendorDetail();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete enquiry",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVendor = async () =>
  {
    try {
      await vendorAdminService.deleteVendor(vendorId!);
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
      navigate("/admin/vendors");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  }

  const handleToggleVerification = async (isVerified: boolean) => {
    try {
      await vendorAdminService.updateVendorDetails(vendorId!, { isVerified: isVerified});
      toast({
        title: "Success",
        description: `Vendor ${isVerified ? 'verified' : 'unverified'} successfully`,
      });
      fetchVendorDetail();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVendorDetails = async () => {
    try {
      await vendorAdminService.updateVendorDetails(vendorId!, vendorForm);
      toast({
        title: "Success",
        description: "Vendor details updated successfully",
      });
      setEditVendorOpen(false);
      fetchVendorDetail();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vendor details",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading vendor details...</div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Vendor not found</div>
      </div>
    );
  }

  const totalProductValue = vendorData.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const activeProducts = vendorData.products.filter(p => p.isActive).length;
  const trendingProducts = vendorData.products.filter(p => p.isTrending).length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/vendors")}
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold">{vendorData.vendorInfo.companyName}</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Vendor Details & Management</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full sm:w-auto">
            <Button 
              variant="outline"
              onClick={() => setEditVendorOpen(true)}
              className="w-full sm:w-auto text-xs md:text-sm"
            >
              <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Edit Details
            </Button>

            <Button 
              variant="destructive"
              onClick={handleDeleteVendor}
              className="w-full sm:w-auto text-xs md:text-sm"
            >
              <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Delete Vendor
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 w-full sm:w-auto">
            <Badge variant={vendorData.vendorInfo.isVerified ? "default" : "secondary"} className="text-xs">
              {vendorData.vendorInfo.isVerified ? "Verified" : "Pending Verification"}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-medium">Verification:</span>
              <Switch
                checked={vendorData.vendorInfo.isVerified}
                onCheckedChange={handleToggleVerification}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <AnalyticsCard
          title="Total Products"
          value={vendorData.products.length.toString()}
          icon={<Package className="h-4 w-4 md:h-5 md:w-5" />}
          description={`${activeProducts} active`}
          trend="neutral"
        />
        <AnalyticsCard
          title="Total Product Value"
          value={`₹${totalProductValue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5" />}
          description="Inventory value"
          trend="neutral"
        />
        <AnalyticsCard
          title="Active Enquiries"
          value={vendorData.enquiries.length.toString()}
          icon={<ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />}
          description={`${vendorData.enquiries.filter(e => e.status === 'waiting').length} pending`}
          trend="neutral"
        />
        <AnalyticsCard
          title="Trending Products"
          value={trendingProducts.toString()}
          icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5" />}
          description={`${Math.round((trendingProducts/vendorData.products.length)*100)}% of products`}
          trend="neutral"
        />
      </div>

      {/* Edit Vendor Dialog */}
      <Dialog open={editVendorOpen} onOpenChange={setEditVendorOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg md:text-xl">Edit Vendor Details</DialogTitle>
          </DialogHeader>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-1 md:p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <Label className="text-sm md:text-base">Company Name</Label>
                <Input
                  value={vendorForm.companyName}
                  onChange={(e) => setVendorForm({...vendorForm, companyName: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Firm Type</Label>
                <Select 
                  value={vendorForm.firmType} 
                  onValueChange={(value) => setVendorForm({...vendorForm, firmType: value})}
                >
                  <SelectTrigger className="text-sm md:text-base">
                    <SelectValue placeholder="Select firm type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proprietorship">Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llp">LLP</SelectItem>
                    <SelectItem value="private_limited">Private Limited</SelectItem>
                    <SelectItem value="public_limited">Public Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm md:text-base">Company Address</Label>
                <Input
                  value={vendorForm.companyAddress}
                  onChange={(e) => setVendorForm({...vendorForm, companyAddress: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Official Phone</Label>
                <Input
                  value={vendorForm.officialPhone}
                  onChange={(e) => setVendorForm({...vendorForm, officialPhone: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Official Email</Label>
                <Input
                  value={vendorForm.officialMail}
                  onChange={(e) => setVendorForm({...vendorForm, officialMail: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Category</Label>
                <Input
                  value={vendorForm.category}
                  onChange={(e) => setVendorForm({...vendorForm, category: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Products</Label>
                <Input
                  value={vendorForm.products}
                  onChange={(e) => setVendorForm({...vendorForm, products: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Number of Products</Label>
                <Input
                  type="number"
                  value={vendorForm.numberOfProducts}
                  onChange={(e) => setVendorForm({...vendorForm, numberOfProducts: parseInt(e.target.value) || 0})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Annual Income</Label>
                <Input
                  type="number"
                  value={vendorForm.annualIncome}
                  onChange={(e) => setVendorForm({...vendorForm, annualIncome: parseInt(e.target.value) || 0})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">GST Number</Label>
                <Input
                  value={vendorForm.gstNumber}
                  onChange={(e) => setVendorForm({...vendorForm, gstNumber: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Website</Label>
                <Input
                  value={vendorForm.website}
                  onChange={(e) => setVendorForm({...vendorForm, website: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Team Size</Label>
                <Input
                  type="number"
                  value={vendorForm.teamSize}
                  onChange={(e) => setVendorForm({...vendorForm, teamSize: parseInt(e.target.value) || 0})}
                  className="text-sm md:text-base"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <h3 className="font-medium mb-2 text-sm md:text-base">Contact Person Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <Label className="text-sm md:text-base">Name</Label>
                    <Input
                      value={vendorForm.signupPerson.name}
                      onChange={(e) => setVendorForm({
                        ...vendorForm, 
                        signupPerson: {...vendorForm.signupPerson, name: e.target.value}
                      })}
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm md:text-base">Designation</Label>
                    <Input
                      value={vendorForm.signupPerson.designation}
                      onChange={(e) => setVendorForm({
                        ...vendorForm, 
                        signupPerson: {...vendorForm.signupPerson, designation: e.target.value}
                      })}
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm md:text-base">Phone</Label>
                    <Input
                      value={vendorForm.signupPerson.phone}
                      onChange={(e) => setVendorForm({
                        ...vendorForm, 
                        signupPerson: {...vendorForm.signupPerson, phone: e.target.value}
                      })}
                      className="text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed Footer */}
          <div className="flex-shrink-0 flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setEditVendorOpen(false)}
              className="text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateVendorDetails}
              className="text-sm md:text-base"
            >
              <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
                      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-10">
          <TabsTrigger value="info" className="text-xs md:text-sm py-2 md:py-0">Vendor Info</TabsTrigger>
          <TabsTrigger value="products" className="text-xs md:text-sm py-2 md:py-0">Products</TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs md:text-sm py-2 md:py-0">Subscription</TabsTrigger>
          <TabsTrigger value="enquiries" className="text-xs md:text-sm py-2 md:py-0">Enquiries</TabsTrigger>
        </TabsList>

        {/* Vendor Info Tab */}
        <TabsContent value="info" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Building2 className="h-4 w-4 md:h-5 md:w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div>
                  <Label className="text-xs md:text-sm font-medium">Company Name</Label>
                  <p className="text-sm md:text-lg">{vendorData.vendorInfo.companyName}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">Firm Type</Label>
                  <p className="text-sm md:text-base">{vendorData.vendorInfo.firmType}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">Address</Label>
                  <p className="text-sm md:text-base">{vendorData.vendorInfo.companyAddress}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">Category</Label>
                  <p className="text-sm md:text-base">{vendorData.vendorInfo.category}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">Products</Label>
                  <p className="text-sm md:text-base">{vendorData.vendorInfo.products}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">GST Number</Label>
                  <p className="text-sm md:text-base">{vendorData.vendorInfo.gstNumber}</p>
                </div>
                {vendorData.vendorInfo.website && (
                  <div>
                    <Label className="text-xs md:text-sm font-medium">Website</Label>
                    <p className="text-sm md:text-base text-blue-600">{vendorData.vendorInfo.website}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div>
                  <Label className="text-xs md:text-sm font-medium">Contact Person</Label>
                  <p className="text-sm md:text-lg">{vendorData.vendorInfo.signupPerson.name}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">Designation</Label>
                  <p className="text-sm md:text-base">{vendorData.vendorInfo.signupPerson.designation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 md:h-4 md:w-4" />
                  <div>
                    <Label className="text-xs md:text-sm font-medium">Phone</Label>
                    <p className="text-sm md:text-base">{vendorData.vendorInfo.signupPerson.phone}</p>
                  </div>
                </div>
                {vendorData.vendorInfo.officialPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 md:h-4 md:w-4" />
                    <div>
                      <Label className="text-xs md:text-sm font-medium">Official Phone</Label>
                      <p className="text-sm md:text-base">{vendorData.vendorInfo.officialPhone}</p>
                    </div>
                  </div>
                )}
                {vendorData.vendorInfo.officialMail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 md:h-4 md:w-4" />
                    <div>
                      <Label className="text-xs md:text-sm font-medium">Email</Label>
                      <p className="text-sm md:text-base">{vendorData.vendorInfo.officialMail}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                  <div>
                    <Label className="text-xs md:text-sm font-medium">Team Size</Label>
                    <p className="text-sm md:text-base">{vendorData.vendorInfo.teamSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                  <div>
                    <Label className="text-xs md:text-sm font-medium">Annual Income</Label>
                    <p className="text-sm md:text-base">₹{vendorData.vendorInfo.annualIncome.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Documents */}
          {vendorData.vendorInfo.companyDocuments && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Company Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {isPDFDocument(vendorData.vendorInfo.companyDocuments) ? (
                    // PDF Document - Show download option
                    <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="h-16 w-16 text-red-500" />
                      <div className="text-center">
                        <p className="font-medium text-lg">PDF Document</p>
                        <p className="text-sm text-muted-foreground">
                          Company document is available for download
                        </p>
                      </div>
                      <Button 
                        onClick={() => handleDownloadDocument(
                          vendorData.vendorInfo.companyDocuments,
                          `${vendorData.vendorInfo.companyName}-document.pdf`
                        )}
                        className="w-fit"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  ) : (
                    // Image Document - Show preview
                    <img 
                      src={vendorData.vendorInfo.companyDocuments} 
                      alt="Company Document"
                      className="max-w-md h-auto rounded-lg border"
                    />
                  )}
                  <Button 
                    onClick={() => setIsDocumentModalOpen(true)}
                    className="w-fit"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {vendorData.products.map((product) => (
              <Card key={product._id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-3 md:p-4 relative">
                  {/* Image Management Button */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button 
                      onClick={() => {
                        setIsImageModalOpen(true);
                        setSelectedProduct(product);
                      }}
                      className="p-1.5 md:p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                      title="Manage Images"
                    >
                      <ImageIcon className="h-3 w-3 md:h-4 md:w-4 text-gray-700" />
                    </button>
                  </div>
                  
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : product.image} 
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-xl mb-3 md:mb-4"
                  />
                  
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-lg mb-1 md:mb-2">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2">{product.description}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-xs md:text-sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setProductForm({
                            name: product.name || "",
                            price: product.price?.toString() || "",
                            quantity: product.quantity?.toString() || "",
                            description: product.description || "",
                            phoneno: product.phoneno?.toString() || "",
                            highlight: (product as any).highlight || [""],
                            unit: (product as any).unit || "pcs"
                          });
                          setEditProductOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Edit Details
                      </Button>
                    </div>
                    
                    {/* Delete Button - Separate Row */}
                    <div className="pt-2">
                      <Button 
                        onClick={() => {
                          productService.deleteProduct(product._id);
                          toast({
                            title: "Success",
                            description: "Product deleted successfully , Refresh the page to see the changes",
                          });
                        }}
                        size="sm" 
                        variant="outline" 
                        className="w-full text-red-600 hover:text-red-700 text-xs md:text-sm"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Delete Product
                      </Button>
                    </div>
                    
                    {/* Product Details */}
                    <div className="space-y-1 md:space-y-2 mt-3 md:mt-4">
                      <div className="flex justify-between">
                        <span className="text-xs md:text-sm">Price:</span>
                        <span className="font-medium text-xs md:text-sm">₹{product.price.toLocaleString()}/{(product as any).unit || 'pcs'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs md:text-sm">Quantity:</span>
                        <span className="font-medium text-xs md:text-sm">{ product.quantity || 1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm">Status:</span>
                        <Badge variant={product.isActive ? "default" : "secondary"} className="text-xs">
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {product.isTrending && (
                        <Badge variant="outline" className="w-fit text-xs">
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {vendorData.subscription ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Current Subscription
                  </CardTitle>
                  <Dialog open={editSubscriptionOpen} onOpenChange={setEditSubscriptionOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Subscription
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-[95vw]">
                      <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl">Edit Subscription</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <Label className="text-sm md:text-base">Start Date</Label>
                          <Input
                            type="date"
                            value={subscriptionForm.startDate}
                            onChange={(e) => setSubscriptionForm({...subscriptionForm, startDate: e.target.value})}
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div>
                          <Label className="text-sm md:text-base">End Date</Label>
                          <Input
                            type="date"
                            value={subscriptionForm.endDate}
                            onChange={(e) => setSubscriptionForm({...subscriptionForm, endDate: e.target.value})}
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div>
                          <Label className="text-sm md:text-base">Remaining Product Count</Label>
                          <Input
                            type="number"
                            value={subscriptionForm.remainingProductCount}
                            onChange={(e) => setSubscriptionForm({...subscriptionForm, remainingProductCount: parseInt(e.target.value)})}
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div>
                          <Label className="text-sm md:text-base">Amount Paid</Label>
                          <Input
                            type="number"
                            value={subscriptionForm.amountPaid}
                            onChange={(e) => setSubscriptionForm({...subscriptionForm, amountPaid: parseInt(e.target.value)})}
                            className="text-sm md:text-base"
                          />
                        </div>
                        <Button 
                          onClick={handleUpdateSubscription} 
                          className="w-full text-sm md:text-base"
                        >
                          Update Subscription
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Plan Name</Label>
                    <p className="text-lg">{vendorData.subscription.sub.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Amount Paid</Label>
                    <p className="text-lg text-green-600">₹{vendorData.subscription.amountPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <p>{new Date(vendorData.subscription.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Date</Label>
                    <p>{new Date(vendorData.subscription.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Remaining Products</Label>
                    <p>{vendorData.subscription.remainingProductCount}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Status</Label>
                    <Badge variant={vendorData.subscription.paymentStatus === 'success' ? "default" : "destructive"}>
                      {vendorData.subscription.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Plan Description</Label>
                  <p>{vendorData.subscription.sub.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment ID</Label>
                  <p className="text-xs font-mono">{vendorData.subscription.razorpayPaymentId}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No active subscription found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Enquiries Tab */}
        <TabsContent value="enquiries" className="space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            {vendorData.enquiries.length === 0 ? (
              <Card>
                <CardContent className="p-6 md:p-8 text-center">
                  <p className="text-sm md:text-base text-muted-foreground">No enquiries found</p>
                </CardContent>
              </Card>
            ) : (
              vendorData.enquiries.map((enquiry) => (
                <Card key={enquiry._id}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                      <div className="flex gap-3 md:gap-4">
                        <img 
                          src={(enquiry.product as any).images && (enquiry.product as any).images.length > 0 ? (enquiry.product as any).images[0] : enquiry.product.image} 
                          alt={enquiry.product.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2 truncate">{enquiry.product.name}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground mb-1">
                            Customer: {enquiry.user?.name || enquiry?.name}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground mb-1">
                            Email or Address: {enquiry.user?.email || enquiry?.address }
                          </p>
                          <p className="text-xs md:text-sm mb-1">Quantity: {enquiry.quantity}</p>
                          <p className="text-xs md:text-sm mb-1">Phone: {(enquiry.user as any)?.phone || enquiry?.phoneNo}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Badge 
                          variant={
                            enquiry.status === 'done' ? 'default' : 
                            enquiry.status === 'in process' ? 'secondary' : 'outline'
                          }
                          className="text-xs w-fit"
                        >
                          {enquiry.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Dialog open={editEnquiryOpen} onOpenChange={setEditEnquiryOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedEnquiry(enquiry)}
                                className="text-xs"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md mx-auto">
                              <DialogHeader>
                                <DialogTitle className="text-lg md:text-xl">Update Enquiry Status</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <Button 
                                    onClick={() => handleUpdateEnquiry('waiting')}
                                    variant={selectedEnquiry?.status === 'waiting' ? 'default' : 'outline'}
                                    className="text-xs md:text-sm"
                                  >
                                    Waiting
                                  </Button>
                                  <Button 
                                    onClick={() => handleUpdateEnquiry('in process')}
                                    variant={selectedEnquiry?.status === 'in process' ? 'default' : 'outline'}
                                    className="text-xs md:text-sm"
                                  >
                                    In Process
                                  </Button>
                                  <Button 
                                    onClick={() => handleUpdateEnquiry('done')}
                                    variant={selectedEnquiry?.status === 'done' ? 'default' : 'outline'}
                                    className="text-xs md:text-sm"
                                  >
                                    Done
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteEnquiry(enquiry._id)}
                            className="text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={editProductOpen} onOpenChange={setEditProductOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg md:text-xl">Edit Product</DialogTitle>
          </DialogHeader>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-1 md:p-2">
            <div className="space-y-3 md:space-y-4">
              <div>
                <Label className="text-sm md:text-base">Product Name</Label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label className="text-sm md:text-base">Price</Label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label className="text-sm md:text-base">Quantity</Label>
                  <Input
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                    className="text-sm md:text-base"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm md:text-base">Unit</Label>
                <Select value={productForm.unit} onValueChange={(value) => setProductForm({...productForm, unit: value})}>
                  <SelectTrigger className="text-sm md:text-base">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="mm">mm</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                    <SelectItem value="in">in</SelectItem>
                    <SelectItem value="per_person">Per person</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm md:text-base">Description</Label>
                <Input
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Phone Number</Label>
                <Input
                  value={productForm.phoneno}
                  onChange={(e) => setProductForm({...productForm, phoneno: e.target.value})}
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Highlights (one per line)</Label>
                <div className="space-y-2">
                  {productForm.highlight.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newHighlight = [...productForm.highlight];
                          newHighlight[index] = e.target.value;
                          setProductForm({...productForm, highlight: newHighlight});
                        }}
                        className="text-sm md:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newHighlight = productForm.highlight.filter((_, i) => i !== index);
                          setProductForm({...productForm, highlight: newHighlight});
                        }}
                        className="h-8 w-8 md:h-10 md:w-10"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        highlight: [...productForm.highlight, ""]
                      });
                    }}
                    className="text-sm md:text-base"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Add Highlight
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed Footer */}
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setEditProductOpen(false)}
              className="text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (!selectedProduct) return;
                  
                  const formData = {
                    ...productForm,
                    price: Number(productForm.price),
                    quantity: Number(productForm.quantity),
                    unit: (productForm.unit || 'pcs').toLowerCase()
                  };
                  
                  await productService.updateProduct(selectedProduct._id, formData);
                  toast({
                    title: "Success",
                    description: "Product updated successfully"
                  });
                  setEditProductOpen(false);
                  fetchVendorDetail();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to update product",
                    variant: "destructive"
                  });
                }
              }}
              className="text-sm md:text-base"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Management Modal */}
      {isImageModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Manage Images - {selectedProduct.name}</h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Upload new images or delete existing ones</p>
              </div>
              <button
                onClick={() => {
                  setIsImageModalOpen(false);
                  setSelectedProduct(null);
                  setSelectedFiles([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                {/* Upload New Images Section */}
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 relative">
                  {isUploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center z-10">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        <span className="text-sm md:text-base">Uploading images...</span>
                      </div>
                    </div>
                  )}
                  <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 flex items-center gap-2">
                    <Upload className="h-4 w-4 md:h-5 md:w-5" />
                    Upload New Images
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          setSelectedFiles(Array.from(files));
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                    
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs md:text-sm font-medium text-gray-700">Selected Files:</span>
                        <div className="max-h-24 md:max-h-32 overflow-y-auto space-y-1">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="text-xs md:text-sm text-gray-600 bg-white px-2 md:px-3 py-1 md:py-2 rounded border">
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={async () => {
                        if (selectedFiles.length === 0) return;

                        setIsUploading(true);
                        const formData = new FormData();
                        selectedFiles.forEach((file) => {
                          formData.append("productImage", file);
                        });

                        try {
                          await productService.updateProductImage(selectedProduct._id, formData);
                          
                          // Refresh the vendor data
                          fetchVendorDetail();
                          
                          // Update the selected product
                          const updatedProduct = vendorData?.products.find((p: any) => p._id === selectedProduct._id);
                          if (updatedProduct) {
                            setSelectedProduct(updatedProduct);
                          }
                          
                          setSelectedFiles([]);
                          toast({
                            title: "Success",
                            description: "Images uploaded successfully!",
                          });
                        } catch (err) {
                          console.error("Upload failed", err);
                          toast({
                            title: "Error",
                            description: "Failed to upload images. Please try again.",
                            variant: "destructive",
                          });
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                      disabled={selectedFiles.length === 0 || isUploading}
                      className="w-full text-sm md:text-base"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Images
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Existing Images Section */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">Current Images ({selectedProduct.images.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                      {selectedProduct.images.map((imageUrl: string, index: number) => (
                        <div key={index} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-24 md:h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <button
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this image?')) {
                                  setDeletingImageId(imageUrl);
                                  try {
                                    await productService.deleteProductImage(selectedProduct._id, imageUrl);
                                    
                                    // Update selected product state
                                    setSelectedProduct(prev => ({
                                      ...prev,
                                      images: prev.images.filter((img: string) => img !== imageUrl)
                                    }));
                                    
                                    // Refresh vendor data
                                    fetchVendorDetail();
                                    
                                    toast({
                                      title: "Success",
                                      description: "Image deleted successfully",
                                    });
                                  } catch (error) {
                                    console.error("Error deleting image:", error);
                                    toast({
                                      title: "Error",
                                      description: "Failed to delete image",
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setDeletingImageId(null);
                                  }
                                }
                              }}
                              disabled={deletingImageId === imageUrl}
                              className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 md:p-2 transition-all duration-200 disabled:opacity-50"
                            >
                              {deletingImageId === imageUrl ? (
                                <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              )}
                            </button>
                          </div>
                          <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-black bg-opacity-50 text-white text-xs px-1 md:px-2 py-0.5 md:py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!selectedProduct.images || selectedProduct.images.length === 0) && (
                  <div className="text-center py-6 md:py-8 text-gray-500">
                    <ImageIcon className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm md:text-base">No images uploaded yet</p>
                    <p className="text-xs md:text-sm">Upload some images to get started</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Button
                variant="outline"
                onClick={() => {
                  setIsImageModalOpen(false);
                  setSelectedProduct(null);
                  setSelectedFiles([]);
                }}
                className="px-4 md:px-6 text-sm md:text-base"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Company Document Dialog */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Company Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Document</Label>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setDocumentFile(file);
                  }
                }}
              />
            </div>
            {documentFile && (
              <div>
                <p>Selected file: {documentFile.name}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDocumentModalOpen(false);
              setDocumentFile(null);
            }}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!documentFile) return;

                try {
                  const formData = new FormData();
                  formData.append("companyDocument", documentFile);
                  
                  await api.put(`/vendor/documents/${vendorId}`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  });
                  
                  toast({
                    title: "Success",
                    description: "Company document updated successfully"
                  });
                  setIsDocumentModalOpen(false);
                  setDocumentFile(null);
                  fetchVendorDetail();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to update company document",
                    variant: "destructive"
                  });
                }
              }}
              disabled={!documentFile}
            >
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}