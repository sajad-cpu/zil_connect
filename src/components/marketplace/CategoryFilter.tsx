import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  Calculator,
  CreditCard,
  FileText,
  Receipt,
  TrendingUp,
  Users
} from "lucide-react";

const categories = [
  {
    value: "all",
    label: "All Categories",
    icon: BarChart3,
    color: "bg-gray-100 text-gray-700 border-gray-200"
  },
  {
    value: "Accounting Software",
    label: "Accounting",
    icon: Calculator,
    color: "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    value: "Payment Processing",
    label: "Payments",
    icon: CreditCard,
    color: "bg-green-100 text-green-700 border-green-200"
  },
  {
    value: "Business Banking",
    label: "Banking",
    icon: Building2,
    color: "bg-purple-100 text-purple-700 border-purple-200"
  },
  {
    value: "Tax Software",
    label: "Tax",
    icon: FileText,
    color: "bg-orange-100 text-orange-700 border-orange-200"
  },
  {
    value: "Payroll Services",
    label: "Payroll",
    icon: Users,
    color: "bg-pink-100 text-pink-700 border-pink-200"
  },
  {
    value: "Invoicing Tools",
    label: "Invoicing",
    icon: Receipt,
    color: "bg-cyan-100 text-cyan-700 border-cyan-200"
  },
  {
    value: "Expense Management",
    label: "Expenses",
    icon: TrendingUp,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  {
    value: "Business Analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "bg-indigo-100 text-indigo-700 border-indigo-200"
  }
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.value;

        return (
          <motion.div
            key={category.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className={
                isSelected
                  ? "bg-[#6C4DE6] hover:bg-[#593CC9] text-white border-none"
                  : `border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC] ${category.color}`
              }
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

