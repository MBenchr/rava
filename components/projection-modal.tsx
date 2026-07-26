"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProjectionModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function ProjectionModal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: ProjectionModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton
        className="!left-0 !top-0 h-dvh max-w-none !translate-x-0 !translate-y-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-none border-0 bg-background p-0 text-foreground sm:!left-1/2 sm:!top-1/2 sm:h-[min(92dvh,920px)] sm:max-w-[min(1240px,calc(100vw-2rem))] sm:!-translate-x-1/2 sm:!-translate-y-1/2 sm:rounded-xl sm:border sm:border-border sm:shadow-[0_28px_80px_rgba(0,0,0,0.22)]"
      >
        <DialogHeader className="border-b border-border px-4 py-3 pr-14 sm:px-8 sm:py-6 sm:pr-16">
          <DialogTitle className="display-title text-2xl leading-tight sm:text-5xl">{title}</DialogTitle>
          <DialogDescription className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-7">
            {subtitle}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden bg-background text-foreground">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
