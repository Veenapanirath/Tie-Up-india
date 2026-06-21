"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { Upload, Package, ImageIcon, Save, ArrowLeft, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  sub_category: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  subCategory: string;
  images: File[];
  phoneno: string;
  highlight: string[];
  unit?: string;
}

export default function AdminAddProduct() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    subCategory: "",
    images: [],
    phoneno: "",
    highlight: [],
    unit: "pcs",
  });
  const [phonenos, setPhonenos] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchPhoneNos();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
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


  const fetchPhoneNos = async () => {
  try {
    const response = await productService.getVendorPhoneno();
    const phoneList = response?.data || [];
    setPhonenos(phoneList);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch phone numbers",
      variant: "destructive",
    });
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === "category" && { subCategory: "" }), // Reset subcategory when category changes
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newFiles] 
      }));
      
      // Create previews for all new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.quantity || !formData.category || formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload at least one image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("quantity", formData.quantity.toString());
      formDataToSend.append("unit", (formData.unit || "pcs").toLowerCase());
      formDataToSend.append("category", formData.category);
      if (formData.subCategory) {
        formDataToSend.append("subCategory", formData.subCategory);
      }
      formDataToSend.append("phoneno", formData.phoneno || "1234567890");
      
      // Append highlights
      formData.highlight.forEach((item) => {
        formDataToSend.append("highlight", item);
      });
      
      // Append all images
      formData.images.forEach((image, index) => {
        formDataToSend.append("productImage", image);
      });

      // Use the API endpoint for multiple images as per the documentation
      await productService.addProductWithMultipleImages(formDataToSend);
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        category: "",
        subCategory: "",
        images: [],
        phoneno: "",
        highlight: [],
        unit: "pcs",
      });
      setImagePreviews([]);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat._id === formData.category);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Add New Product</h2>
          <p className="text-muted-foreground">Create a new product for the marketplace</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity || ""}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit *</Label>
                    <Select value={formData.unit || "pcs"} onValueChange={(value) => handleSelectChange("unit", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="g">G</SelectItem>
                        <SelectItem value="mg">Mg</SelectItem>
                        <SelectItem value="lb">Lb</SelectItem>
                        <SelectItem value="oz">Oz</SelectItem>
                        <SelectItem value="l">L</SelectItem>
                        <SelectItem value="ml">Ml</SelectItem>
                        <SelectItem value="m">M</SelectItem>
                        <SelectItem value="cm">Cm</SelectItem>
                        <SelectItem value="mm">Mm</SelectItem>
                        <SelectItem value="ft">Ft</SelectItem>
                        <SelectItem value="in">In</SelectItem>
                        <SelectItem value="per_person">Per person</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                    <Label htmlFor="subCategory">Subcategory</Label>
                    <Select 
                      value={formData.subCategory} 
                      onValueChange={(value) => handleSelectChange("subCategory", value)}
                      disabled={!selectedCategory || selectedCategory.sub_category.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.sub_category.map((subCategory) => (
                          <SelectItem key={subCategory._id} value={subCategory._id}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneno">Phone No *</Label>
                  <Input
                    list="phone-options"
                    id="phoneno"
                    name="phoneno"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter or select phone number"
                    value={formData.phoneno || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phoneno: e.target.value }))}
                    required
                  />
                  <datalist id="phone-options">
                    {phonenos.map((phone) => (
                      <option key={phone} value={phone} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <Label htmlFor="highlight">Product Highlights</Label>
                  <div className="flex gap-2">
                    <Input
                      id="highlight"
                      placeholder="Enter a highlight and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          setFormData((prev) => ({
                            ...prev,
                            highlight: [...prev.highlight, e.currentTarget.value.trim()],
                          }));
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.highlight.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 px-2 py-1 rounded-full text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              highlight: prev.highlight.filter((_, i) => i !== index),
                            }))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Press Enter after typing each highlight to add it
                  </p>
                </div>


                <div>
                  <Label htmlFor="image">Product Images *</Label>
                  <div className="mt-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      multiple
                    />
                    <Label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {formData.images.length > 0 
                          ? `${formData.images.length} image${formData.images.length > 1 ? 's' : ''} selected` 
                          : "Click to upload images"}
                      </span>
                    </Label>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`} 
                            className="h-20 w-20 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imagePreviews.length > 0 ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={imagePreviews[0]}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    {imagePreviews.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                        +{imagePreviews.length - 1} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No images selected</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    {formData.name || "Product Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {formData.description || "Product description will appear here..."}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">
                      ₹{formData.price || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock: {formData.quantity || 0}
                    </span>
                  </div>
                  {selectedCategory && (
                    <div className="text-xs text-muted-foreground">
                      Category: {selectedCategory.name}
                      {formData.subCategory && selectedCategory.sub_category.find(sub => sub._id === formData.subCategory) && 
                        ` > ${selectedCategory.sub_category.find(sub => sub._id === formData.subCategory)?.name}`
                      }
                    </div>
                  )}
                  {formData.highlight.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Highlights:</p>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                        {formData.highlight.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}