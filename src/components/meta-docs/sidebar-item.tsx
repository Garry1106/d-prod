"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { DocStep } from "@/lib/meta-docs-data";

interface SidebarItemProps {
  step: DocStep;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function SidebarItem({ step, isActive, onSelect }: SidebarItemProps) {
  return (
    <button
      onClick={() => onSelect(step.id)}
      className={cn(
        "flex items-center w-[80%] px-2 py-2 text-sm rounded-lg transition-colors",
        "hover:bg-gray-100",
        isActive
          ? "bg-[#EB6C33] text-white hover:bg-[#EB6C33]"
          : "text-gray-700",
        step.completed && "opacity-75"
      )}
    >
      <span className="mr-2">
        {step.completed ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </span>
      <span className="text-left line-clamp-2">{step.title}</span>
    </button>
  );
}