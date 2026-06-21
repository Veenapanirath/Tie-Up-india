import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscriptionService";
import { Check, Zap, Crown, Star, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  _id: string;
  name: string;
  description: string;
  amount: number;
  days: number;
  productlimit: number;
  isActive: boolean;
}

export function SubscriptionPlans() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data: plansData, isLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => subscriptionService.getAllPlans(),
  });

  const plans = plansData?.data || [];

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    setLoadingPlanId(plan._id);

    try {
      // Create order
      const orderResponse = await subscriptionService.createOrder({
        amount: plan.amount,
      });

      const { razorpayOrderId, amount , orderId } = orderResponse.data;
      console.log(orderResponse.data);
      console.log("Razorpay Order ID:", orderResponse , );

      console.log( "-----------------------");
      
      // Initialize Razorpay
      const options = {
        key: "rzp_live_RLUmRAnIlvcxAr", // Replace with your Razorpay key
        amount: amount, // Amount already in paise from backend
        currency: "INR",
        name: "Tieup India",
        description: `${plan.name} Subscription`,
        order_id: orderId,
        handler: async function (response: any) {
          try {

            console.log("=== FRONTEND DEBUG ===");
            console.log("Full response:", response);
            console.log("razorpay_payment_id:", response.razorpay_payment_id);
            console.log("razorpay_order_id:", response.razorpay_order_id);
            console.log("razorpay_signature:", response.razorpay_signature);
            
            // Call confirm payment API with required parameters
            await subscriptionService.confirmPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature, // ADD THIS
              subId: plan._id,
            });

            toast({
              title: "Payment Successful!",
              description: "Your subscription has been activated successfully.",
            });

            // Redirect based on user role
            if (user.role === 'vendor') {
              window.location.href = "/vendor";
            } else {
              window.location.reload();
            }
          } catch (error: any) {
            console.error('Payment confirmation error:', error);
            toast({
              title: "Payment Confirmation Failed",
              description: error.response?.data?.message || "Please contact support if amount was deducted.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.name || "User Name",
          email: user.email || "user@example.com",
        },
        theme: {
          color: "#ea7413",
        },
        modal: {
          ondismiss: function() {
            setLoadingPlanId(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
      setLoadingPlanId(null);
    }
  };

  const getPlanIcon = (index: number) => {
    const icons = [Zap, Crown, Star, Sparkles];
    const Icon = icons[index % icons.length];
    return <Icon className="h-8 w-8" />;
  };

  const getPlanColors = (index: number) => {
    const colorSchemes = [
      {
        gradient: "from-blue-500 to-purple-600",
        badge: "bg-blue-100 text-blue-800",
        button: "bg-blue-600 hover:bg-blue-700",
        iconColor: "text-blue-600",
      },
      {
        gradient: "from-purple-500 to-pink-600",
        badge: "bg-purple-100 text-purple-800",
        button: "bg-purple-600 hover:bg-purple-700",
        iconColor: "text-purple-600",
      },
      {
        gradient: "from-green-500 to-teal-600",
        badge: "bg-green-100 text-green-800",
        button: "bg-green-600 hover:bg-green-700",
        iconColor: "text-green-600",
      },
      {
        gradient: "from-orange-500 to-red-600",
        badge: "bg-orange-100 text-orange-800",
        button: "bg-orange-600 hover:bg-orange-700",
        iconColor: "text-orange-600",
      },
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold text-gray-600">
          Loading amazing plans...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock your potential with our amazing subscription plans. Start
            selling and grow your business today!
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {plans.map((plan: Plan, index: number) => {
            const colors = getPlanColors(index);
            const isPopular = index === 1; // Make second plan popular

            return (
              <Card
                key={plan._id}
                className={`relative overflow-hidden border-0 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
                  isPopular ? "ring-4 ring-purple-400 ring-opacity-50" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

                <CardHeader className="text-center pb-4">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${colors.gradient} mb-4 mx-auto`}
                  >
                    <div className="text-white">{getPlanIcon(index)}</div>
                  </div>

                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name}
                  </CardTitle>

                  <Badge className={`${colors.badge} text-sm font-medium mb-4`}>
                    {plan.days} Days Plan
                  </Badge>

                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{plan.amount}
                    </span>
                    <span className="text-gray-500 ml-2">
                      / {plan.days} days
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-gray-600 text-center mb-6">
                    {plan.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">
                        Up to {plan.productlimit} products
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">
                        24/7 Customer Support
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">Analytics Dashboard</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">Priority Listing</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loadingPlanId === plan._id || !user}
                    className={`w-full py-6 text-lg font-semibold text-white ${colors.button} transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loadingPlanId === plan._id ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : !user ? (
                      "Login to Subscribe"
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Get This Subscription
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you choose the perfect plan for your
              business needs.
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold rounded-full transform transition-all duration-200 hover:scale-105">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
