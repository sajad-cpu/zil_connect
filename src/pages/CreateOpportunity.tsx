import React, { useState } from "react";
import { opportunityService } from "@/api/services/opportunityService";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import {
  Briefcase,
  ArrowLeft,
  Plus,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    type: "Project",
    description: "",
    budget: "",
    location: "",
    deadline: "",
    status: "Open",
    company_name: ""
  });

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await opportunityService.create({
        ...formData,
        requirements: requirements
      });

      toast.success("Opportunity posted successfully!");
      navigate(createPageUrl("MyOpportunities"));
    } catch (error: any) {
      console.error("Error creating opportunity:", error);
      toast.error(error.message || "Failed to create opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 mb-4">
            <Link to={createPageUrl("Opportunities")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Post New Opportunity</h1>
              <p className="text-white/90">Share your business opportunity with the community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="border-[#E4E7EB] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1E1E1E]">Opportunity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-[#1E1E1E]">Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Enterprise Software Development Project"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="border-[#E4E7EB]"
                />
              </div>

              {/* Company Name */}
              <div>
                <Label htmlFor="company_name" className="text-[#1E1E1E]">Company Name *</Label>
                <Input
                  id="company_name"
                  required
                  placeholder="Your company name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  className="border-[#E4E7EB]"
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="type" className="text-[#1E1E1E]">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="border-[#E4E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Project">Project</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Tender">Tender</SelectItem>
                      <SelectItem value="RFP">RFP</SelectItem>
                      <SelectItem value="Collaboration">Collaboration</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-[#1E1E1E]">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="border-[#E4E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-[#1E1E1E]">Description *</Label>
                <Textarea
                  id="description"
                  required
                  rows={6}
                  placeholder="Describe the opportunity in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="border-[#E4E7EB]"
                />
              </div>

              {/* Budget and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget" className="text-[#1E1E1E]">Budget</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $50,000 - $75,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="border-[#E4E7EB]"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-[#1E1E1E]">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="border-[#E4E7EB]"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <Label htmlFor="deadline" className="text-[#1E1E1E]">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="border-[#E4E7EB]"
                />
              </div>

              {/* Requirements */}
              <div>
                <Label className="text-[#1E1E1E]">Requirements (Optional)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a requirement..."
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequirement();
                      }
                    }}
                    className="border-[#E4E7EB]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddRequirement}
                    className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {requirements.length > 0 && (
                  <div className="space-y-2">
                    {requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EB]"
                      >
                        <span className="text-[#1E1E1E]">{req}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRequirement(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white disabled:opacity-50"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Opportunity"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]"
                >
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
