import { adminService } from "@/api/services/adminService";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminEnrollments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-enrollments", page, statusFilter, searchTerm],
    queryFn: () =>
      adminService.getAllEnrollments(page, 20, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateEnrollment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
      toast({
        title: "Success",
        description: "Enrollment updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update enrollment",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (enrollment: any) => {
        const product = enrollment.expand?.product || enrollment.product;
        return typeof product === "object" ? product.name : "-";
      },
    },
    {
      key: "user",
      label: "User",
      render: (enrollment: any) => {
        const user = enrollment.expand?.user || enrollment.user;
        return typeof user === "object" ? user.email : "-";
      },
    },
    {
      key: "status",
      label: "Status",
      render: (enrollment: any) => {
        const status = enrollment.status || "pending";
        const colors: Record<string, string> = {
          active: "bg-green-100 text-green-700",
          completed: "bg-blue-100 text-blue-700",
          cancelled: "bg-red-100 text-red-700",
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
      render: (enrollment: any) =>
        enrollment.created ? format(new Date(enrollment.created), "MMM d, yyyy") : "-",
    },
  ];

  const handleStatusChange = (enrollment: any, newStatus: string) => {
    updateMutation.mutate({
      id: enrollment.id,
      data: { status: newStatus },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
            <p className="text-gray-600 mt-1">View and manage product enrollments</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          data={data?.items || []}
          columns={columns}
          searchKey="status"
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
          actions={(enrollment) => (
            <Select
              value={enrollment.status || "pending"}
              onValueChange={(value) => handleStatusChange(enrollment, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </AdminLayout>
  );
}

