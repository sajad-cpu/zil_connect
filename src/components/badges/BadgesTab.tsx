import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { badgeService } from "@/api/services/badgeService";
import BadgeModal from "@/components/modals/BadgeModal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BadgesTabProps {
  businessId: string;
  isOwner: boolean;
}

export default function BadgesTab({ businessId, isOwner }: BadgesTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<any>(null);
  const [deletingBadgeId, setDeletingBadgeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ["business-badges", businessId],
    queryFn: () => badgeService.getByBusiness(businessId, false),
  });

  const deleteMutation = useMutation({
    mutationFn: (badgeId: string) => badgeService.delete(badgeId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Badge deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["business-badges", businessId] });
      setDeletingBadgeId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete badge",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (badge: any) => {
    setEditingBadge(badge);
    setBadgeModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBadge(null);
    setBadgeModalOpen(true);
  };

  const handleDelete = (badgeId: string) => {
    setDeletingBadgeId(badgeId);
  };

  const confirmDelete = () => {
    if (deletingBadgeId) {
      deleteMutation.mutate(deletingBadgeId);
    }
  };

  const filteredBadges = badges.filter((badge: any) => {
    if (filterType === "all") return true;
    return badge.badge_type === filterType;
  });

  const getBadgeStatusBadge = (badge: any) => {
    if (badgeService.isExpired(badge)) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    }

    if (badge.is_verified) {
      return (
        <Badge className="text-xs bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }

    if (badge.verification_status === "pending") {
      return (
        <Badge variant="secondary" className="text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      );
    }

    return null;
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
            <CardTitle>Trust Badges & Certifications</CardTitle>
            <div className="flex items-center gap-3">
              {/* Filter */}
              {badges.length > 0 && (
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="certification">Certifications</SelectItem>
                    <SelectItem value="award">Awards</SelectItem>
                    <SelectItem value="membership">Memberships</SelectItem>
                    <SelectItem value="verification">Verifications</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {isOwner && (
                <Button
                  size="sm"
                  onClick={handleAddNew}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                >
                  Add Certification
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBadges.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {badges.length === 0
                  ? isOwner
                    ? "Build credibility"
                    : "No badges yet"
                  : "No badges in this category"}
              </h3>
              <p className="text-gray-600 mb-4">
                {badges.length === 0
                  ? isOwner
                    ? "Add certifications and badges to stand out"
                    : "This business hasn't added any badges yet"
                  : "Try selecting a different filter"}
              </p>
              {isOwner && badges.length === 0 && (
                <Button
                  onClick={handleAddNew}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                >
                  Get Verified
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBadges.map((badge: any) => (
                <Card
                  key={badge.id}
                  className={`border-[#E4E7EB] ${
                    badgeService.isExpired(badge) ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Badge Image */}
                      <div className="w-16 h-16 flex-shrink-0">
                        {badge.badge_image ? (
                          <img
                            src={badgeService.getBadgeImageUrl(badge)}
                            alt={badge.title}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F8F9FC] rounded-lg flex items-center justify-center">
                            <Award className="w-8 h-8 text-[#7C7C7C]" />
                          </div>
                        )}
                      </div>

                      {/* Badge Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#1E1E1E] line-clamp-1 mb-1">
                              {badge.title}
                            </h4>
                            <p className="text-xs text-[#7C7C7C] line-clamp-1">
                              {badge.issuing_organization}
                            </p>
                          </div>
                          {isOwner && (
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(badge)}
                                className="h-7 w-7"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(badge.id)}
                                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Status & Type Badges */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge
                            variant="outline"
                            className="text-xs border-[#6C4DE6] text-[#6C4DE6] capitalize"
                          >
                            {badge.badge_type}
                          </Badge>
                          {getBadgeStatusBadge(badge)}
                        </div>

                        {/* Description */}
                        {badge.description && (
                          <p className="text-xs text-[#7C7C7C] line-clamp-2 mb-2">
                            {badge.description}
                          </p>
                        )}

                        {/* Dates */}
                        <div className="space-y-1 text-xs text-[#7C7C7C]">
                          {badge.issue_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Issued:{" "}
                                {new Date(badge.issue_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {!badge.does_not_expire && badge.expiry_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span
                                className={
                                  badgeService.isExpired(badge)
                                    ? "text-red-500"
                                    : ""
                                }
                              >
                                Expires:{" "}
                                {new Date(badge.expiry_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {badge.does_not_expire && (
                            <p className="text-green-600">No expiry</p>
                          )}
                        </div>

                        {/* Credential Info */}
                        {(badge.credential_id || badge.credential_url) && (
                          <div className="mt-3 pt-3 border-t border-[#E4E7EB]">
                            {badge.credential_id && (
                              <p className="text-xs text-[#7C7C7C] mb-1">
                                ID: {badge.credential_id}
                              </p>
                            )}
                            {badge.credential_url && (
                              <a
                                href={badge.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#6C4DE6] hover:underline inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Verify Credential
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badge Modal */}
      {badgeModalOpen && (
        <BadgeModal
          open={badgeModalOpen}
          onClose={() => {
            setBadgeModalOpen(false);
            setEditingBadge(null);
          }}
          badge={editingBadge}
          businessId={businessId}
          onSuccess={() => {
            setBadgeModalOpen(false);
            setEditingBadge(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingBadgeId !== null}
        onOpenChange={() => setDeletingBadgeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Badge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this badge? This action cannot be
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
