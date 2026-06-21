import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { adminService, AdData } from "@/services/adminService";
import { Upload, Plus, ArrowLeft, ImageIcon, Trash2 } from "lucide-react";


export default function AdminAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<AdData>({
    title: "",
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAds();
      setAds(response.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log(id);
    
    await adminService.deleteAds(id);
    fetchAds();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !selectedImage) {
      toast({
        title: "Error",
        description: "Please fill in title and upload an image",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await adminService.createAd({
        ...formData,
        adImage: selectedImage || undefined,
      });

      toast({
        title: "Success",
        description: "Ad created successfully",
      });

      // Reset form
      setFormData({
        title: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setShowCreateForm(false);

      // Refresh ads list
      fetchAds();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  if (loading && ads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ads Management</h2>
          <p className="text-muted-foreground">Create and manage promotional advertisements</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Current Ads ({ads.length})</h3>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showCreateForm ? "Cancel" : "Create New Ad"}
        </Button>
      </div>

      {/* Create Ad Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Advertisement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter ad title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="adImage">Ad Image *</Label>
                <Input
                  id="adImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                <Label
                  htmlFor="adImage"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload image</span>
                    </>
                  )}
                </Label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Ad"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({
                      title: "",
                    });
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <Card key={ad._id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {ad.image ? (
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 truncate">
                {ad.title}
              </h3>
              
              <div className="flex items-center justify-end">
                <Button 
                onClick={() => handleDelete(ad._id)}
                size="sm" variant="destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ads.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No ads created yet</p>
            <p className="text-muted-foreground">Create your first advertisement to get started</p>
            <Button onClick={() => setShowCreateForm(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create First Ad
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
