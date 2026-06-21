import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from '@/lib/api';
import { useAuth } from "../contexts/AuthContext"; 
interface Product {
  _id: string;
  name: string;
  vendor: {
    signupPerson: {
      phone: string;
      name: string;
    };
  };
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isLoggedIn?: boolean;
}

export default function EnquiryModal({ isOpen, onClose, product }: EnquiryModalProps) {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<'form' | 'whatsapp'>('form');
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setStep('form');
    setQuantity(1);
    setName('');
    setPhoneNo('');
    setAddress('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const submitEnquiry = async () => {
    if (!product) return;

    setLoading(true);
    try {
      const payload = isAuthenticated 
        ? { productId: product._id, quantity }
        : { productId: product._id, quantity, name, phoneNo, address };
      // const payload = isAuthenticated  
      //   ? { productId: product._id, quantity }
      //   : { productId: product._id, quantity, name, phoneNo, address };

      await api.post('/enquiry/create-enq', payload);
      
      toast({
        title: "Success",
        description: "Enquiry submitted successfully!",
      });
      
      setStep('whatsapp');
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    
    const message = `Hi ${product.vendor.signupPerson.name}, I'm interested in ${product.name}. Quantity: ${quantity}${!isAuthenticated  ? `. My details - Name: ${name}, Phone: ${phoneNo}, Address: ${address}` : ''}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/${product.vendor.signupPerson.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    handleClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' ? 'Product Enquiry' : 'Contact Vendor'}
          </DialogTitle>
          <DialogDescription>
        Fill in the form below to send us your enquiry.
      </DialogDescription>
        </DialogHeader>
        
        {step === 'form' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">by {product.vendor.signupPerson.name}</p>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                // onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuantity(value === "" ? "" : parseInt(value));
                }}
                className="mt-1"
              />
            </div>

            {!isAuthenticated  && (
              <>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="mt-1"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={submitEnquiry} 
                disabled={loading || (!isAuthenticated  && (!name || !phoneNo || !address))}
                className="flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </div>
          </div>
        )}

        {step === 'whatsapp' && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Enquiry Submitted!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your enquiry has been submitted successfully.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Contact vendor directly via WhatsApp:
              </p>
              <p className="font-semibold text-gray-900">
                {product.vendor.signupPerson.name}
              </p>
              <p className="text-sm text-gray-600">
                {product.vendor.signupPerson.phone}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
              <Button onClick={handleWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
                Open WhatsApp
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}