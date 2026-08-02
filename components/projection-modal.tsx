"use client";

import { Check, ChevronUp, Minus, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectionRuntimeState = {
  phase: "idle" | "ready" | "processing" | "completed" | "failed";
  progress: number;
  label: string;
  thumbnail: string | null;
};

type ProjectionModalProps = {
  active: boolean;
  open: boolean;
  onExpand: () => void;
  onMinimize: () => void;
  onDismiss: () => void;
  title: string;
  subtitle: string;
  runtime: ProjectionRuntimeState;
  locale: "en" | "fr";
  children: React.ReactNode;
};

export default function ProjectionModal({
  active,
  open,
  onExpand,
  onMinimize,
  onDismiss,
  title,
  subtitle,
  runtime,
  locale,
  children,
}: ProjectionModalProps) {
  useEffect(() => {
    if (!active || !open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onMinimize();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, onMinimize, open]);

  if (!active) return null;

  const processing = runtime.phase === "processing";
  const completed = runtime.phase === "completed";
  const status =
    runtime.phase === "idle"
      ? locale === "fr"
        ? "Prêt à commencer"
        : "Ready to start"
      : runtime.label;

  return (
    <>
      <div
        className={cn(
          "projection-window-layer",
          open && "projection-window-layer--open",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="projection-window-backdrop"
          aria-label={locale === "fr" ? "Réduire la simulation" : "Minimise room view"}
          onClick={onMinimize}
        />
        <section
          className="projection-window"
          role="dialog"
          aria-modal="false"
          aria-labelledby="projection-window-title"
        >
          <div className="projection-window__header">
            <div>
              <h2 id="projection-window-title" className="display-title">
                {title}
              </h2>
              <p>{subtitle}</p>
            </div>
            <div className="projection-window__actions">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onMinimize}
                aria-label={locale === "fr" ? "Réduire" : "Minimise"}
              >
                <Minus aria-hidden="true" />
              </Button>
              {!processing ? (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={onDismiss}
                  aria-label={locale === "fr" ? "Fermer" : "Close"}
                >
                  <X aria-hidden="true" />
                </Button>
              ) : null}
            </div>
          </div>
          <div className="projection-window__body">{children}</div>
        </section>
      </div>

      {!open ? (
        <aside
          className={cn(
            "projection-dock",
            "projection-dock--visible",
            completed && "projection-dock--completed",
          )}
          aria-live="polite"
        >
          <button
            type="button"
            className="projection-dock__main"
            onClick={onExpand}
          >
            <span className="projection-dock__preview">
              {runtime.thumbnail ? (
                // The preview can be a local object URL or a generated data URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={runtime.thumbnail} alt="" />
              ) : (
                <span aria-hidden="true">IS</span>
              )}
            </span>
            <span className="projection-dock__copy">
              <strong>
                {completed
                  ? locale === "fr"
                    ? "Votre projection est prête"
                    : "Your room view is ready"
                  : title}
              </strong>
              <small>{status}</small>
              {processing ? (
                <span className="projection-dock__progress">
                  <span style={{ width: `${runtime.progress}%` }} />
                </span>
              ) : null}
            </span>
            {completed ? (
              <Check aria-hidden="true" />
            ) : (
              <ChevronUp aria-hidden="true" />
            )}
          </button>
          {!processing ? (
            <button
              type="button"
              className="projection-dock__dismiss"
              onClick={onDismiss}
              aria-label={locale === "fr" ? "Fermer" : "Close"}
            >
              <X aria-hidden="true" />
            </button>
          ) : null}
        </aside>
      ) : null}
    </>
  );
}
