import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  href?: string;
}

export function LogoIcon({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-7 rounded-lg",
    md: "size-9 rounded-xl",
    lg: "size-11 rounded-2xl",
    xl: "size-14 rounded-3xl",
  };

  const svgSizes = {
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-md shadow-emerald-600/25 transition-transform group-hover:scale-105 select-none shrink-0 overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {/* Subtle shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />

      {/* Fork & Crown Crest SVG */}
      <svg
        width={svgSizes[size]}
        height={svgSizes[size]}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-sm"
      >
        {/* Crown & Fork Silhouette */}
        <path
          d="M5 10.5L9.5 21H22.5L27 10.5L21.5 14.5L16 6.5L10.5 14.5L5 10.5Z"
          fill="currentColor"
        />
        {/* Fork tines cutouts inside crown */}
        <path
          d="M13.5 15.5V19.5M16 12.5V19.5M18.5 15.5V19.5"
          stroke="#059669"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Base band / dining plate curve */}
        <path
          d="M9 23.5C11.2 24.8 20.8 24.8 23 23.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Sparkle at the crown pinnacle */}
        <circle cx="16" cy="4" r="1.3" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Logo({
  className,
  iconSize = "md",
  showText = true,
  subtitle,
  href,
}: LogoProps) {
  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group", className)}>
      <LogoIcon size={iconSize} />
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="text-lg md:text-xl tracking-tight leading-none">
            <span className="font-black text-foreground">Crown</span>
            <span className="font-light text-foreground/60 tracking-tight ml-0.5">
              Canteen
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.18em] mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
