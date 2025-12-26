import { businessService } from "@/api/services/businessService";
import { enrollmentService } from "@/api/services/enrollmentService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
  onSuccess?: () => void;
}

export default function EnrollmentModal({
  open,
  onClose,
  product,
  onSuccess,
}: EnrollmentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: businesses = [], isLoading: businessesLoading, error: businessesError } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: () => businessService.getMyBusiness(),
    enabled: open && !!product,
    retry: 1,
  });

  const [existingEnrollment, setExistingEnrollment] = useState<any>(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  useEffect(() => {
    const checkExisting = async () => {
      if (!product?.id || !selectedBusinessId || !open) return;
      
      setCheckingEnrollment(true);
      try {
        const existing = await enrollmentService.checkExistingEnrollment(
          product.id,
          selectedBusinessId
        );
        setExistingEnrollment(existing);
      } catch (error) {
        console.error("Error checking existing enrollment:", error);
        setExistingEnrollment(null);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    if (selectedBusinessId && product?.id) {
      checkExisting();
    } else {
      setExistingEnrollment(null);
    }
  }, [product?.id, selectedBusinessId, open]);

  const enrollmentMutation = useMutation({
    mutationFn: async (businessId: string) => {
      try {
        console.log("Starting enrollment for product:", product.id, "business:", businessId);

        if (existingEnrollment && existingEnrollment.status !== 'Cancelled') {
          console.log("Existing enrollment found, getting enrollment URL...");
          const enrollmentUrl = await enrollmentService.getEnrollmentUrl(
            product.id,
            businessId
          );
          return { enrollment: existingEnrollment, enrollmentUrl, isExisting: true };
        }

        console.log("Creating new enrollment...");
        const enrollment = await enrollmentService.createEnrollment({
          productId: product.id,
          businessId: businessId,
          enrollmentMethod: 'Direct Link',
        });
        console.log("Enrollment created:", enrollment.id);

        console.log("Getting enrollment URL...");
        const enrollmentUrl = await enrollmentService.getEnrollmentUrl(
          product.id,
          businessId
        );
        console.log("Enrollment URL:", enrollmentUrl);

        return { enrollment, enrollmentUrl, isExisting: false };
      } catch (error: any) {
        console.error("Error in enrollment mutation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['fintech-products'] });
      queryClient.invalidateQueries({ queryKey: ['user-enrollments'] });

      setIsRedirecting(true);

      if (data.isExisting) {
        toast({
          title: "Redirecting to Enrollment",
          description: `Opening your existing enrollment for ${product.name}.`,
        });
      } else {
        toast({
          title: "✅ Enrollment Successful!",
          description: `You've enrolled in ${product.name}. Check your Profile → My Enrollments to track it.`,
        });
      }

      setTimeout(() => {
        window.open(data.enrollmentUrl, '_blank');
        if (onSuccess) {
          onSuccess();
        }
        onClose();
        setIsRedirecting(false);
      }, 1500);
    },
    onError: (error: any) => {
      console.error("Enrollment error:", error);
      console.error("Error details:", error.response || error.message || error);
      setIsRedirecting(false);
      toast({
        title: "Enrollment Failed",
        description: error.message || error.response?.data?.message || "Failed to create enrollment. Please check the console for details and try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsRedirecting(false);
    },
  });

  useEffect(() => {
    if (businesses && !businessesLoading) {
      if (Array.isArray(businesses) && businesses.length > 0) {
        if (!selectedBusinessId) {
          setSelectedBusinessId(businesses[0].id);
        }
      } else if (businesses && !Array.isArray(businesses) && businesses.id) {
        if (!selectedBusinessId) {
          setSelectedBusinessId(businesses.id);
        }
      }
    }
  }, [businesses, businessesLoading, selectedBusinessId]);

  const handleEnroll = () => {
    if (!product || !product.id) {
      toast({
        title: "Error",
        description: "Product information is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBusinessId) {
      toast({
        title: "Business Required",
        description: "Please select a business for enrollment",
        variant: "destructive",
      });
      return;
    }

    try {
      enrollmentMutation.mutate(selectedBusinessId);
    } catch (error: any) {
      console.error("Error starting enrollment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start enrollment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!open) {
    return null;
  }

  if (!product || !product.id) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Product information is missing. Please try again.
            </DialogDescription>
          </DialogHeader>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const business = Array.isArray(businesses) ? businesses[0] : businesses;
  const hasBusiness = business && business.id;

  if (!hasBusiness) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Business Profile Required</DialogTitle>
            <DialogDescription>
              You need to create a business profile before enrolling in products.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                  Please create a business profile first to enroll in business tools.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in {product.name || 'Product'}</DialogTitle>
          <DialogDescription>
            Select a business to enroll in this product. You'll be redirected to complete the enrollment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="business">Select Business</Label>
            {businessesLoading ? (
              <div className="mt-2 p-4 text-center text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                Loading businesses...
              </div>
            ) : businessesError ? (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load businesses. Please try again.
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={selectedBusinessId}
                onValueChange={setSelectedBusinessId}
              >
                <SelectTrigger id="business" className="mt-2">
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(businesses) ? (
                    businesses.map((biz: any) => (
                      <SelectItem key={biz.id} value={biz.id}>
                        {biz.business_name || biz.name || 'Business'}
                      </SelectItem>
                    ))
                  ) : (
                    business && business.id && (
                      <SelectItem value={business.id}>
                        {business.business_name || business.name || 'Business'}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {existingEnrollment && existingEnrollment.status !== 'Cancelled' ? (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-gray-700">
                <strong className="text-gray-900">Existing Enrollment Found:</strong> You have a {existingEnrollment.status?.toLowerCase()} enrollment for this product. Click "Continue Enrollment" to proceed to the enrollment page.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                After clicking "Enroll Now", you'll be redirected to the product's enrollment page.
                Your enrollment will be tracked automatically.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={enrollmentMutation.isPending || isRedirecting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={enrollmentMutation.isPending || isRedirecting || !selectedBusinessId || checkingEnrollment}
            className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white disabled:opacity-50"
          >
            {checkingEnrollment ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : enrollmentMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {existingEnrollment ? 'Opening...' : 'Enrolling...'}
              </>
            ) : enrollmentMutation.isError ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Try Again
              </>
            ) : existingEnrollment && existingEnrollment.status !== 'Cancelled' ? (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Continue Enrollment
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Enroll Now
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

