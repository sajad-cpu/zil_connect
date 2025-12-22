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
import { DollarSign } from "lucide-react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminCommissions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-commissions", page, statusFilter, searchTerm],
    queryFn: () =>
      adminService.getAllCommissions(page, 20, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateCommission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      toast({
        title: "Success",
        description: "Commission updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update commission",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: "enrollment",
      label: "Enrollment",
      render: (commission: any) => {
        const enrollment = commission.expand?.enrollment || commission.enrollment;
        return enrollment ? `#${typeof enrollment === "object" ? enrollment.id : enrollment}` : "-";
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (commission: any) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-semibold">${commission.amount || 0}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (commission: any) => {
        const status = commission.status || "pending";
        const colors: Record<string, string> = {
          paid: "bg-green-100 text-green-700",
          pending: "bg-yellow-100 text-yellow-700",
          cancelled: "bg-red-100 text-red-700",
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
      render: (commission: any) =>
        commission.created ? format(new Date(commission.created), "MMM d, yyyy") : "-",
    },
  ];

  const handleStatusChange = (commission: any, newStatus: string) => {
    updateMutation.mutate({
      id: commission.id,
      data: { status: newStatus },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commissions</h1>
            <p className="text-gray-600 mt-1">Manage commission transactions</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
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
          actions={(commission) => (
            <Select
              value={commission.status || "pending"}
              onValueChange={(value) => handleStatusChange(commission, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </AdminLayout>
  );
}

