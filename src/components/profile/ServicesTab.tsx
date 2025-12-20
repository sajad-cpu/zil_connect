import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Tag,
  Loader2,
} from "lucide-react";
import { businessServicesService } from "@/api/services/businessServicesService";
import ServiceModal from "@/components/modals/ServiceModal";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ServicesTabProps {
  businessId: string;
  isOwner: boolean;
}

export default function ServicesTab({ businessId, isOwner }: ServicesTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["business-services", businessId],
    queryFn: () => businessServicesService.getByBusiness(businessId, false),
  });

  const deleteMutation = useMutation({
    mutationFn: (serviceId: string) =>
      businessServicesService.delete(serviceId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["business-services", businessId] });
      setDeletingServiceId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) =>
      businessServicesService.toggleActive(serviceId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-services", businessId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service status",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (service: any) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    setDeletingServiceId(serviceId);
  };

  const confirmDelete = () => {
    if (deletingServiceId) {
      deleteMutation.mutate(deletingServiceId);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C4DE6]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Services Offered</CardTitle>
            {isOwner && (
              <Button
                size="sm"
                onClick={handleAddNew}
                className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
              >
                Add Service
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No services added yet
              </h3>
              <p className="text-gray-600 mb-4">
                {isOwner
                  ? "Add your services to help partners find you"
                  : "This business hasn't listed any services yet"}
              </p>
              {isOwner && (
                <Button
                  onClick={handleAddNew}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                >
                  Add Your First Service
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service: any) => (
                <Card
                  key={service.id}
                  className={`${
                    !service.is_active ? "opacity-60" : ""
                  } border-[#E4E7EB]`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#1E1E1E] mb-1">
                          {service.title}
                        </h4>
                        {service.category && (
                          <Badge
                            variant="outline"
                            className="text-xs border-[#6C4DE6] text-[#6C4DE6]"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {service.category}
                          </Badge>
                        )}
                      </div>
                      {isOwner && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(service)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(service.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-[#7C7C7C] mb-3">
                      {service.description}
                    </p>

                    <div className="space-y-2">
                      {service.price_range && (
                        <div className="flex items-center gap-2 text-sm text-[#1E1E1E]">
                          <DollarSign className="w-4 h-4 text-[#08B150]" />
                          <span>{service.price_range}</span>
                          {service.pricing_type && (
                            <Badge variant="secondary" className="text-xs">
                              {service.pricing_type}
                            </Badge>
                          )}
                        </div>
                      )}

                      {service.delivery_time && (
                        <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                          <Clock className="w-4 h-4" />
                          <span>Delivery: {service.delivery_time}</span>
                        </div>
                      )}
                    </div>

                    {isOwner && (
                      <div className="mt-4 pt-3 border-t border-[#E4E7EB] flex items-center justify-between">
                        <span className="text-sm text-[#7C7C7C]">Status:</span>
                        <Button
                          size="sm"
                          variant={service.is_active ? "default" : "outline"}
                          onClick={() =>
                            toggleActiveMutation.mutate({
                              serviceId: service.id,
                              isActive: !service.is_active,
                            })
                          }
                          className={
                            service.is_active
                              ? "bg-[#08B150] hover:bg-[#07A045] text-white"
                              : ""
                          }
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Modal */}
      {serviceModalOpen && (
        <ServiceModal
          open={serviceModalOpen}
          onClose={() => {
            setServiceModalOpen(false);
            setEditingService(null);
          }}
          service={editingService}
          businessId={businessId}
          onSuccess={() => {
            setServiceModalOpen(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingServiceId !== null}
        onOpenChange={() => setDeletingServiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
