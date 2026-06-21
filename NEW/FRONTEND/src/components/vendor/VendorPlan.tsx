
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscriptionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { 
  Package,
  BarChart3,
  MessageSquare,
  CreditCard
} from "lucide-react";

export function VendorPlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data: subscriptionData } = useQuery({
    queryKey: ['vendor-subscription', user?._id],
    queryFn: () => subscriptionService.getCurrentSubscription(user?._id || ''),
    enabled: !!user?._id,
  });

  const { data: plansData } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getAllPlans(),
  });

  const plans = plansData?.data || [];

  useEffect(() => {
    if (subscriptionData?.data) {
      setSubscription(subscriptionData.data);
    }
  }, [subscriptionData]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubscribe = async (plan: any) => {
    setLoadingPlanId(plan._id);
    
    try {
      const orderResponse = await subscriptionService.createOrder({
        amount: plan.amount
      });

      const { razorpayOrderId, amount } = orderResponse.data;
      console.log(orderResponse.data);
      console.log("Razorpay Order ID:", razorpayOrderId);
      

      const options = {
        key: 'rzp_live_RLUmRAnIlvcxAr',
        amount: amount, // Amount already in paise from backend
        currency: 'INR',
        name: 'Tieup India',
        description: `${plan.name} Subscription`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {


              console.log("=== FRONTEND DEBUG === vendor plan.tsx ===");
            console.log("Full response:", response);
            console.log("razorpay_payment_id:", response.razorpay_payment_id);
            console.log("razorpay_order_id:", response.razorpay_order_id);
            console.log("razorpay_signature:", response.razorpay_signature);

            await subscriptionService.confirmPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              subId: plan._id
            });
            
            toast({
              title: "Payment Successful!",
              description: "Your subscription has been activated successfully.",
            });
            
            window.location.reload();
          } catch (error) {
            toast({
              title: "Payment Confirmation Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: user?.name || 'Vendor Name',
          email: user?.email || 'vendor@example.com'
        },
        theme: {
          color: '#ea7413'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  const hasActiveSubscription = subscription && new Date(subscription.endDate) > new Date();

  if (!hasActiveSubscription) {
    return <SubscriptionPlans />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          My Subscription Plan
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Manage your subscription and billing
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="text-center p-4 md:p-6 bg-primary/10 rounded-xl">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">{subscription.sub.name}</h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{subscription.sub.description}</p>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                ₹{subscription.sub.amount}
                <span className="text-base md:text-lg text-gray-600">/{subscription.sub.days} days</span>
              </div>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Start Date</span>
                <span className="font-semibold">{new Date(subscription.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">End Date</span>
                <span className="font-semibold">{new Date(subscription.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Products Limit</span>
                <span className="font-semibold">{subscription.sub.productlimit}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold text-primary">{subscription.remainingProductCount}/{subscription.sub.productlimit}</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full" 
                style={{ 
                  width: `${((subscription.sub.productlimit - subscription.remainingProductCount) / subscription.sub.productlimit) * 100}%` 
                }}
              ></div>
            </div>
            
            {/* <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 md:pt-4">
              <Button 
                onClick={() => navigate('/vendor/plans')}
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm md:text-base"
              >
                Upgrade Plan
              </Button>
              <Button 
                onClick={() => navigate('/vendor/plans')}
                variant="outline" 
                className="flex-1 text-sm md:text-base"
              >
                Renew Plan
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
