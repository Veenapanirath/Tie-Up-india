import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { authService } from '@/services/authService';
import { Store, TrendingUp, Shield, HeadphonesIcon, Globe, Users } from 'lucide-react';
import { AuthHeader } from '@/components/auth/AuthHeader';

export default function VendorSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    companyAddress: '',
    firmType: '',
    personDesignation: '',
    personName: '',
    personPhone: '',
    category: '',
    products: '',
    productNumber: '',
    annualIncome: '',
    gst: '',
    website: '',
    teamSize: '',
  });
  const [document, setDocument] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const vendorData = {
        ...formData,
        productNumber: parseInt(formData.productNumber) || 0,
        annualIncome: parseInt(formData.annualIncome) || 0,
        teamSize: parseInt(formData.teamSize) || 0,
        companyDocuments: document as File,
      };

      const response = await authService.registerVendor(vendorData);
      
      toast({
        title: "Success!",
        description: "Vendor registration successful. Please login to continue.",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader title="Vendor Registration" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Become a Seller
              </h1>
              <p className="text-gray-600">
                Join thousands of successful vendors on our platform
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          required
                          minLength={6}
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="firmType">Firm Type</Label>
                        <Select onValueChange={(value) => handleSelectChange('firmType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select firm type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="private-limited">Private Limited</SelectItem>
                            <SelectItem value="public-limited">Public Limited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="companyAddress">Company Address</Label>
                        <Input
                          id="companyAddress"
                          name="companyAddress"
                          type="text"
                          value={formData.companyAddress}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Contact Person</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="personName">Person Name</Label>
                        <Input
                          id="personName"
                          name="personName"
                          type="text"
                          value={formData.personName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="personDesignation">Designation</Label>
                        <Input
                          id="personDesignation"
                          name="personDesignation"
                          type="text"
                          value={formData.personDesignation}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="personPhone">Person Phone</Label>
                        <Input
                          id="personPhone"
                          name="personPhone"
                          type="tel"
                          value={formData.personPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          name="category"
                          type="text"
                          value={formData.category}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="products">Products</Label>
                        <Input
                          id="products"
                          name="products"
                          type="text"
                          value={formData.products}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="productNumber">Number of Products</Label>
                        <Input
                          id="productNumber"
                          name="productNumber"
                          type="number"
                          value={formData.productNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="annualIncome">Annual Income</Label>
                        <Input
                          id="annualIncome"
                          name="annualIncome"
                          type="number"
                          value={formData.annualIncome}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gst">GST Number</Label>
                        <Input
                          id="gst"
                          name="gst"
                          type="text"
                          value={formData.gst}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamSize">Team Size</Label>
                        <Input
                          id="teamSize"
                          name="teamSize"
                          type="number"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <Label htmlFor="companyDocuments">Company Documents *</Label>
                    <Input
                      id="companyDocuments"
                      name="companyDocuments"
                      type="file"
                      required
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload company registration certificate, GST certificate, or business license
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register as Vendor'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Login here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Why Choose Tie-Up-India?</h2>
              <p className="text-lg opacity-90">
                Join thousands of successful sellers and grow your business with our powerful platform
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <Store className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Store Setup</h3>
                  <p className="text-gray-600 text-sm">
                    Set up your online store in minutes with our intuitive dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Boost Your Sales</h3>
                  <p className="text-gray-600 text-sm">
                    Reach millions of customers and increase your revenue potential
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                  <p className="text-gray-600 text-sm">
                    Get paid securely with our integrated payment gateway
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <HeadphonesIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">
                    Get help whenever you need it with our dedicated support team
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <Globe className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Global Reach</h3>
                  <p className="text-gray-600 text-sm">
                    Sell to customers across the country with our wide network
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Seller Community</h3>
                  <p className="text-gray-600 text-sm">
                    Connect with other sellers and learn from their experiences
                  </p>
                </div>
              </div>
            </div>

            {/* Success Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Success Stories</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-gray-600">Active Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50,000+</div>
                  <div className="text-sm text-gray-600">Products Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹1Cr+</div>
                  <div className="text-sm text-gray-600">Monthly Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-gray-600">Seller Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
