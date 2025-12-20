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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { businessServicesService } from "@/api/services/businessServicesService";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  service?: any;
  businessId: string;
  onSuccess?: () => void;
}

const categories = [
  "Design",
  "Development",
  "Marketing",
  "Consulting",
  "Sales",
  "Support",
  "Finance",
  "Legal",
  "Other",
];

const pricingTypes = [
  { value: "hourly", label: "Hourly Rate" },
  { value: "project", label: "Project-based" },
  { value: "retainer", label: "Monthly Retainer" },
  { value: "custom", label: "Custom Pricing" },
];

export default function ServiceModal({
  open,
  onClose,
  service,
  businessId,
  onSuccess,
}: ServiceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    pricing_type: "",
    price_range: "",
    delivery_time: "",
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        category: service.category || "",
        pricing_type: service.pricing_type || "",
        price_range: service.price_range || "",
        delivery_time: service.delivery_time || "",
        is_active: service.is_active ?? true,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        pricing_type: "",
        price_range: "",
        delivery_time: "",
        is_active: true,
      });
    }
    setErrors({});
  }, [service, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Service title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (service) {
        return await businessServicesService.update(service.id, formData);
      } else {
        return await businessServicesService.create({
          ...formData,
          business: businessId,
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: service
          ? "Service updated successfully"
          : "Service created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["business-services", businessId] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save service",
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {service ? "Edit Service" : "Add New Service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Service Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Web Development"
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
              placeholder="Describe what this service includes..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            <p className="text-sm text-[#7C7C7C] mt-1">
              {formData.description.length}/500 characters
            </p>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pricing Type */}
            <div>
              <Label htmlFor="pricing_type">Pricing Type</Label>
              <Select
                value={formData.pricing_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, pricing_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing" />
                </SelectTrigger>
                <SelectContent>
                  {pricingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price Range */}
            <div>
              <Label htmlFor="price_range">Price Range</Label>
              <Input
                id="price_range"
                value={formData.price_range}
                onChange={(e) =>
                  setFormData({ ...formData, price_range: e.target.value })
                }
                placeholder="e.g., $50-$100/hr"
              />
            </div>

            {/* Delivery Time */}
            <div>
              <Label htmlFor="delivery_time">Delivery Time</Label>
              <Input
                id="delivery_time"
                value={formData.delivery_time}
                onChange={(e) =>
                  setFormData({ ...formData, delivery_time: e.target.value })
                }
                placeholder="e.g., 1-2 weeks"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked as boolean })
              }
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Service is currently active and available
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
              {service ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
