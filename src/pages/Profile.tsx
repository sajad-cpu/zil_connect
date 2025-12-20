import React, { useState } from "react";
import { businessService } from "@/api/services/businessService";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/pocketbaseClient";
import { toast } from "sonner";
import {
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Star,
  TrendingUp,
  Eye,
  Users,
  Edit,
  Camera,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServicesTab from "@/components/profile/ServicesTab";
import PortfolioTab from "@/components/portfolio/PortfolioTab";
import BadgesTab from "@/components/badges/BadgesTab";

export default function Profile() {
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    tagline: "",
    description: "",
    industry: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    website: ""
  });

  const { data: business, isLoading, refetch } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => businessService.getMyBusiness(),
    initialData: null,
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: true,
  });

  // Pre-fill form when editing existing business
  const handleEditClick = () => {
    if (business) {
      setFormData({
        business_name: business.business_name || "",
        tagline: business.tagline || "",
        description: business.description || "",
        industry: business.industry || "",
        city: business.location?.city || "",
        state: business.location?.state || "",
        email: business.contact_info?.email || "",
        phone: business.contact_info?.phone || "",
        website: business.contact_info?.website || ""
      });
    }
    setShowSetupForm(true);
  };

  const handleSubmitBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        toast.error("You must be logged in");
        return;
      }

      const businessData = {
        business_name: formData.business_name,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        location: {
          city: formData.city,
          state: formData.state
        },
        contact_info: {
          email: formData.email,
          phone: formData.phone,
          website: formData.website
        }
      };

      // Check if user already has a business (double-check before creating)
      const existingBusiness = await businessService.getMyBusiness();

      if (existingBusiness || business) {
        // Update existing business
        const businessId = business?.id || existingBusiness?.id;
        if (!businessId) {
          toast.error("Unable to identify business to update");
          return;
        }
        await businessService.update(businessId, businessData);
        toast.success("Business profile updated successfully!");
      } else {
        // Create new business - only if no existing business found
        await businessService.create({
          ...businessData,
          owner: userId,
          trust_score: 0,
          profile_views: 0,
          engagement_score: 0,
          is_verified: false
        });
        toast.success("Business profile created successfully!");
      }

      // Refetch to get updated data
      await refetch();
      setShowSetupForm(false);
    } catch (error: any) {
      console.error("Error saving business:", error);

      // Handle unique constraint error
      if (error.message?.includes('unique') || error.message?.includes('owner')) {
        toast.error("You already have a business profile. Please update your existing profile.");
        // Refetch to ensure we have the existing business
        await refetch();
        setShowSetupForm(false);
      } else {
        toast.error(error.message || "Failed to save business profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7C7C7C]">Loading profile...</p>
        </div>
      </div>
    );
  }

  // No business - show setup form
  if (!business || showSetupForm) {
    return (
      <div className="min-h-screen bg-[#F8F9FC]">
        <div className="bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] text-white">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{business ? "Edit Business Profile" : "Create Your Business Profile"}</h1>
                <p className="text-white/90">{business ? "Update your business information" : "Set up your business to start connecting with partners"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="border-[#E4E7EB] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1E1E1E]">Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBusiness} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="business_name" className="text-[#1E1E1E]">Business Name *</Label>
                    <Input
                      id="business_name"
                      required
                      value={formData.business_name}
                      onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                      className="border-[#E4E7EB]"
                      placeholder="Your Business Inc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry" className="text-[#1E1E1E]">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                      <SelectTrigger className="border-[#E4E7EB]">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-[#1E1E1E]">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    className="border-[#E4E7EB]"
                    placeholder="A brief description of what you do"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-[#1E1E1E]">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="border-[#E4E7EB]"
                    placeholder="Tell us about your business..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city" className="text-[#1E1E1E]">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="border-[#E4E7EB]"
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-[#1E1E1E]">State *</Label>
                    <Input
                      id="state"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="border-[#E4E7EB]"
                      placeholder="CA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-[#1E1E1E]">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="border-[#E4E7EB]"
                      placeholder="hello@yourbusiness.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#1E1E1E]">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="border-[#E4E7EB]"
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="text-[#1E1E1E]">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="border-[#E4E7EB]"
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                  >
                    {business ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Updating..." : "Update Business Profile"}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Creating..." : "Create Business Profile"}
                      </>
                    )}
                  </Button>
                  {showSetupForm && business && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSetupForm(false)}
                      className="border-[#E4E7EB] text-[#1E1E1E]"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600')] opacity-20 bg-cover bg-center" />
        <div className="absolute bottom-4 right-4">
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Camera className="w-4 h-4 mr-2" />
            Change Cover
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        {/* Profile Header Card */}
        <Card className="border-none shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-5xl shadow-xl">
                  {business?.business_name?.[0]?.toUpperCase() || <Building2 className="w-16 h-16" />}
                </div>
                <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{business?.business_name || 'Business Name'}</h1>
                    <p className="text-gray-600 text-lg mb-3">{business?.tagline || 'No tagline'}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {business?.industry || 'Not specified'}
                      </Badge>
                      {business?.is_verified ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                          Not Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button onClick={handleEditClick} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {business?.location?.city && business?.location?.state && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{business.location.city}, {business.location.state}</span>
                    </div>
                  )}
                  {business?.contact_info?.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{business.contact_info.email}</span>
                    </div>
                  )}
                  {business?.contact_info?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{business.contact_info.phone}</span>
                    </div>
                  )}
                  {business?.contact_info?.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{business.contact_info.website || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{business?.trust_score || 0}</span>
                </div>
                <p className="text-xs text-gray-500">Trust Score</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{business?.profile_views || 0}</span>
                </div>
                <p className="text-xs text-gray-500">Profile Views</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">0</span>
                </div>
                <p className="text-xs text-gray-500">Connections</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{business?.engagement_score || 0}</span>
                </div>
                <p className="text-xs text-gray-500">Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion Alert */}
        <Card className="border-none shadow-lg mb-8 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">🚀 Complete Your Profile</h3>
                <p className="text-gray-700 mb-4">
                  Your profile is <strong>30% complete</strong>. Add more information to increase visibility and build trust with potential partners.
                </p>
                <div className="flex gap-3">
                  <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    Get Verified
                  </Button>
                  <Button size="sm" variant="outline">
                    Add Portfolio
                  </Button>
                  <Button size="sm" variant="outline">
                    Add Certifications
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="badges">Badges & Certifications</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>About Our Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{business?.description || 'No description available'}</p>
                <Button variant="outline" onClick={handleEditClick}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Description
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <ServicesTab businessId={business.id} isOwner={true} />
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <PortfolioTab businessId={business.id} isOwner={true} />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Reviews & Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Partner with businesses to start receiving reviews</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <BadgesTab businessId={business.id} isOwner={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}