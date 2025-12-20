import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tag,
  Percent,
  Calendar,
  FileText,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { pb } from "@/api/pocketbaseClient";

export default function CreateOffer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userBusiness, setUserBusiness] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    valid_until: "",
    terms: "",
    is_featured: false,
  });

  // Fetch user's business on mount
  useEffect(() => {
    const fetchUserBusiness = async () => {
      try {
        const userId = pb.authStore.model?.id;
        if (!userId) {
          setError("You must be logged in to create offers");
          return;
        }

        const businesses = await pb.collection('businesses').getFullList({
          filter: `owner = "${userId}"`
        });

        if (businesses.length === 0) {
          setError("You need to create a business first before creating offers");
          return;
        }

        setUserBusiness(businesses[0]);
      } catch (err) {
        console.error("Error fetching business:", err);
        setError("Failed to load your business information");
      }
    };

    fetchUserBusiness();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Please enter an offer title");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description");
      return false;
    }

    const discount = parseInt(formData.discount_percentage);
    if (!discount || discount < 1 || discount > 100) {
      setError("Discount must be between 1% and 100%");
      return false;
    }

    if (formData.valid_until) {
      const validDate = new Date(formData.valid_until);
      if (validDate < new Date()) {
        setError("Expiration date must be in the future");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!userBusiness) {
      setError("Business information not loaded");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userId = pb.authStore.model?.id;

      await pb.collection('offers').create({
        title: formData.title,
        description: formData.description,
        business: userBusiness.id,
        business_name: userBusiness.business_name || userBusiness.name,
        discount_percentage: parseInt(formData.discount_percentage),
        valid_until: formData.valid_until || null,
        terms: formData.terms || null,
        is_featured: formData.is_featured,
        redemptions: 0,
        created_by: userId
      });

      toast({
        title: "Offer Created! 🎉",
        description: "Your offer has been published successfully.",
      });

      // Redirect to offers page or my offers page
      setTimeout(() => {
        navigate("/Offers");
      }, 1500);

    } catch (err: any) {
      console.error("Error creating offer:", err);
      setError(err.message || "Failed to create offer. Please try again.");
      toast({
        title: "Error",
        description: "Failed to create offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userBusiness && !error) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#6C4DE6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:text-white/80 hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Create New Offer</h1>
          </div>
          <p className="text-xl text-white/90">Share exclusive deals with the community</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-[#E4E7EB] shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1E1E1E]">Offer Details</CardTitle>
              <CardDescription>
                Fill in the information about your special offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Info */}
                {userBusiness && (
                  <div className="bg-[#F8F9FC] border border-[#E4E7EB] rounded-lg p-4">
                    <Label className="text-sm text-[#7C7C7C]">Your Business</Label>
                    <p className="text-lg font-semibold text-[#1E1E1E]">
                      {userBusiness.business_name || userBusiness.name}
                    </p>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#1E1E1E] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Offer Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Summer Special - 50% Off All Services"
                    value={formData.title}
                    onChange={handleChange}
                    className="border-[#E4E7EB]"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#1E1E1E] flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your offer in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="border-[#E4E7EB]"
                    required
                  />
                </div>

                {/* Discount Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage" className="text-[#1E1E1E] flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Discount Percentage *
                  </Label>
                  <div className="relative">
                    <Input
                      id="discount_percentage"
                      name="discount_percentage"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g., 50"
                      value={formData.discount_percentage}
                      onChange={handleChange}
                      className="border-[#E4E7EB] pr-12"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7C7C7C]">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-[#7C7C7C]">Enter a value between 1 and 100</p>
                </div>

                {/* Valid Until */}
                <div className="space-y-2">
                  <Label htmlFor="valid_until" className="text-[#1E1E1E] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Expiration Date (Optional)
                  </Label>
                  <Input
                    id="valid_until"
                    name="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={handleChange}
                    className="border-[#E4E7EB]"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-[#7C7C7C]">Leave empty for no expiration</p>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-2">
                  <Label htmlFor="terms" className="text-[#1E1E1E] flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Terms & Conditions (Optional)
                  </Label>
                  <Textarea
                    id="terms"
                    name="terms"
                    placeholder="e.g., Valid for new customers only. Cannot be combined with other offers..."
                    value={formData.terms}
                    onChange={handleChange}
                    rows={3}
                    className="border-[#E4E7EB]"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#F8F9FC] border border-[#E4E7EB] rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="is_featured" className="text-[#1E1E1E] font-semibold">
                      Featured Offer
                    </Label>
                    <p className="text-sm text-[#7C7C7C]">
                      Featured offers appear in the carousel on the offers page
                    </p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1 border-[#E4E7EB]"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#08B150] hover:bg-[#06893f] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Tag className="w-4 h-4 mr-2" />
                        Create Offer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
