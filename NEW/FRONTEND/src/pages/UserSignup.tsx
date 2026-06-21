
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { AuthHeader } from '@/components/auth/AuthHeader';

export default function UserSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast({
        title: "Welcome aboard!",
        description: "Your account has been created successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AuthHeader title="User Signup" />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <p className="text-gray-600 mt-2">Join our community as a user</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="pl-11 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="pl-11 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="pl-11 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="pl-11 pr-11 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium">Address (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="pl-11 min-h-[80px] border-gray-200 focus:border-primary focus:ring-primary resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg mt-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
