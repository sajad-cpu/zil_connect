import { pb } from "@/api/pocketbaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: any;
  onEnroll?: (product: any) => void;
  onView?: (product: any) => void;
}

export default function ProductCard({ product, onEnroll, onView }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            {product.logo ? (
              <img
                src={pb.files.getUrl(product, product.logo)}
                alt={product.name}
                className="w-14 h-14 rounded object-contain"
              />
            ) : (
              <div className="w-14 h-14 rounded bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-lg">
                {product.name?.[0]?.toUpperCase() || 'P'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 mb-0.5 line-clamp-1">
                {product.name}
              </h3>
              {product.provider && (
                <p className="text-sm text-gray-500 line-clamp-1">{product.provider}</p>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
          {product.description}
        </p>

        {product.pricing_info && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900">{product.pricing_info}</p>
          </div>
        )}

        <div className="mt-auto pt-4 border-t">
          <Button
            className="w-full bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
            onClick={() => onEnroll && onEnroll(product)}
          >
            Get Started
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

