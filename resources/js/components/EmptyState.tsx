import React from 'react';
import type { ComponentType, ReactNode } from 'react';

interface EmptyStateProps {
  icon: ComponentType<{ size?: number }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#332B40] bg-[#1E1826]/50 px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#75708A]">
        <Icon size={22} />
      </span>
      <p className="font-fraunces text-lg text-[#F3EEE2]">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm font-manrope text-sm text-[#75708A]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
