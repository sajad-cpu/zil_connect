import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  Star,
  Calendar,
  User,
} from "lucide-react";
import { portfolioService } from "@/api/services/portfolioService";
import PortfolioModal from "@/components/modals/PortfolioModal";
import { ImageGallery } from "@/components/ui/image-gallery";
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

interface PortfolioTabProps {
  businessId: string;
  isOwner: boolean;
}

export default function PortfolioTab({ businessId, isOwner }: PortfolioTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ["portfolio-items", businessId],
    queryFn: () => portfolioService.getByBusiness(businessId, false),
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => portfolioService.delete(itemId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio-items", businessId] });
      setDeletingItemId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete portfolio item",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setPortfolioModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setPortfolioModalOpen(true);
  };

  const handleDelete = (itemId: string) => {
    setDeletingItemId(itemId);
  };

  const confirmDelete = () => {
    if (deletingItemId) {
      deleteMutation.mutate(deletingItemId);
    }
  };

  const openGallery = (item: any, index: number = 0) => {
    const images = item.images.map((img: string) =>
      portfolioService.getImageUrl(item, img)
    );
    setGalleryImages(images);
    setGalleryIndex(index);
    setGalleryOpen(true);
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
            <CardTitle>Portfolio</CardTitle>
            {isOwner && (
              <Button
                size="sm"
                onClick={handleAddNew}
                className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
              >
                Add Project
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isOwner ? "Showcase your work" : "No portfolio items yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {isOwner
                  ? "Add projects to demonstrate your expertise"
                  : "This business hasn't added any portfolio items yet"}
              </p>
              {isOwner && (
                <Button
                  onClick={handleAddNew}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                >
                  Add Your First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item: any) => (
                <Card
                  key={item.id}
                  className="border-[#E4E7EB] hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {/* Image */}
                  <div
                    className="relative h-48 bg-gray-100 cursor-pointer"
                    onClick={() => openGallery(item)}
                  >
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={portfolioService.getImageUrl(
                          item,
                          item.images[0],
                          "800x600"
                        )}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {item.is_featured && (
                      <Badge className="absolute top-2 left-2 bg-[#6C4DE6] text-white">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                    {item.images && item.images.length > 1 && (
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 right-2 bg-black/70 text-white"
                      >
                        +{item.images.length - 1} more
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-[#1E1E1E] line-clamp-1">
                        {item.title}
                      </h4>
                      {isOwner && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                            className="h-7 w-7"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(item.id)}
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {item.category && (
                      <Badge
                        variant="outline"
                        className="text-xs border-[#6C4DE6] text-[#6C4DE6] mb-2"
                      >
                        {item.category}
                      </Badge>
                    )}

                    <p className="text-sm text-[#7C7C7C] mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="space-y-2 text-xs text-[#7C7C7C]">
                      {item.client_name && (
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{item.client_name}</span>
                        </div>
                      )}

                      {item.project_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.project_date).toLocaleDateString()}</span>
                        </div>
                      )}

                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.technologies.slice(0, 3).map((tech: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {item.technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {(item.project_url || item.case_study_url) && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-[#E4E7EB]">
                        {item.project_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.project_url, "_blank");
                            }}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Live
                          </Button>
                        )}
                        {item.case_study_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.case_study_url, "_blank");
                            }}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Case Study
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Modal */}
      {portfolioModalOpen && (
        <PortfolioModal
          open={portfolioModalOpen}
          onClose={() => {
            setPortfolioModalOpen(false);
            setEditingItem(null);
          }}
          portfolioItem={editingItem}
          businessId={businessId}
          onSuccess={() => {
            setPortfolioModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Image Gallery */}
      <ImageGallery
        images={galleryImages}
        initialIndex={galleryIndex}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingItemId !== null}
        onOpenChange={() => setDeletingItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this portfolio item? This action
              cannot be undone.
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
