import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, X } from "lucide-react";
import { portfolioService } from "@/api/services/portfolioService";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PortfolioModalProps {
  open: boolean;
  onClose: () => void;
  portfolioItem?: any;
  businessId: string;
  onSuccess?: () => void;
}

export default function PortfolioModal({
  open,
  onClose,
  portfolioItem,
  businessId,
  onSuccess,
}: PortfolioModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    client_name: "",
    project_date: "",
    duration: "",
    project_url: "",
    case_study_url: "",
    is_featured: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (portfolioItem) {
      setFormData({
        title: portfolioItem.title || "",
        description: portfolioItem.description || "",
        category: portfolioItem.category || "",
        client_name: portfolioItem.client_name || "",
        project_date: portfolioItem.project_date || "",
        duration: portfolioItem.duration || "",
        project_url: portfolioItem.project_url || "",
        case_study_url: portfolioItem.case_study_url || "",
        is_featured: portfolioItem.is_featured || false,
      });
      setTechnologies(portfolioItem.technologies?.join(", ") || "");
      setExistingImages(portfolioItem.images || []);
      setSelectedFiles([]);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        client_name: "",
        project_date: "",
        duration: "",
        project_url: "",
        case_study_url: "",
        is_featured: false,
      });
      setTechnologies("");
      setExistingImages([]);
      setSelectedFiles([]);
    }
    setErrors({});
  }, [portfolioItem, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    if (!portfolioItem && selectedFiles.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("client_name", formData.client_name);
      formDataToSend.append("project_date", formData.project_date);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("project_url", formData.project_url);
      formDataToSend.append("case_study_url", formData.case_study_url);
      formDataToSend.append("is_featured", formData.is_featured.toString());

      // Handle technologies as JSON array
      const techArray = technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      formDataToSend.append("technologies", JSON.stringify(techArray));

      // Add new images
      selectedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      if (portfolioItem) {
        return await portfolioService.update(portfolioItem.id, formDataToSend);
      } else {
        formDataToSend.append("business", businessId);
        return await portfolioService.create(formDataToSend);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: portfolioItem
          ? "Portfolio item updated successfully"
          : "Portfolio item created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio-items", businessId] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save portfolio item",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate();
    }
  };

  const handleRemoveExistingImage = async (imageFilename: string) => {
    if (!portfolioItem) return;

    try {
      await portfolioService.deleteImage(portfolioItem.id, imageFilename);
      setExistingImages(existingImages.filter((img) => img !== imageFilename));
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio-items", businessId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {portfolioItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Project Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., E-commerce Website Redesign"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the project, your role, and key achievements..."
              rows={5}
              className={errors.description ? "border-red-500" : ""}
            />
            <p className="text-sm text-[#7C7C7C] mt-1">
              {formData.description.length}/1000 characters
            </p>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Web Design"
              />
            </div>

            {/* Client Name */}
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                placeholder="e.g., ABC Company"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Project Date */}
            <div>
              <Label htmlFor="project_date">Completion Date</Label>
              <Input
                id="project_date"
                type="date"
                value={formData.project_date}
                onChange={(e) =>
                  setFormData({ ...formData, project_date: e.target.value })
                }
              />
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 3 months"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <Label htmlFor="technologies">Technologies Used</Label>
            <Input
              id="technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g., React, Node.js, PostgreSQL (comma-separated)"
            />
            <p className="text-xs text-[#7C7C7C] mt-1">
              Separate multiple technologies with commas
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Project URL */}
            <div>
              <Label htmlFor="project_url">Project URL</Label>
              <Input
                id="project_url"
                type="url"
                value={formData.project_url}
                onChange={(e) =>
                  setFormData({ ...formData, project_url: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>

            {/* Case Study URL */}
            <div>
              <Label htmlFor="case_study_url">Case Study URL</Label>
              <Input
                id="case_study_url"
                type="url"
                value={formData.case_study_url}
                onChange={(e) =>
                  setFormData({ ...formData, case_study_url: e.target.value })
                }
                placeholder="https://example.com/case-study"
              />
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <Label>Current Images</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={portfolioService.getImageUrl(portfolioItem, img, "300x200")}
                      alt={`Existing ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-[#E4E7EB]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <Label>
              {portfolioItem ? "Add More Images" : "Project Images"}{" "}
              {!portfolioItem && <span className="text-red-500">*</span>}
            </Label>
            <FileUpload
              accept="image/*"
              maxFiles={5 - existingImages.length}
              maxSize={5}
              onFilesSelected={setSelectedFiles}
              preview={true}
              multiple={true}
              value={selectedFiles}
              className="mt-2"
            />
            {errors.images && (
              <p className="text-sm text-red-500 mt-1">{errors.images}</p>
            )}
            <p className="text-xs text-[#7C7C7C] mt-1">
              Maximum 5 images total. JPG, PNG, or WebP. Up to 5MB each.
            </p>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_featured: checked as boolean })
              }
            />
            <Label htmlFor="is_featured" className="cursor-pointer">
              Feature this project (display prominently on profile)
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {portfolioItem ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
