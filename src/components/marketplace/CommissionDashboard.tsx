import { commissionService } from "@/api/services/commissionService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, DollarSign, Download, Loader2, Package, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export default function CommissionDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ['all-commissions', statusFilter, startDate, endDate],
    queryFn: () => commissionService.getCommissions({
      status: statusFilter !== "all" ? statusFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
  });

  const { data: totalEarnings } = useQuery({
    queryKey: ['total-earnings', statusFilter, startDate, endDate],
    queryFn: () => commissionService.getTotalEarnings({
      status: statusFilter !== "all" ? statusFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Approved': 'bg-blue-100 text-blue-700 border-blue-200',
      'Paid': 'bg-green-100 text-green-700 border-green-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <Badge className={`${statusConfig[status] || statusConfig['Pending']} text-xs`}>
        {status}
      </Badge>
    );
  };

  const getCommissionTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {type}
      </Badge>
    );
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">${totalEarnings?.total.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-white/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 mb-1">Pending</p>
                <p className="text-3xl font-bold">${totalEarnings?.pending.toFixed(2) || '0.00'}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-green-400 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold">{totalEarnings?.count || 0}</p>
              </div>
              <Package className="w-8 h-8 text-white/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 mb-1">Active Users</p>
                <p className="text-3xl font-bold">
                  {new Set(commissions.map((c: any) => c.user)).size}
                </p>
              </div>
              <Users className="w-8 h-8 text-white/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Commission Transactions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("all");
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear Filters
            </Button>
          </div>

          {commissions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No commissions found</h3>
              <p className="text-gray-600">Commissions will appear here as users enroll in products</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission: any) => {
                    const product = commission.expand?.product || commission.product;
                    const business = commission.expand?.business || commission.business;
                    const user = commission.expand?.user || commission.user;

                    return (
                      <TableRow key={commission.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#7C7C7C]" />
                            <span className="text-sm">
                              {format(new Date(commission.transaction_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {product?.name || 'Unknown Product'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#7C7C7C]">
                            {business?.business_name || business?.name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#7C7C7C]">
                            {user?.username || user?.email || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-semibold text-[#1E1E1E]">
                            <DollarSign className="w-4 h-4 text-[#08B150]" />
                            {commission.amount.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCommissionTypeBadge(commission.commission_type)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(commission.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

