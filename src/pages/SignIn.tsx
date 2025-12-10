import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { createPageUrl } from "@/utils";
import { pb } from "@/api/pocketbaseClient";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    // Only redirect if we have a valid token AND user model
    if (pb.authStore.isValid && pb.authStore.model) {
      navigate("/Home", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Authenticate with PocketBase
      const authData = await pb.collection('users').authWithPassword(email, password);

      toast({
        title: "Login Successful! 🎉",
        description: `Welcome back, ${authData.record.name}!`,
        className: "bg-[#08B150] text-white border-none",
      });

      // Redirect to home page after successful login
      setTimeout(() => {
        navigate("/Home", { replace: true });
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);

      if (err.status === 400) {
        setError("Invalid email or password. Please try again.");
      } else if (err.status === 0) {
        setError("Cannot connect to server. Please check if PocketBase is running.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#241C3A] via-[#3C2F63] to-[#241C3A] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#6C4DE6]/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#318FFD]/10 blur-3xl"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#6C4DE6] rounded-2xl shadow-2xl mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Zil Connect</h1>
          <p className="text-white/80 text-lg">Welcome back to your business network</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-[#1E1E1E]">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-[#7C7C7C]">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert className="border-[#FF4C4C] bg-[#FF4C4C]/10">
                      <AlertCircle className="h-4 w-4 text-[#FF4C4C]" />
                      <AlertDescription className="text-[#FF4C4C] ml-2">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1E1E1E]">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-[#E4E7EB] focus:border-[#6C4DE6] focus:ring-[#6C4DE6]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1E1E1E]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-[#E4E7EB] focus:border-[#6C4DE6] focus:ring-[#6C4DE6]"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] hover:text-[#6C4DE6] transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 rounded border-[#E4E7EB] text-[#6C4DE6] focus:ring-[#6C4DE6]"
                      disabled={isLoading}
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-[#7C7C7C]">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-[#6C4DE6] hover:text-[#593CC9] transition-colors font-medium"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#6C4DE6] hover:bg-[#593CC9] text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E4E7EB]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#7C7C7C]">Don't have an account?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC] font-semibold transition-all duration-300"
                  onClick={() => navigate("/SignUp")}
                  disabled={isLoading}
                >
                  Create New Account
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 text-white/60 text-sm"
        >
          <p>© 2025 Zil Connect. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
