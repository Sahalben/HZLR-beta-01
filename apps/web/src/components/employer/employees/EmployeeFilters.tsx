import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, X } from "lucide-react";
import type { EmployeeFiltersState } from "@/pages/employer/Employees";

interface EmployeeFiltersProps {
  filters: EmployeeFiltersState;
  onFiltersChange: (filters: EmployeeFiltersState) => void;
  onExport: () => void;
  totalCount: number;
}

const categoryTags = ["F&B", "Logistics", "Events", "Retail", "Hospitality", "Warehouse", "Security"];

export function EmployeeFilters({ filters, onFiltersChange, onExport, totalCount }: EmployeeFiltersProps) {
  const updateFilter = <K extends keyof EmployeeFiltersState>(key: K, value: EmployeeFiltersState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategoryTag = (tag: string) => {
    const newTags = filters.categoryTags.includes(tag)
      ? filters.categoryTags.filter((t) => t !== tag)
      : [...filters.categoryTags, tag];
    updateFilter("categoryTags", newTags);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      reliability: "all",
      groomingVerified: "all",
      identityKyc: "all",
      preferredCategory: "all",
      lastActive: "all",
      locationRadius: "all",
      categoryTags: [],
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.reliability !== "all" ||
    filters.groomingVerified !== "all" ||
    filters.identityKyc !== "all" ||
    filters.preferredCategory !== "all" ||
    filters.lastActive !== "all" ||
    filters.locationRadius !== "all" ||
    filters.categoryTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Top Row - Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workers by name, phone, or HZLR ID..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-3">
        <Select value={filters.reliability} onValueChange={(v) => updateFilter("reliability", v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Reliability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reliability</SelectItem>
            <SelectItem value="high">High (80+)</SelectItem>
            <SelectItem value="medium">Medium (50-79)</SelectItem>
            <SelectItem value="low">Low (&lt;50)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.groomingVerified} onValueChange={(v) => updateFilter("groomingVerified", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Grooming Verified" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grooming</SelectItem>
            <SelectItem value="yes">Verified</SelectItem>
            <SelectItem value="no">Not Verified</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.identityKyc} onValueChange={(v) => updateFilter("identityKyc", v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Identity KYC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All KYC Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.preferredCategory} onValueChange={(v) => updateFilter("preferredCategory", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Preferred Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryTags.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.lastActive} onValueChange={(v) => updateFilter("lastActive", v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Last Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Tag Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Categories:</span>
        {categoryTags.map((tag) => (
          <Badge
            key={tag}
            variant={filters.categoryTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => toggleCategoryTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{totalCount}</span> workers
      </p>
    </div>
  );
}
