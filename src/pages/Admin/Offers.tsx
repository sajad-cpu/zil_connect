import { adminService } from "@/api/services/adminService";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminOffers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-offers", page, searchTerm],
    queryFn: () =>
      adminService.getAllOffers(page, 20, {
        search: searchTerm || undefined,
      }),
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" | "delete" }) =>
      adminService.moderateOffer(id, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast({
        title: "Success",
        description: `Offer ${variables.action}d successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to moderate offer",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "status",
      label: "Status",
      render: (offer: any) => {
        const status = offer.status || "pending";
        const colors: Record<string, string> = {
          active: "bg-green-100 text-green-700",
          rejected: "bg-red-100 text-red-700",
          pending: "bg-yellow-100 text-yellow-700",
        };
        return (
          <Badge className={colors[status] || colors.pending}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: "created",
      label: "Created",
      render: (offer: any) =>
        offer.created ? format(new Date(offer.created), "MMM d, yyyy") : "-",
    },
  ];

  const handleApprove = (offer: any) => {
    moderateMutation.mutate({ id: offer.id, action: "approve" });
  };

  const handleReject = (offer: any) => {
    moderateMutation.mutate({ id: offer.id, action: "reject" });
  };

  const handleDelete = (offer: any) => {
    if (confirm(`Are you sure you want to delete "${offer.title}"?`)) {
      moderateMutation.mutate({ id: offer.id, action: "delete" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offers</h1>
          <p className="text-gray-600 mt-1">Moderate business offers</p>
        </div>

        <DataTable
          data={data?.items || []}
          columns={columns}
          searchKey="title"
          onSearch={setSearchTerm}
          pagination={
            data
              ? {
                page,
                perPage: 20,
                total: data.totalItems,
                onPageChange: setPage,
              }
              : undefined
          }
          loading={isLoading}
          actions={(offer) => (
            <>
              {offer.status !== "active" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleApprove(offer)}
                  title="Approve"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </Button>
              )}
              {offer.status !== "rejected" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReject(offer)}
                  title="Reject"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(offer)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        />
      </div>
    </AdminLayout>
  );
}

