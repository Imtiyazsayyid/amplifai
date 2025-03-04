"use client";

import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  icon?: LucideIcon;
  position?: "start" | "end";
  action?: () => void;
}

const CustomInput: React.FC<Props> = ({ position, icon: Icon, className, type = "text", action, ...inputProps }) => {
  return (
    <div className="relative flex items-center w-full">
      {position === "start" && Icon && (
        <Icon
          className={cn(
            "absolute ml-2 h-4 w-6 border-r pr-2 text-secondary",
            action && "hover:text-zinc-200 transition-all cursor-pointer"
          )}
          onClick={action}
        />
      )}
      <Input className={cn(position === "start" ? "pl-10" : "pr-10", className)} type={type} {...inputProps} />
      {position === "end" && Icon && (
        <Icon
          className={cn(
            "absolute right-1 mr-2 h-4 w-6 border-l pl-2 text-secondary",
            action && "hover:text-zinc-200 transition-all cursor-pointer"
          )}
          onClick={action}
        />
      )}
    </div>
  );
};

export default CustomInput;
