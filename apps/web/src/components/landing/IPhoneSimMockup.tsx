import React from "react";
import { cn } from "@/lib/utils";

interface IPhoneSimMockupProps {
  children?: React.ReactNode;
  variant?: "iPhone 17 Pro" | "iPhone Air" | "iPhone 17 Pro Max" | "iPhone 16" | "iPhone 16 Plus";
  buttons?: boolean;
  className?: string;
}

export function IPhoneSimMockup({
  children,
  variant = "iPhone 17 Pro",
  buttons = true,
  className,
}: IPhoneSimMockupProps) {
  // Bezel padding adjustments per variant
  const isIPhone16Family = variant === "iPhone 16" || variant === "iPhone 16 Plus";
  const bezelPadding = isIPhone16Family ? "1.35cqw" : "1.8cqw";
  const screenPadding = isIPhone16Family ? "2.7cqw" : "2.26cqw";

  return (
    <div className={cn("@container w-full aspect-[442/914] relative select-none", className)}>
      {/* Outer wrapper: Outer Stroke */}
      <div 
        className="w-full h-full bg-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative"
        style={{
          borderRadius: "24cqw",
          padding: "0.226cqw"
        }}
      >
        {/* Buttons (progressive enhancement) */}
        {buttons && (
          <>
            {/* Mute Button */}
            <div 
              className="absolute bg-zinc-800 rounded-l-[1cqw] border-l border-t border-b border-white/10 shadow-lg"
              style={{ 
                width: "7.24cqw",
                height: "9.5cqw",
                left: "-0.9cqw",
                top: "34.38cqw",
                transform: "translateX(-2px)" 
              }}
            />
            {/* Volume Up */}
            <div 
              className="absolute bg-zinc-800 rounded-l-[1cqw] border-l border-t border-b border-white/10 shadow-lg"
              style={{ 
                width: "7.24cqw",
                height: "14.48cqw",
                left: "-0.9cqw",
                top: "50.22cqw",
                transform: "translateX(-2px)" 
              }}
            />
            {/* Volume Down */}
            <div 
              className="absolute bg-zinc-800 rounded-l-[1cqw] border-l border-t border-b border-white/10 shadow-lg"
              style={{ 
                width: "7.24cqw",
                height: "14.48cqw",
                left: "-0.9cqw",
                top: "68.32cqw",
                transform: "translateX(-2px)" 
              }}
            />
            {/* Lock Button */}
            <div 
              className="absolute bg-zinc-800 rounded-r-[1cqw] border-r border-t border-b border-white/10 shadow-lg"
              style={{ 
                width: "7.24cqw",
                height: "22.62cqw",
                right: "-0.9cqw",
                top: "59.73cqw",
                transform: "translateX(2px)" 
              }}
            />
          </>
        )}

        {/* Inner Stroke */}
        <div 
          className="w-full h-full bg-[#999999] relative"
          style={{
            borderRadius: "23.75cqw",
            padding: "0.226cqw"
          }}
        >
          {/* Bezel */}
          <div 
            className="w-full h-full bg-[#2c2c2c] relative transition-all duration-300"
            style={{
              borderRadius: "23.53cqw",
              padding: bezelPadding
            }}
          >
            {/* Screen Wrapper */}
            <div 
              className="w-full h-full bg-black relative transition-all duration-300"
              style={{
                borderRadius: "21.7cqw",
                padding: screenPadding
              }}
            >
              {/* Dynamic Island */}
              <div 
                className="absolute z-20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-200 cursor-pointer bg-black"
                style={{
                  height: "8.14cqw",
                  width: "28.05cqw",
                  left: "calc(50% - 14.025cqw)",
                  top: "5.88cqw",
                  borderRadius: "27cqw"
                }}
              >
                {/* Simulated cameras/sensors */}
                <div 
                  className="rounded-full bg-zinc-900/60 ml-auto border border-zinc-800/50" 
                  style={{
                    width: "1.5cqw",
                    height: "1.5cqw",
                    marginRight: "3cqw"
                  }}
                />
              </div>

              {/* View/Screen Content Area */}
              <div 
                className="w-full h-full bg-background overflow-hidden relative"
                style={{
                  borderRadius: "19.45cqw"
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
