import { adminService } from "@/api/services/adminService";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users", page, searchTerm],
    queryFn: () =>
      adminService.getAllUsers(page, 50, {
        search: searchTerm || undefined,
      }),
  });

  if (error) {
    console.error("Users query error:", error);
  }

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Record<string, any> }) =>
      adminService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: "email",
      label: "Email",
    },
    {
      key: "name",
      label: "Name",
      render: (user: any) => user.name || user.username || "-",
    },
    {
      key: "verified",
      label: "Verified",
      render: (user: any) => {
        const verified = user.verified || false;
        return (
          <Badge className={verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
            {verified ? "Verified" : "Not Verified"}
          </Badge>
        );
      },
    },
    {
      key: "created",
      label: "Created",
      render: (user: any) =>
        user.created ? format(new Date(user.created), "MMM d, yyyy") : "-",
    },
  ];

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleUpdateUser = (field: string, value: any) => {
    if (selectedUser) {
      updateUserMutation.mutate({
        userId: selectedUser.id,
        data: { [field]: value }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage platform users</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">Error loading users</p>
            <p className="text-red-600 text-sm mt-1">
              {error instanceof Error ? error.message : "Failed to fetch users. Check browser console for details."}
            </p>
            <p className="text-red-500 text-xs mt-2">
              Note: The users collection may have API rules that restrict access. Check PocketBase API rules for the users collection.
            </p>
          </div>
        )}

        {data && (
          <div className={`border rounded-lg p-3 mb-4 ${data.totalItems > data.items.length
              ? "bg-yellow-50 border-yellow-200"
              : "bg-blue-50 border-blue-200"
            }`}>
            <p className={`text-sm ${data.totalItems > data.items.length
                ? "text-yellow-800"
                : "text-blue-800"
              }`}>
              <strong>Total Users in Database:</strong> {data.totalItems} |
              <strong> Showing on Page:</strong> {data.items.length} |
              <strong> Current Page:</strong> {page}
              {data.totalItems > data.items.length && (
                <span className="block mt-2 text-xs font-semibold">
                  ⚠️ Warning: Only {data.items.length} of {data.totalItems} users are visible.
                  Check PocketBase API rules for the users collection!
                </span>
              )}
            </p>
          </div>
        )}

        <DataTable
          data={data?.items || []}
          columns={columns}
          searchKey="email"
          onSearch={setSearchTerm}
          pagination={
            data
              ? {
                page,
                perPage: 50,
                total: data.totalItems,
                onPageChange: setPage,
              }
              : undefined
          }
          loading={isLoading}
          actions={(user) => (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(user)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(user)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        />

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user role and information
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={selectedUser.email || ""} disabled />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={selectedUser.name || selectedUser.username || ""}
                    disabled
                  />
                </div>
                <div>
                  <Label>Verified</Label>
                  <Select
                    value={selectedUser.verified ? "true" : "false"}
                    onValueChange={(value) => handleUpdateUser("verified", value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Verified</SelectItem>
                      <SelectItem value="false">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

