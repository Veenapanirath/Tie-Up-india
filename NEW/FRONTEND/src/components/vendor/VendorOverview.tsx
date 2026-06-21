
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscriptionService";
import { productService } from "@/services/productService";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Package,
  CreditCard
} from "lucide-react";

export function VendorOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const { data: subscriptionData } = useQuery({
    queryKey: ['vendor-subscription', user?._id],
    queryFn: () => subscriptionService.getCurrentSubscription(user?._id || ''),
    enabled: !!user?._id,
  });

  const { data: productsData } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: () => productService.getVendorProducts(),
  });

  useEffect(() => {
    if (subscriptionData?.data) {
      setSubscription(subscriptionData.data);
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (productsData?.data) {
      setProducts(productsData.data);
    }
  }, [productsData]);

  const hasActiveSubscription = subscription && new Date(subscription.endDate) > new Date();

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          Your Business Dashboard
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Manage your products and track your performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {hasActiveSubscription ? (
          <>
            <AnalyticsCard
              title="Plan Expiry Date"
              value={new Date(subscription.endDate).toLocaleDateString()}
              description={`${subscription.sub.name} Plan Active`}
              trend="neutral"
              icon={<Calendar className="h-6 w-6" />}
            />
            <AnalyticsCard
              title="Product Limit"
              value={`${subscription.remainingProductCount}/${subscription.sub.productlimit}`}
              description="Products remaining"
              trend="neutral"
              icon={<Package className="h-6 w-6" />}
            />
          </>
        ) : (
          <AnalyticsCard
            title="Subscription Status"
            value="No Active Plan"
            description="Buy a plan to start selling"
            trend="down"
            icon={<CreditCard className="h-6 w-6" />}
          />
        )}
        <AnalyticsCard
          title="Products Listed"
          value={products.length.toString()}
          description={`${products.filter(p => p.isActive).length} active`}
          trend="up"
          icon={<Package className="h-6 w-6" />}
        />
      </div>

      {!hasActiveSubscription && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-orange-900 mb-2">
                  No Active Subscription
                </h3>
                <p className="text-sm md:text-base text-orange-700">
                  Subscribe to a plan to start listing your products and reach more customers.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/vendor/plans')}
                className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Buy Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
