
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService  } from "@/services/productService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Pencil, ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function MyProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
const [editForm, setEditForm] = useState({
  name: "",
  price: "",
  quantity: "",
  description: "",
  phoneno: "",
  highlight: [""]
  ,unit: "pcs"
});

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [productId ,setProuctId] = useState("")
  const [user, setUser] = useState<any>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const { data: productsData } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: () => productService.getVendorProducts(),
  });

  useEffect(() => {
    if (productsData?.data) {
      setProducts(productsData.data);
    }
  }, [productsData]);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("user" ,user);
      
    }
  }, []);

  // const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
  //   console.log(`Toggle product ${productId} from ${currentStatus} to ${!currentStatus}`);
  //   setProducts(prev => prev.map(p => 
  //     p._id === productId ? { ...p, isActive: !currentStatus } : p
  //   ));
  // };


  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
  const newStatus = !currentStatus;

  try {
    // 🔁 Send status update to backend
    await productService.updateIsActive({ isActive: newStatus }, productId);

    // ✅ Update frontend state
    setProducts(prev =>
      prev.map(p =>
        p._id === productId ? { ...p, isActive: newStatus } : p
      )
    );
  } catch (error) {
    console.error('Error updating product status:', error);
    alert('Failed to update status'); // Optional: Replace with toast if you're using one
  }
}

  const navigate = useNavigate();


  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
            My Products
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Manage your product listings
          </p>
        </div>
        <Button 
        onClick={() => {
          navigate("/vendor/add-product");
        }}
        className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <Card key={product._id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 relative">
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
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{product.name}</h3>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Switch
                      checked={product.isActive || false}
                      onCheckedChange={() => toggleProductStatus(product._id, product.isActive || false)}
                    />
                    <span className="text-xs md:text-sm text-gray-600">
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-xl font-bold text-primary">₹{product.price}/{product.unit || 'pcs'}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-700 bg-blue-50 px-2 py-1 rounded-md">
                      {product.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  {/* <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button> */}

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs md:text-sm"
                    onClick={() => {
                      setEditingProduct(product);
                      setEditForm({
                          name: product.name || "",
                          price: product.price || "",
                          quantity: product.quantity || "",
                          description: product.description || "",
                          phoneno: product.phoneno || "",
                          highlight: product.highlight || [""],
                          unit: product.unit || "pcs"
                          
                        });
                    }}
                  >
                    <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Edit
                  </Button>
                  {/* {user.role == "admin" && ( */}

                    <Button 
                    onClick={() => {
                      productService.deleteProduct(product._id);
                      toast({
                        title: "Success",
                        description: "Product deleted successfully ,  Refresh the page to see the changes",
                        // variant: "success",
                      });
                    }}
                    size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 text-xs md:text-sm">
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Delete
                  </Button> 
                  {/* // )} */}
                 
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      {/* Header - Fixed */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Edit Product</h2>
        <button
          onClick={() => setEditingProduct(null)}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={editForm.unit}
                onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="mg">mg</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="ft">ft</option>
                <option value="in">in</option>
                <option value="per_person">Per person</option>
                <option value="image">Image</option>
                <option value="day">Day</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={editForm.phoneno}
                onChange={(e) => setEditForm({ ...editForm, phoneno: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Enter product description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>
          </div>

          {/* Highlights Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Highlights</label>
            <div className="space-y-3">
              {editForm.highlight.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newHighlight = [...editForm.highlight];
                      newHighlight[index] = e.target.value;
                      setEditForm({ ...editForm, highlight: newHighlight });
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Highlight ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => {
                      const newHighlight = editForm.highlight.filter((_, i) => i !== index);
                      setEditForm({ ...editForm, highlight: newHighlight });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="flex items-center text-blue-600 border border-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm transition-colors"
                onClick={() => {
                  setEditForm({
                    ...editForm,
                    highlight: [...editForm.highlight, ""]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Highlight
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl space-x-3">
        <Button
          variant="outline"
          onClick={() => setEditingProduct(null)}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              await productService.updateProduct(editingProduct._id, editForm);
              // Optimistically update local UI
              setProducts(prev =>
                prev.map(p =>
                  p._id === editingProduct._id
                    ? { ...p, ...editForm }
                    : p
                )
              );
              setEditingProduct(null);
            } catch (error) {
              alert("Failed to update product");
              console.error(error);
            }
          }}
          className="px-6"
        >
          Save Changes
        </Button>
      </div>
    </div>
  </div>
)}



    {/* Image Management Modal */}
    {isImageModalOpen && selectedProduct && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold">Manage Images - {selectedProduct.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Upload new images or delete existing ones</p>
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
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Upload New Images Section */}
              <div className="bg-gray-50 rounded-lg p-4 relative">
                {isUploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Uploading images...</span>
                    </div>
                  </div>
                )}
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Images
                </h3>
                <div className="space-y-4">
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Selected Files:</span>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-white px-3 py-2 rounded border">
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
                        
                        // Refresh the products data
                        const updatedProducts = await productService.getVendorProducts();
                        setProducts(updatedProducts.data);
                        
                        // Update the selected product
                        const updatedProduct = updatedProducts.data.find((p: any) => p._id === selectedProduct._id);
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
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Images
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Existing Images Section */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Current Images ({selectedProduct.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {selectedProduct.images.map((imageUrl: string, index: number) => (
                      <div key={index} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this image?')) {
                                setDeletingImageId(imageUrl);
                                try {
                                  await productService.deleteProductImage(selectedProduct._id, imageUrl);
                                  
                                  // Update local state
                                  setProducts(prev =>
                                    prev.map(p =>
                                      p._id === selectedProduct._id
                                        ? {
                                            ...p,
                                            images: p.images.filter((img: string) => img !== imageUrl)
                                          }
                                        : p
                                    )
                                  );
                                  
                                  // Update selected product state
                                  setSelectedProduct(prev => ({
                                    ...prev,
                                    images: prev.images.filter((img: string) => img !== imageUrl)
                                  }));
                                  
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
                            className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 disabled:opacity-50"
                          >
                            {deletingImageId === imageUrl ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(!selectedProduct.images || selectedProduct.images.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No images uploaded yet</p>
                  <p className="text-sm">Upload some images to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <Button
              variant="outline"
              onClick={() => {
                setIsImageModalOpen(false);
                setSelectedProduct(null);
                setSelectedFiles([]);
              }}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    )}

    </div>




  );
}
