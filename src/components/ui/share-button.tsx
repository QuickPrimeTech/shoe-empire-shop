"use client";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShareData = {
  title?: string;
  text?: string;
  url?: string;
};

export type ShareButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onCopy"
> & {
  /** Custom share data (overrides defaults) */
  shareData?: ShareData;
  /** Callback when share is successful */
  onShareSuccess?: (data: ShareData) => void;
  /** Callback when share fails (not including user cancellation) */
  onShareError?: (error: Error) => void;
  /** Callback when fallback copy is triggered */
  onCopyFallback?: (url: string) => void;
  /** Custom icon to replace default Share2 icon */
  icon?: React.ReactNode;
  /** Position of icon relative to label */
  iconPosition?: "left" | "right";
  /** Button label text */
  label?: string;
  /** Whether to show the label (icon-only button if false) */
  showLabel?: boolean;
  /** Whether to show icon */
  showIcon?: boolean;
  /** Force use of fallback instead of Web Share API */
  forceFallback?: boolean;
  /** Custom fallback behavior - 'copy' | 'none' */
  fallback?: "copy" | "none";
  /** Message to show when copying to clipboard */
  copyMessage?: string | ((url: string) => string);
  /** Custom copy function */
  onCopy?: (url: string) => Promise<void> | void;
  /** Whether to include a share count badge */
  showCount?: boolean;
  /** Share count number */
  shareCount?: number;
  /** Custom share function for non-standard sharing */
  customShare?: (data: ShareData) => Promise<void> | void;
};

const ShareButton = forwardRef<HTMLButtonElement, ShareButtonProps>(
  (
    {
      className,
      shareData = {},
      onShareSuccess,
      onShareError,
      onCopyFallback,
      onCopy,
      icon,
      iconPosition = "left",
      label = "Share",
      showLabel = true,
      showIcon = true,
      forceFallback = false,
      fallback = "copy",
      copyMessage = "Link copied to clipboard!",
      showCount = false,
      shareCount = 0,
      customShare,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const getShareData = (): ShareData => {
      const defaultData: ShareData = {
        title: shareData.title ?? document.title,
        text: shareData.text ?? "",
        url:
          shareData.url ??
          (typeof window !== "undefined" ? window.location.href : ""),
      };

      return { ...defaultData, ...shareData };
    };

    const handleCopyToClipboard = async (url: string) => {
      try {
        if (onCopy) {
          await Promise.resolve(onCopy(url));
        } else {
          await navigator.clipboard.writeText(url);
        }

        onCopyFallback?.(url);

        // Show feedback if no custom handler provided
        if (!onCopyFallback) {
          const message =
            typeof copyMessage === "function" ? copyMessage(url) : copyMessage;
          // You can replace this with a toast notification
        }
      } catch (err) {
        const error = err as Error;
        onShareError?.(error);
        console.error("Failed to copy to clipboard:", error);
      }
    };

    const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      const data = getShareData();

      try {
        // Use custom share function if provided
        if (customShare) {
          await Promise.resolve(customShare(data));
          onShareSuccess?.(data);
          return;
        }

        // Use Web Share API if available and not forced to fallback
        if (!forceFallback && navigator.share && navigator.canShare?.(data)) {
          await navigator.share(data);
          onShareSuccess?.(data);
          return;
        }

        // Handle fallback behavior
        if (fallback === "copy") {
          await handleCopyToClipboard(data.url!);
          onShareSuccess?.(data);
        }
        // If fallback is "none", do nothing
      } catch (err) {
        const error = err as Error;

        // AbortError means the user cancelled - don't treat as error
        if (error.name !== "AbortError") {
          onShareError?.(error);

          // Try copy fallback if error wasn't AbortError and we haven't already tried copying
          if (fallback === "copy" && !onCopy && !customShare) {
            await handleCopyToClipboard(data.url!);
          }
        }
      }
    };

    const defaultIcon = icon || <Share className="size-4" />;

    return (
      <Button
        ref={ref}
        className={cn("relative", className)}
        onClick={handleShare}
        {...props}
      >
        {children || (
          <>
            {showIcon && iconPosition === "left" && defaultIcon}
            {showLabel && (
              <span
                className={cn({
                  "ml-2": showIcon && iconPosition === "left",
                  "mr-2": showIcon && iconPosition === "right",
                })}
              >
                {label}
              </span>
            )}
            {showIcon && iconPosition === "right" && defaultIcon}
            {showCount && shareCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {shareCount > 99 ? "99+" : shareCount}
              </span>
            )}
          </>
        )}
      </Button>
    );
  },
);

ShareButton.displayName = "ShareButton";

export { ShareButton };
