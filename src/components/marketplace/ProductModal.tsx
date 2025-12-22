import { pb } from "@/api/pocketbaseClient";
import { fintechProductService } from "@/api/services/fintechProductService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  ExternalLink,
  Eye,
  Star,
  Tag,
  TrendingUp
} from "lucide-react";
import { useEffect } from "react";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
  onEnroll?: (product: any) => void;
}

export default function ProductModal({ open, onClose, product, onEnroll }: ProductModalProps) {
  useEffect(() => {
    if (open && product) {
      fintechProductService.incrementViews(product.id);
    }
  }, [open, product]);

  if (!product) return null;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Accounting Software": "bg-blue-100 text-blue-700 border-blue-200",
      "Payment Processing": "bg-green-100 text-green-700 border-green-200",
      "Business Banking": "bg-purple-100 text-purple-700 border-purple-200",
      "Tax Software": "bg-orange-100 text-orange-700 border-orange-200",
      "Payroll Services": "bg-pink-100 text-pink-700 border-pink-200",
      "Invoicing Tools": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Expense Management": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Business Analytics": "bg-indigo-100 text-indigo-700 border-indigo-200"
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {product.logo ? (
              <img
                src={pb.files.getUrl(product, product.logo)}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center text-white font-bold text-2xl">
                {product.name?.[0]?.toUpperCase() || 'P'}
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{product.name}</DialogTitle>
              {product.provider && (
                <DialogDescription className="text-base mb-3">
                  by {product.provider}
                </DialogDescription>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(product.category)}>
                  {product.category}
                </Badge>
                {product.is_featured && (
                  <Badge className="bg-[#6C4DE6] text-white border-none">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.pricing_type && (
                  <Badge variant="outline">
                    {product.pricing_type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-[#1E1E1E] mb-2">Description</h3>
            <p className="text-[#7C7C7C]">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {product.pricing_info && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#08B150]" />
                <div>
                  <p className="text-sm text-[#7C7C7C]">Pricing</p>
                  <p className="font-semibold text-[#1E1E1E]">{product.pricing_info}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#318FFD]" />
              <div>
                <p className="text-sm text-[#7C7C7C]">Views</p>
                <p className="font-semibold text-[#1E1E1E]">{product.views || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#6C4DE6]" />
              <div>
                <p className="text-sm text-[#7C7C7C]">Enrollments</p>
                <p className="font-semibold text-[#1E1E1E]">{product.enrollments || 0}</p>
              </div>
            </div>

            {product.commission_value && (
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#FB6542]" />
                <div>
                  <p className="text-sm text-[#7C7C7C]">Commission</p>
                  <p className="font-semibold text-[#1E1E1E]">
                    {product.commission_type === 'Percentage'
                      ? `${product.commission_value}%`
                      : `$${product.commission_value}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-[#1E1E1E] mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.integration_type && (
            <div>
              <h3 className="font-semibold text-[#1E1E1E] mb-2">Integration Type</h3>
              <Badge variant="outline">{product.integration_type}</Badge>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
            onClick={() => {
              if (onEnroll) {
                onEnroll(product);
              }
              onClose();
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Enroll Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

