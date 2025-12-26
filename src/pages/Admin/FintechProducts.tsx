import { adminService } from "@/api/services/adminService";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminFintechProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    external_url: "",
    commission_type: "Percentage",
    commission_value: "",
    is_featured: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-fintech-products", page, searchTerm],
    queryFn: () =>
      adminService.getAllFintechProducts(page, 20, {
        search: searchTerm || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminService.createFintechProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fintech-products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        category: "",
        external_url: "",
        commission_type: "Percentage",
        commission_value: "",
        is_featured: false,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateFintechProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fintech-products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setIsDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => adminService.deleteFintechProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fintech-products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const columns = [
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "is_featured",
      label: "Featured",
      render: (product: any) => (
        <Badge className={product.is_featured ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}>
          {product.is_featured ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "created",
      label: "Created",
      render: (product: any) =>
        product.created ? format(new Date(product.created), "MMM d, yyyy") : "-",
    },
  ];

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      external_url: product.external_url || product.enrollment_url || "",
      commission_type: product.commission_type || "Percentage",
      commission_value: product.commission_value?.toString() || "",
      is_featured: product.is_featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (product: any) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      commission_value: parseFloat(formData.commission_value) || 0,
    };
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Tools</h1>
            <p className="text-gray-600 mt-1">Manage business tools marketplace</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedProduct(null);
                setFormData({
                  name: "",
                  description: "",
                  category: "",
                  external_url: "",
                  commission_type: "Percentage",
                  commission_value: "",
                  is_featured: false,
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct ? "Update product information" : "Create a new business tool"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accounting Software">Accounting Software</SelectItem>
                      <SelectItem value="Payment Processing">Payment Processing</SelectItem>
                      <SelectItem value="Business Banking">Business Banking</SelectItem>
                      <SelectItem value="Tax Software">Tax Software</SelectItem>
                      <SelectItem value="Business Analytics">Business Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>External URL *</Label>
                  <Input
                    type="url"
                    value={formData.external_url}
                    onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Commission Type</Label>
                    <Select
                      value={formData.commission_type}
                      onValueChange={(value) => setFormData({ ...formData, commission_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Commission Value</Label>
                    <Input
                      type="number"
                      value={formData.commission_value}
                      onChange={(e) => setFormData({ ...formData, commission_value: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Featured Product
                  </Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedProduct ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
          actions={(product) => (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(product)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(product)}
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

