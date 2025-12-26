import { commissionService } from "@/api/services/commissionService";
import { enrollmentService } from "@/api/services/enrollmentService";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, CheckCircle, Clock, DollarSign, ExternalLink, Loader2, XCircle } from "lucide-react";

interface EnrollmentsTabProps {
  userId?: string;
}

export default function EnrollmentsTab({ userId }: EnrollmentsTabProps) {
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['user-enrollments', userId],
    queryFn: () => enrollmentService.getUserEnrollments(userId),
  });

  const { data: earnings } = useQuery({
    queryKey: ['user-commission-earnings', userId],
    queryFn: () => commissionService.getTotalEarnings({ userId }),
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      'Pending': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      'Completed': { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      'Active': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
      'Cancelled': { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getCommissionStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Paid': 'bg-green-100 text-green-700 border-green-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <Badge className={`${statusConfig[status] || statusConfig['Pending']} text-xs`}>
        {status}
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
      {earnings && (earnings.total > 0 || earnings.pending > 0) && (
        <Card className="border-none shadow-lg bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] text-white">
          <CardHeader>
            <CardTitle className="text-white">Commission Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Total Earned</p>
                <p className="text-2xl font-bold">${earnings.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">Pending</p>
                <p className="text-2xl font-bold">${earnings.pending.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">Total Enrollments</p>
                <p className="text-2xl font-bold">{earnings.count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>My Product Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <ExternalLink className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No enrollments yet
              </h3>
              <p className="text-gray-600 mb-4">
                Enroll in business tools from the marketplace to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment: any) => {
                const product = enrollment.expand?.product || enrollment.product;
                const business = enrollment.expand?.business || enrollment.business;

                return (
                  <Card key={enrollment.id} className="border-[#E4E7EB]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1E1E1E] mb-1">
                            {product?.name || 'Unknown Product'}
                          </h4>
                          {product?.provider && (
                            <p className="text-sm text-[#7C7C7C] mb-2">
                              by {product.provider}
                            </p>
                          )}
                          {business && (
                            <p className="text-xs text-[#7C7C7C]">
                              Business: {business.business_name || business.name || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {getStatusBadge(enrollment.status)}
                          {enrollment.commission_earned > 0 && (
                            <div className="flex items-center gap-1 text-sm">
                              <DollarSign className="w-4 h-4 text-[#08B150]" />
                              <span className="font-semibold text-[#1E1E1E]">
                                ${enrollment.commission_earned.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-[#7C7C7C] mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Enrolled: {format(new Date(enrollment.enrollment_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {enrollment.commission_status && (
                          <div>
                            Commission: {getCommissionStatusBadge(enrollment.commission_status)}
                          </div>
                        )}
                      </div>

                      {enrollment.enrollment_method && (
                        <Badge variant="outline" className="text-xs">
                          {enrollment.enrollment_method}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

