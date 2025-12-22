import { adminService } from "@/api/services/adminService";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminBusinesses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-businesses", page, verifiedFilter, searchTerm],
    queryFn: () =>
      adminService.getAllBusinesses(page, 20, {
        verified:
          verifiedFilter !== "all"
            ? verifiedFilter === "verified"
            : undefined,
        search: searchTerm || undefined,
      }),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ businessId, verified }: { businessId: string; verified: boolean }) =>
      adminService.verifyBusiness(businessId, verified),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
      toast({
        title: "Success",
        description: `Business ${variables.verified ? "verified" : "unverified"} successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update business",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (businessId: string) => adminService.deleteBusiness(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete business",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: "name",
      label: "Business Name",
      render: (business: any) => business.name || business.business_name || "-",
    },
    {
      key: "industry",
      label: "Industry",
    },
    {
      key: "verified",
      label: "Status",
      render: (business: any) => {
        const verified = business.verified || false;
        return (
          <Badge
            className={
              verified
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }
          >
            {verified ? "Verified" : "Unverified"}
          </Badge>
        );
      },
    },
    {
      key: "created",
      label: "Created",
      render: (business: any) =>
        business.created ? format(new Date(business.created), "MMM d, yyyy") : "-",
    },
  ];

  const handleVerify = (business: any) => {
    verifyMutation.mutate({
      businessId: business.id,
      verified: !business.verified,
    });
  };

  const handleDelete = (business: any) => {
    if (confirm(`Are you sure you want to delete ${business.name || business.business_name}?`)) {
      deleteMutation.mutate(business.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
            <p className="text-gray-600 mt-1">Manage business profiles</p>
          </div>
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          data={data?.items || []}
          columns={columns}
          searchKey="name"
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
          actions={(business) => (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVerify(business)}
                title={business.verified ? "Unverify" : "Verify"}
              >
                {business.verified ? (
                  <XCircle className="w-4 h-4 text-gray-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(business)}
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

