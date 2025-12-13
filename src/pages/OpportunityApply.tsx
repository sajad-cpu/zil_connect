import React, { useState } from "react";
import { opportunityService } from "@/api/services/opportunityService";
import { applicationService } from "@/api/services/applicationService";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import {
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Send,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function OpportunityApply() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const opportunityId = urlParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    cover_letter: "",
    portfolio_url: ""
  });

  const { data: opportunity, isLoading } = useQuery({
    queryKey: ['opportunity-details', opportunityId],
    queryFn: async () => {
      if (!opportunityId) return null;
      return await opportunityService.getById(opportunityId);
    },
    initialData: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submission');
      return;
    }

    if (!opportunityId) {
      toast.error("Invalid opportunity");
      return;
    }

    console.log('Starting application submission for opportunity:', opportunityId);
    setIsSubmitting(true);

    try {
      // Submit application
      const result = await applicationService.apply({
        opportunity: opportunityId,
        ...formData
      });

      console.log('Application submitted successfully:', result);
      toast.success("Application submitted successfully!");

      // Keep loading state active and navigate after brief delay
      // This ensures the success message is visible and loading continues
      setTimeout(() => {
        navigate(createPageUrl("Opportunities"), { replace: true });
      }, 800);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application");
      setIsSubmitting(false); // Only reset on error
    }
  };

  // Show loading screen during initial load or submission
  if (isLoading || !opportunity) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7C7C7C]">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  // Show loading screen during submission (after form is filled)
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#08B150] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1E1E1E] font-semibold mb-2">Submitting Application...</p>
          <p className="text-[#7C7C7C]">Please wait while we process your application</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E4E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button variant="ghost" asChild className="text-[#1E1E1E] hover:bg-[#F8F9FC]">
            <Link to={createPageUrl("Opportunities")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Opportunity Info Card */}
        <Card className="border-[#E4E7EB] shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#6C4DE6] flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#1E1E1E] mb-2">{opportunity.title}</CardTitle>
                <p className="text-[#7C7C7C]">Posted by {opportunity.company_name}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#7C7C7C] mb-4">{opportunity.description}</p>
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#F8F9FC] rounded-lg border border-[#E4E7EB]">
              <div>
                <p className="text-xs text-[#7C7C7C] mb-1">Type</p>
                <p className="font-semibold text-[#1E1E1E]">{opportunity.type}</p>
              </div>
              <div>
                <p className="text-xs text-[#7C7C7C] mb-1">Budget</p>
                <p className="font-semibold text-[#1E1E1E]">{opportunity.budget}</p>
              </div>
              <div>
                <p className="text-xs text-[#7C7C7C] mb-1">Location</p>
                <p className="font-semibold text-[#1E1E1E]">{opportunity.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card className="border-[#E4E7EB] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1E1E1E]">Submit Your Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name" className="text-[#1E1E1E]">Company Name *</Label>
                  <Input
                    id="company_name"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="border-[#E4E7EB]"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person" className="text-[#1E1E1E]">Contact Person *</Label>
                  <Input
                    id="contact_person"
                    required
                    value={formData.contact_person}
                    onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                    className="border-[#E4E7EB]"
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
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cover_letter" className="text-[#1E1E1E]">Cover Letter *</Label>
                <Textarea
                  id="cover_letter"
                  required
                  rows={6}
                  placeholder="Explain why you're the right fit for this opportunity..."
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
                  className="border-[#E4E7EB]"
                />
              </div>

              <div>
                <Label htmlFor="portfolio_url" className="text-[#1E1E1E]">Portfolio URL (Optional)</Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  placeholder="https://..."
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                  className="border-[#E4E7EB]"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <Button type="button" variant="outline" asChild className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]">
                  <Link to={createPageUrl("Opportunities")}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}