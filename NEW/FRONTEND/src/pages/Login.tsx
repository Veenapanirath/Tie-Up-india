
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { AuthHeader } from '@/components/auth/AuthHeader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AuthHeader title="Sign In" />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg" 
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">Don't have an account?</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="h-12 border-gray-200 hover:bg-gray-50">
                  <Link to="/signup/user" className="flex items-center justify-center">
                    <span className="font-medium">User Signup</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-12 border-gray-200 hover:bg-gray-50">
                  <Link to="/signup/vendor" className="flex items-center justify-center">
                    <span className="font-medium">Vendor Signup</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
