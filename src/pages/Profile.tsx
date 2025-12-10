import React, { useState } from "react";
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
  Camera
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Profile() {
  // Mock business data
  const business = {
    business_name: "Your Business",
    tagline: "Complete your profile to get started",
    description: "Add a compelling description about your business...",
    industry: "Technology",
    location: { city: "San Francisco", state: "CA" },
    contact_info: { email: "hello@yourbusiness.com", phone: "+1-555-0123", website: "yourbusiness.com" },
    trust_score: 0,
    profile_views: 0,
    engagement_score: 0,
    is_verified: false,
    verified_badges: [],
    certifications: [],
    services: [],
    portfolio: []
  };

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
                  {business.business_name[0].toUpperCase()}
                </div>
                <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.business_name}</h1>
                    <p className="text-gray-600 text-lg mb-3">{business.tagline}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {business.industry}
                      </Badge>
                      {business.is_verified ? (
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
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{business.location.city}, {business.location.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{business.contact_info.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{business.contact_info.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{business.contact_info.website}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{business.trust_score}</span>
                </div>
                <p className="text-xs text-gray-500">Trust Score</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{business.profile_views}</span>
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
                  <span className="text-2xl font-bold text-gray-900">{business.engagement_score}</span>
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
                <p className="text-gray-600 mb-6">{business.description}</p>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Description
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Services Offered</CardTitle>
                  <Button size="sm">Add Service</Button>
                </div>
              </CardHeader>
              <CardContent>
                {business.services.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No services added yet</h3>
                    <p className="text-gray-600 mb-4">Add your services to help partners find you</p>
                    <Button>Add Your First Service</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.services.map((service, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <p className="font-medium">{service}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Portfolio</CardTitle>
                  <Button size="sm">Add Project</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Showcase your work</h3>
                  <p className="text-gray-600 mb-4">Add projects to demonstrate your expertise</p>
                  <Button>Add Your First Project</Button>
                </div>
              </CardContent>
            </Card>
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
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Trust Badges & Certifications</CardTitle>
                  <Button size="sm">Add Certification</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Build credibility</h3>
                  <p className="text-gray-600 mb-4">Add certifications and badges to stand out</p>
                  <Button>Get Verified</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}