import { Button } from "@/components/ui/button";
import { Mail, Heart, Download, Ban, Briefcase, X } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onAction: (action: string) => void;
  onClear: () => void;
}

export function BulkActionsBar({ selectedCount, onAction, onClear }: BulkActionsBarProps) {
  return (
    <div className="flex items-center justify-between bg-primary text-primary-foreground px-4 py-3 rounded-xl animate-slide-up">
      <div className="flex items-center gap-4">
        <span className="font-medium">{selectedCount} selected</span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAction("Assign to Job")}
            className="gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Assign to Job
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAction("Re-invite")}
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            Re-invite
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAction("Add to Favourites")}
            className="gap-2"
          >
            <Heart className="w-4 h-4" />
            Favourites
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAction("Export as CSV")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onAction("Block Workers")}
            className="gap-2"
          >
            <Ban className="w-4 h-4" />
            Block
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClear} className="text-primary-foreground hover:bg-primary-foreground/10">
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
