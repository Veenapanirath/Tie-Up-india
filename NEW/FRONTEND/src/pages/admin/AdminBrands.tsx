import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { brandService, Brand, CreateBrandData, UpdateBrandData } from "@/services/brandService";
import { Search, Plus, Edit, Trash2, Building2 } from "lucide-react";

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<string | null>(null);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [updatingBrand, setUpdatingBrand] = useState(false);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    filterBrands();
  }, [brands, searchTerm]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getAllBrands();
      setBrands(response.data?.brands || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch brands",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBrands = () => {
    let filtered = brands;

    if (searchTerm) {
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBrands(filtered);
  };

  const handleCreateBrand = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setCreatingBrand(true);
    try {
      const createData: CreateBrandData = {
        name: formData.name,
        category: formData.category,
        image: formData.image || undefined,
      };

      await brandService.createBrand(createData);
      
      toast({
        title: "Success",
        description: "Brand created successfully",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchBrands();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create brand",
        variant: "destructive",
      });
    } finally {
      setCreatingBrand(false);
    }
  };

  const handleUpdateBrand = async () => {
    if (!editingBrand || !formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUpdatingBrand(true);
    try {
      const updateData: UpdateBrandData = {
        name: formData.name,
        category: formData.category,
        image: formData.image || undefined,
      };

      await brandService.updateBrand(editingBrand._id, updateData);
      
      toast({
        title: "Success",
        description: "Brand updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingBrand(null);
      resetForm();
      fetchBrands();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update brand",
        variant: "destructive",
      });
    } finally {
      setUpdatingBrand(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    setDeletingBrand(brandId);
    try {
      await brandService.deleteBrand(brandId);
      
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      });

      fetchBrands();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      });
    } finally {
      setDeletingBrand(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      image: null,
    });
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      category: brand.category,
      image: null,
    });
    setIsEditDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600 mt-2">Manage brands and their categories</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                />
              </div>
              <div>
                <Label htmlFor="image">Brand Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={creatingBrand}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBrand}
                  disabled={creatingBrand}
                >
                  {creatingBrand ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Brand"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search brands or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <Card key={brand._id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              {brand.image ? (
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">
                {brand.name}
              </h3>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">
                  {brand.category}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(brand)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteBrand(brand._id)}
                  disabled={deletingBrand === brand._id}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {deletingBrand === brand._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No brands found matching your criteria
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Brand Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Enter category"
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Brand Image</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {editingBrand?.image && (
                <p className="text-sm text-gray-500 mt-1">
                  Current image: {editingBrand.image.split('/').pop()}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={updatingBrand}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateBrand}
                disabled={updatingBrand}
              >
                {updatingBrand ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Brand"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
