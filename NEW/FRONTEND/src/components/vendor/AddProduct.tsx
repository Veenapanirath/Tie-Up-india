import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Upload, Save, ArrowLeft, ImageIcon, X } from "lucide-react";
import { productService } from "@/services/productService";
import { toast } from "@/hooks/use-toast";

interface SubCategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  sub_category: SubCategory[];
}

interface VendorPhonenos {
  _id: string;
  phonenos: number[];
  createdAt: string;
  updatedAt: string;
}

interface ProductForm {
  name: string;
  price: number;
  description: string;
  category: string;
  subCategory: string;
  quantity: number;
  productImages: File[];
  phoneno: string;
  highlight: string[];
  unit?: string;
}

export function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [phonenos, setPhonenos] = useState<number[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    price: 0,
    description: "",
    category: "",
    subCategory: "",
    quantity: 0,
    productImages: [],
    phoneno: "",
    highlight: [],
    unit: "pcs",
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedCategory = categories.find(cat => cat._id === formData.category);

  useEffect(() => {
    (async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res.data || []);

        const resPhone = await productService.getVendorPhoneno();
        console.log("res",resPhone.data , "phons" , resPhone?.data?.phonenos);
        
        const phoneList = resPhone?.data  || [];
        setPhonenos(phoneList);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch categories or phone numbers",
          variant: "destructive",
        });
      }
    })();
  }, []);

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
      ...(field === "category" && { subCategory: "" }),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData(prev => ({ 
        ...prev, 
        productImages: [...prev.productImages, ...newFiles] 
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
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || formData.productImages.length === 0 || !formData.phoneno) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload at least one image",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      if (formData.subCategory) {
        formDataToSend.append("subCategory", formData.subCategory);
      }
      formDataToSend.append("quantity", formData.quantity.toString());
      formDataToSend.append("unit", (formData.unit || "pcs").toLowerCase());
      formDataToSend.append("phoneno", formData.phoneno);
      
      // Append highlights
      formData.highlight.forEach((item) => {
        formDataToSend.append("highlight", item);
      });
      
      // Append all images
      formData.productImages.forEach((image, index) => {
        formDataToSend.append("productImage", image);
      });

      // Use the API endpoint for multiple images as per the documentation
      await productService.addProductWithMultipleImages(formDataToSend);

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      navigate("/vendor/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Add Product</h2>
          <p className="text-sm md:text-base text-muted-foreground">Upload a new product to your store</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Package className="h-4 w-4 md:h-5 md:w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                  
                      value={formData.price || ""} 
                      onChange={handleInputChange} 
                      placeholder="Enter price"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                        {categories.map(category => (
                          <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subCategory">Subcategory</Label>
                    <Select value={formData.subCategory} onValueChange={(value) => handleSelectChange("subCategory", value)} disabled={!selectedCategory || selectedCategory.sub_category.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.sub_category.map(sub => (
                          <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
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
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer"
                  >
                    <Upload className="h-6 w-6 mb-2" />
                    <span>{formData.productImages.length > 0 
                      ? `${formData.productImages.length} image${formData.productImages.length > 1 ? 's' : ''} selected` 
                      : "Click to upload images"}
                    </span>
                  </Label>
                  
                  {formData.productImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`} 
                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 p-0 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-2 w-2 sm:h-3 sm:w-3" />
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
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {imagePreviews.length > 0 ? (
                  <div className="relative">
                    <img 
                      src={imagePreviews[0]} 
                      alt="Main Preview" 
                      className="rounded-lg w-full h-32 sm:h-40 md:h-48 object-cover" 
                    />
                    {imagePreviews.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                        +{imagePreviews.length - 1} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    <p className="text-muted-foreground ml-2 text-sm md:text-base">No images selected</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold">{formData.name || "Product Name"}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {formData.description || "Product description will appear here..."}
                  </p>
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">₹{formData.price || 0}</span>
                    <span className="text-sm text-muted-foreground">Stock: {formData.quantity || 0}</span>
                  </div>
                  {selectedCategory && (
                    <div className="text-xs text-muted-foreground">
                      Category: {selectedCategory.name}
                      {formData.subCategory && selectedCategory.sub_category.find(s => s._id === formData.subCategory) &&
                        ` > ${selectedCategory.sub_category.find(s => s._id === formData.subCategory)?.name}`}
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
