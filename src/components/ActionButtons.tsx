
import React from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Icon, IconProps, IconType } from "./IconProvider";

// Kiterjesztett Props interfész az ActionButton komponenshez
interface ActionButtonProps {
  iconName: string;
  iconType?: IconType;
  label: string;
  onClick: () => void;
  variant: "view" | "edit" | "approve" | "delete";
  disabled?: boolean;
  className?: string;
}

const ActionButton = ({ 
  iconName, 
  iconType = 'lucide',
  label, 
  onClick, 
  variant, 
  disabled = false,
  className
}: ActionButtonProps) => {
  const getButtonStyles = () => {
    const baseStyles = "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200";
    const variantStyles = {
      view: "bg-blue-950 text-blue-400 hover:bg-blue-900 hover:text-blue-300 border border-blue-800",
      edit: "bg-amber-950 text-amber-400 hover:bg-amber-900 hover:text-amber-300 border border-amber-800",
      approve: "bg-green-950 text-green-400 hover:bg-green-900 hover:text-green-300 border border-green-800",
      delete: "bg-red-950 text-red-400 hover:bg-red-900 hover:text-red-300 border border-red-800"
    };
    
    return cn(
      baseStyles, 
      variantStyles[variant], 
      disabled && "opacity-50 cursor-not-allowed pointer-events-none",
      className
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            disabled={disabled}
            className={getButtonStyles()}
            aria-label={label}
          >
            <Icon icon={iconName} type={iconType} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onDelete?: () => void;
  disabledActions?: Array<"view" | "edit" | "approve" | "delete">;
  className?: string;
  // Új prop az ikonstílus kezelésére
  iconType?: IconType;
  // Icon pack-specifikus ikonnevek
  viewIcon?: string;
  editIcon?: string;
  approveIcon?: string; 
  deleteIcon?: string;
}

export const ActionButtons = ({ 
  onView, 
  onEdit, 
  onApprove, 
  onDelete, 
  disabledActions = [],
  className,
  iconType = 'lucide',
  viewIcon = 'Eye',
  editIcon = 'Edit',
  approveIcon = 'Check',
  deleteIcon = 'Trash'
}: ActionButtonsProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {onView && (
        <ActionButton 
          iconName={viewIcon}
          iconType={iconType}
          label="View" 
          onClick={onView} 
          variant="view" 
          disabled={disabledActions.includes("view")} 
        />
      )}
      
      {onEdit && (
        <ActionButton 
          iconName={editIcon}
          iconType={iconType}
          label="Edit" 
          onClick={onEdit} 
          variant="edit"
          disabled={disabledActions.includes("edit")} 
        />
      )}
      
      {onApprove && (
        <ActionButton 
          iconName={approveIcon}
          iconType={iconType}
          label="Approve" 
          onClick={onApprove} 
          variant="approve"
          disabled={disabledActions.includes("approve")} 
        />
      )}
      
      {onDelete && (
        <ActionButton 
          iconName={deleteIcon}
          iconType={iconType}
          label="Delete" 
          onClick={onDelete} 
          variant="delete"
          disabled={disabledActions.includes("delete")} 
        />
      )}
    </div>
  );
};

export default ActionButtons;
