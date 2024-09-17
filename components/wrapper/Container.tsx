import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className="min-h-screen">
      <div className={`grid ${className}`}>{children}</div>
    </div>
  );
}
