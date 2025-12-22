import { adminService } from "@/api/services/adminService";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages", page, searchTerm],
    queryFn: () =>
      adminService.getAllMessages(page, 20, {
        search: searchTerm || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => adminService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: "content",
      label: "Content",
      render: (message: any) => (
        <div className="max-w-md truncate">{message.content || "-"}</div>
      ),
    },
    {
      key: "created",
      label: "Created",
      render: (message: any) =>
        message.created ? format(new Date(message.created), "MMM d, yyyy HH:mm") : "-",
    },
  ];

  const handleDelete = (message: any) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(message.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Moderate user messages</p>
        </div>

        <DataTable
          data={data?.items || []}
          columns={columns}
          searchKey="content"
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
          actions={(message) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(message)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        />
      </div>
    </AdminLayout>
  );
}

