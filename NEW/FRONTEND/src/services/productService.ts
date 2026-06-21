
import { BestSellers } from '@/components/HomeNew/BestSellers';
import { api } from '@/lib/api';

export interface AddProductRequest {
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  subCategory?: string;
  productImage: File[]; // Updated to support multiple images
  phoneno: string; 
}

export interface AddCategoryRequest {
  name: string;
  catImage?: File;
}



export const productService = {
  async addProduct(data: AddProductRequest) {

    console.log(data);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'productImage') {
        // Handle multiple images
        if (Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, value as File);
        }
      } else {
        formData.append(key, value.toString());
      }
    });

    console.log("data",formData);
    const response = await api.post('/product/add-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("product",response);
    return response.data;
  },

  async addCategory(data: AddCategoryRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.catImage) {
      formData.append('catImage', data.catImage);
    }

    const response = await api.post('/product/add-category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/product/get-category');
    return response.data;
  },

  async getProducts() {
    const response = await api.get('/product/get-product');
    console.log(response.data);
    return response.data;
  },

  async getProductById(id: string) {
    const response = await api.get(`/product/get-product/${id}`);
    return response.data;
  },

  async getVendorProducts() {
    const response = await api.get('/product/get-vendor-all-product');
    return response.data;
  },

  async deleteProduct(productId: string) {
    const response = await api.delete(`/product/delete-product/${productId}`);
    return response.data;
  },

  async addSubCategory(categoryId: string, name: string) {
    const response = await api.put(`/product/${categoryId}/add-subCategory`, { name });
    return response.data;
  },



   async getVendorPhoneno() {
    console.log("runnning   get  vendor  phoneno");
    
    const response = await api.get('/product/get-phoneno');
    console.log(response.data);
    return response.data;
  },

   async updateIsActive(isActive , productId) {
    console.log("is active");
    
    const response = await api.put(`/product/updae-active/${productId}` , isActive);
    console.log(response.data);
    return response.data;
  },


  async updateProduct (productId: string, updatedData: any) {
  console.log("update pro");
    const   res  = await api.put(`/product/update/${productId}`, updatedData);
    console.log(res.data);
    return res.data;
  },

  async setTrendingProduct(productId: string, isTrending: boolean) {
    const response = await api.put(`/admin/product/${productId}/set-trending`, { isTrending });
    return response.data;
  },

  async getTrendingProducts() {
    const response = await api.get('/admin/product/trending');
    return response.data;
  },
  async newArrivals() {
    const response = await api.get('/product/new-arrivals');
    console.log("new",response.data);
    return response.data;
  },
  async BestSellers() {
    const response = await api.get('/product/best-sellers');
    console.log(response);
    
    return response.data;
  },

  async updateProductImage (productId: string, updatedData: any) {
  console.log("update image pro");
  const res = await api.put(`/product/update-image/${productId}`, updatedData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
    return res.data;
  },

  async deleteProductImage(productId: string, imageUrl: string) {
    console.log("delete single image");
    const response = await api.delete(`/product/delete-image/${productId}`, {
      data: { imageUrl }
    });
    return response.data;
  },
  
  async addProductWithMultipleImages(formData: FormData) {
    // Using the correct endpoint as per the API documentation
    const response = await api.post('/product/add-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateCategory(categoryId: string, data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'catImage' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await api.put(`/product/update-category/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteCategory(categoryId: string) {
    const response = await api.delete(`/product/delete-category/${categoryId}`);
    return response.data;
  },

  async updateSubCategory(subCategoryId: string, name: string) {
    const response = await api.put(`/product/subcategory/${subCategoryId}`, { name });
    return response.data;
  },

  async deleteSubCategory(subCategoryId: string) {
    const response = await api.delete(`/product/subcategory/${subCategoryId}`);
    return response.data;
  },

  async setTrendingCategory(categoryId: string, isTrending: boolean) {
    const response = await api.patch(`/admin/toggle-trending/${categoryId}`, { isTrending });
    return response.data;
  }
};
