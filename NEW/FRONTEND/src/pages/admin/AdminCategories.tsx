
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { 
  BarChart3,
  User,
  Package,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  X
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  image?: string;
  sub_category: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  _id: string;
  name: string;
  parentCategory: string;
  createdAt: string;
  updatedAt: string;
}


 
export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editSubCategoryName, setEditSubCategoryName] = useState("");
  const { toast } = useToast();


   useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      console.log("res",response);
      
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      await productService.addCategory({
        name: categoryName,
        catImage: categoryImage || undefined,
      });
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      
      setCategoryName("");
      setCategoryImage(null);
      setOpenAddCategory(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !selectedCategoryId) return;

    setLoading(true);
    try {
      await productService.addSubCategory(selectedCategoryId, subCategoryName);
      
      toast({
        title: "Success",
        description: "Subcategory added successfully",
      });
      
      setSubCategoryName("");
      setSelectedCategoryId("");
      setOpenAddSubCategory(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to add subcategory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;

    setLoading(true);
    try {
      await productService.updateCategory(editingCategory._id, {
        name: editCategoryName,
        catImage: categoryImage
      });
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      setEditCategoryName("");
      setCategoryImage(null);
      setEditingCategory(null);
      setOpenEditCategory(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubCategory || !editSubCategoryName.trim()) return;

    setLoading(true);
    try {
      await productService.updateSubCategory(editingSubCategory._id, editSubCategoryName);
      
      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      });
      
      setEditSubCategoryName("");
      setEditingSubCategory(null);
      setOpenEditSubCategory(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to update subcategory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This will also delete all subcategories.")) return;

    setLoading(true);
    try {
      await productService.deleteCategory(categoryId);
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    setLoading(true);
    try {
      await productService.deleteSubCategory(subCategoryId);
      
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
      
      fetchCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to delete subcategory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6">
   {/* Category Management Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">Category Management</h3>
          <div className="flex space-x-4">
            <Dialog open={openAddCategory} onOpenChange={setOpenAddCategory}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryImage">Category Image (Optional)</Label>
                    <Input
                      id="categoryImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Adding..." : "Add Category"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={openAddSubCategory} onOpenChange={setOpenAddSubCategory}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subcategory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subcategory</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSubCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="parentCategory">Parent Category</Label>
                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subCategoryName">Subcategory Name</Label>
                    <Input
                      id="subCategoryName"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      placeholder="Enter subcategory name"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading || !selectedCategoryId} className="w-full">
                    {loading ? "Adding..." : "Add Subcategory"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={openEditCategory} onOpenChange={setOpenEditCategory}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="editCategoryName">Category Name</Label>
                    <Input
                      id="editCategoryName"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCategoryImage">Category Image (Optional)</Label>
                    <Input
                      id="editCategoryImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Updating..." : "Update Category"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setOpenEditCategory(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Subcategory Dialog */}
            <Dialog open={openEditSubCategory} onOpenChange={setOpenEditSubCategory}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Subcategory</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="editSubCategoryName">Subcategory Name</Label>
                    <Input
                      id="editSubCategoryName"
                      value={editSubCategoryName}
                      onChange={(e) => setEditSubCategoryName(e.target.value)}
                      placeholder="Enter subcategory name"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Updating..." : "Update Subcategory"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setOpenEditSubCategory(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Card key={category._id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                    {category.name}
                  </CardTitle>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium shrink-0">
                    {category.sub_category?.length || 0}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Subcategories */}
                {category.sub_category && category.sub_category.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Subcategories:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.sub_category.slice(0, 3).map((subCat) => (
                        <div key={subCat._id} className="flex items-center gap-1">
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                            {subCat.name}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              setEditingSubCategory(subCat);
                              setEditSubCategoryName(subCat.name);
                              setOpenEditSubCategory(true);
                            }}
                          >
                            <Edit className="h-2 w-2" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 text-destructive"
                            onClick={() => handleDeleteSubCategory(subCat._id)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      ))}
                      {category.sub_category.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                          +{category.sub_category.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No subcategories</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(category);
                        setEditCategoryName(category.name);
                        setOpenEditCategory(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
