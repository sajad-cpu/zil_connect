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
import { Loader2, Upload, X } from "lucide-react";
import { badgeService } from "@/api/services/badgeService";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BadgeModalProps {
  open: boolean;
  onClose: () => void;
  badge?: any;
  businessId: string;
  onSuccess?: () => void;
}

const badgeTypes = [
  { value: "certification", label: "Certification" },
  { value: "award", label: "Award" },
  { value: "membership", label: "Membership" },
  { value: "verification", label: "Verification" },
];

export default function BadgeModal({
  open,
  onClose,
  badge,
  businessId,
  onSuccess,
}: BadgeModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    badge_type: "",
    title: "",
    issuing_organization: "",
    description: "",
    credential_id: "",
    credential_url: "",
    issue_date: "",
    expiry_date: "",
    does_not_expire: true,
  });
  const [badgeImageFile, setBadgeImageFile] = useState<File | null>(null);
  const [badgeImagePreview, setBadgeImagePreview] = useState<string>("");
  const [verificationDocFile, setVerificationDocFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (badge) {
      setFormData({
        badge_type: badge.badge_type || "",
        title: badge.title || "",
        issuing_organization: badge.issuing_organization || "",
        description: badge.description || "",
        credential_id: badge.credential_id || "",
        credential_url: badge.credential_url || "",
        issue_date: badge.issue_date || "",
        expiry_date: badge.expiry_date || "",
        does_not_expire: badge.does_not_expire ?? true,
      });
      if (badge.badge_image) {
        setBadgeImagePreview(badgeService.getBadgeImageUrl(badge));
      }
      setBadgeImageFile(null);
      setVerificationDocFile(null);
    } else {
      setFormData({
        badge_type: "",
        title: "",
        issuing_organization: "",
        description: "",
        credential_id: "",
        credential_url: "",
        issue_date: "",
        expiry_date: "",
        does_not_expire: true,
      });
      setBadgeImageFile(null);
      setBadgeImagePreview("");
      setVerificationDocFile(null);
    }
    setErrors({});
  }, [badge, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.badge_type) {
      newErrors.badge_type = "Badge type is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (!formData.issuing_organization.trim()) {
      newErrors.issuing_organization = "Issuing organization is required";
    } else if (formData.issuing_organization.length > 100) {
      newErrors.issuing_organization = "Organization name must be 100 characters or less";
    }

    if (!badge && !badgeImageFile) {
      newErrors.badge_image = "Badge image is required";
    }

    if (badgeImageFile && badgeImageFile.size > 2 * 1024 * 1024) {
      newErrors.badge_image = "Badge image must be less than 2MB";
    }

    if (verificationDocFile && verificationDocFile.size > 5 * 1024 * 1024) {
      newErrors.verification_document = "Verification document must be less than 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("badge_type", formData.badge_type);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("issuing_organization", formData.issuing_organization);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("credential_id", formData.credential_id);
      formDataToSend.append("credential_url", formData.credential_url);
      formDataToSend.append("issue_date", formData.issue_date);
      formDataToSend.append("expiry_date", formData.expiry_date);
      formDataToSend.append("does_not_expire", formData.does_not_expire.toString());

      if (badgeImageFile) {
        formDataToSend.append("badge_image", badgeImageFile);
      }

      if (verificationDocFile) {
        formDataToSend.append("verification_document", verificationDocFile);
      }

      if (badge) {
        return await badgeService.update(badge.id, formDataToSend);
      } else {
        formDataToSend.append("business", businessId);
        formDataToSend.append("verification_status", "pending");
        return await badgeService.create(formDataToSend);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: badge
          ? "Badge updated successfully"
          : "Badge created successfully. It will be reviewed for verification.",
      });
      queryClient.invalidateQueries({ queryKey: ["business-badges", businessId] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save badge",
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

  const handleBadgeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBadgeImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBadgeImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerificationDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationDocFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {badge ? "Edit Badge/Certification" : "Add Badge/Certification"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Badge Type */}
          <div>
            <Label htmlFor="badge_type">
              Badge Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.badge_type}
              onValueChange={(value) =>
                setFormData({ ...formData, badge_type: value })
              }
            >
              <SelectTrigger className={errors.badge_type ? "border-red-500" : ""}>
                <SelectValue placeholder="Select badge type" />
              </SelectTrigger>
              <SelectContent>
                {badgeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.badge_type && (
              <p className="text-sm text-red-500 mt-1">{errors.badge_type}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., ISO 9001:2015 Certified"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Issuing Organization */}
          <div>
            <Label htmlFor="issuing_organization">
              Issuing Organization <span className="text-red-500">*</span>
            </Label>
            <Input
              id="issuing_organization"
              value={formData.issuing_organization}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  issuing_organization: e.target.value,
                })
              }
              placeholder="e.g., International Organization for Standardization"
              className={errors.issuing_organization ? "border-red-500" : ""}
            />
            {errors.issuing_organization && (
              <p className="text-sm text-red-500 mt-1">
                {errors.issuing_organization}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of this badge or certification..."
              rows={3}
            />
            <p className="text-sm text-[#7C7C7C] mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Credential ID */}
            <div>
              <Label htmlFor="credential_id">Credential ID</Label>
              <Input
                id="credential_id"
                value={formData.credential_id}
                onChange={(e) =>
                  setFormData({ ...formData, credential_id: e.target.value })
                }
                placeholder="e.g., ABC-123-456"
              />
            </div>

            {/* Credential URL */}
            <div>
              <Label htmlFor="credential_url">Credential URL</Label>
              <Input
                id="credential_url"
                type="url"
                value={formData.credential_url}
                onChange={(e) =>
                  setFormData({ ...formData, credential_url: e.target.value })
                }
                placeholder="https://verify.example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Issue Date */}
            <div>
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) =>
                  setFormData({ ...formData, issue_date: e.target.value })
                }
              />
            </div>

            {/* Expiry Date */}
            <div>
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) =>
                  setFormData({ ...formData, expiry_date: e.target.value })
                }
                disabled={formData.does_not_expire}
              />
            </div>
          </div>

          {/* Does Not Expire */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="does_not_expire"
              checked={formData.does_not_expire}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, does_not_expire: checked as boolean })
              }
            />
            <Label htmlFor="does_not_expire" className="cursor-pointer">
              This badge does not expire
            </Label>
          </div>

          {/* Badge Image */}
          <div>
            <Label>
              Badge Image <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              {badgeImagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={badgeImagePreview}
                    alt="Badge preview"
                    className="w-32 h-32 object-contain border-2 border-[#E4E7EB] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBadgeImageFile(null);
                      setBadgeImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E4E7EB] rounded-lg cursor-pointer hover:border-[#6C4DE6] transition-colors">
                  <Upload className="w-8 h-8 text-[#7C7C7C] mb-2" />
                  <span className="text-sm text-[#7C7C7C]">
                    Click to upload badge image
                  </span>
                  <span className="text-xs text-[#7C7C7C] mt-1">
                    PNG, JPG (max 2MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBadgeImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.badge_image && (
              <p className="text-sm text-red-500 mt-1">{errors.badge_image}</p>
            )}
          </div>

          {/* Verification Document */}
          <div>
            <Label>Verification Document (Optional)</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-[#E4E7EB] rounded-lg cursor-pointer hover:border-[#6C4DE6] transition-colors">
                <Upload className="w-6 h-6 text-[#7C7C7C] mr-2" />
                <span className="text-sm text-[#7C7C7C]">
                  {verificationDocFile
                    ? verificationDocFile.name
                    : "Upload supporting document (PDF, Image)"}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleVerificationDocChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.verification_document && (
              <p className="text-sm text-red-500 mt-1">
                {errors.verification_document}
              </p>
            )}
            <p className="text-xs text-[#7C7C7C] mt-1">
              Upload a document to verify this badge (max 5MB)
            </p>
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
              {badge ? "Update Badge" : "Add Badge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
