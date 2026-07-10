/* eslint-disable @next/next/no-img-element */

"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

import type { FormatId, PlacementBox } from "@/lib/rava-content";

type Point = {
  x: number;
  y: number;
};

type Handle = "nw" | "ne" | "sw" | "se";

type Interaction =
  | {
      type: "move";
      startPoint: Point;
      startBox: PlacementBox;
    }
  | {
      type: "resize";
      handle: Handle;
      fixedCorner: Point;
    };

type PlacementEditorProps = {
  imageUrl: string;
  format: FormatId;
  placementBox: PlacementBox | null;
  onChange: (box: PlacementBox | null) => void;
};

const HANDLE_ORDER: Handle[] = ["nw", "ne", "sw", "se"];
const HANDLE_HIT_RADIUS_PX = 18;
const BOX_TOLERANCE = 0.001;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function boxesEqual(first: PlacementBox, second: PlacementBox) {
  return (
    Math.abs(first.x - second.x) < BOX_TOLERANCE &&
    Math.abs(first.y - second.y) < BOX_TOLERANCE &&
    Math.abs(first.width - second.width) < BOX_TOLERANCE &&
    Math.abs(first.height - second.height) < BOX_TOLERANCE
  );
}

function getAspectRatio(format: FormatId) {
  if (format === "vertical") {
    return 102 / 184;
  }

  if (format === "horizontal") {
    return 184 / 120;
  }

  return null;
}

function getDefaultSize(format: FormatId) {
  const aspect = getAspectRatio(format);

  if (aspect === null) {
    return { width: 0.32, height: 0.32 };
  }

  if (aspect >= 1) {
    const width = 0.46;

    return {
      width,
      height: width / aspect,
    };
  }

  const height = 0.42;

  return {
    width: height * aspect,
    height,
  };
}

function getMinimumSize(format: FormatId) {
  const aspect = getAspectRatio(format);

  if (aspect === null) {
    return { width: 0.1, height: 0.1 };
  }

  if (aspect >= 1) {
    const width = 0.18;

    return {
      width,
      height: width / aspect,
    };
  }

  const height = 0.18;

  return {
    width: height * aspect,
    height,
  };
}

function clampBoxToFrame(box: PlacementBox): PlacementBox {
  const width = clamp(box.width, 0.05, 1);
  const height = clamp(box.height, 0.05, 1);

  return {
    width,
    height,
    x: clamp(box.x, 0, 1 - width),
    y: clamp(box.y, 0, 1 - height),
  };
}

function placeBoxAtPoint(center: Point, format: FormatId) {
  const size = getDefaultSize(format);

  return clampBoxToFrame({
    x: center.x - size.width / 2,
    y: center.y - size.height / 2,
    width: size.width,
    height: size.height,
  });
}

function adaptBoxToFormat(box: PlacementBox, format: FormatId) {
  const aspect = getAspectRatio(format);

  if (aspect === null) {
    return clampBoxToFrame(box);
  }

  const center = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
  const area = clamp(box.width * box.height, 0.03, 0.4);
  const minSize = getMinimumSize(format);
  let width = Math.sqrt(area * aspect);
  let height = width / aspect;

  if (height < minSize.height) {
    height = minSize.height;
    width = height * aspect;
  }

  if (width < minSize.width) {
    width = minSize.width;
    height = width / aspect;
  }

  const scale = Math.min(1, 1 / width, 1 / height);

  return clampBoxToFrame({
    x: center.x - (width * scale) / 2,
    y: center.y - (height * scale) / 2,
    width: width * scale,
    height: height * scale,
  });
}

function pointInBox(point: Point, box: PlacementBox) {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  );
}

function getCorner(box: PlacementBox, handle: Handle): Point {
  switch (handle) {
    case "nw":
      return { x: box.x, y: box.y };
    case "ne":
      return { x: box.x + box.width, y: box.y };
    case "sw":
      return { x: box.x, y: box.y + box.height };
    case "se":
    default:
      return { x: box.x + box.width, y: box.y + box.height };
  }
}

function getOppositeCorner(box: PlacementBox, handle: Handle): Point {
  switch (handle) {
    case "nw":
      return { x: box.x + box.width, y: box.y + box.height };
    case "ne":
      return { x: box.x, y: box.y + box.height };
    case "sw":
      return { x: box.x + box.width, y: box.y };
    case "se":
    default:
      return { x: box.x, y: box.y };
  }
}

function getHandleAtPoint(
  point: Point,
  box: PlacementBox,
  frame: DOMRect,
): Handle | null {
  const thresholdX = HANDLE_HIT_RADIUS_PX / frame.width;
  const thresholdY = HANDLE_HIT_RADIUS_PX / frame.height;

  for (const handle of HANDLE_ORDER) {
    const corner = getCorner(box, handle);

    if (
      Math.abs(point.x - corner.x) <= thresholdX &&
      Math.abs(point.y - corner.y) <= thresholdY
    ) {
      return handle;
    }
  }

  return null;
}

function composeBoxFromFixedCorner(
  fixedCorner: Point,
  handle: Handle,
  width: number,
  height: number,
) {
  switch (handle) {
    case "nw":
      return {
        x: fixedCorner.x - width,
        y: fixedCorner.y - height,
        width,
        height,
      };
    case "ne":
      return {
        x: fixedCorner.x,
        y: fixedCorner.y - height,
        width,
        height,
      };
    case "sw":
      return {
        x: fixedCorner.x - width,
        y: fixedCorner.y,
        width,
        height,
      };
    case "se":
    default:
      return {
        x: fixedCorner.x,
        y: fixedCorner.y,
        width,
        height,
      };
  }
}

function resizeBoxFromHandle(
  point: Point,
  fixedCorner: Point,
  handle: Handle,
  format: FormatId,
) {
  const aspect = getAspectRatio(format);
  const minSize = getMinimumSize(format);
  const isWest = handle === "nw" || handle === "sw";
  const isNorth = handle === "nw" || handle === "ne";

  const minX = isWest ? 0 : fixedCorner.x + minSize.width;
  const maxX = isWest ? fixedCorner.x - minSize.width : 1;
  const minY = isNorth ? 0 : fixedCorner.y + minSize.height;
  const maxY = isNorth ? fixedCorner.y - minSize.height : 1;

  const clampedX = clamp(point.x, minX, maxX);
  const clampedY = clamp(point.y, minY, maxY);

  if (aspect === null) {
    return clampBoxToFrame({
      x: Math.min(clampedX, fixedCorner.x),
      y: Math.min(clampedY, fixedCorner.y),
      width: Math.abs(fixedCorner.x - clampedX),
      height: Math.abs(fixedCorner.y - clampedY),
    });
  }

  const maxWidth = isWest ? fixedCorner.x : 1 - fixedCorner.x;
  const maxHeight = isNorth ? fixedCorner.y : 1 - fixedCorner.y;
  const rawWidth = Math.abs(fixedCorner.x - clampedX);
  const rawHeight = Math.abs(fixedCorner.y - clampedY);
  let width = rawWidth;
  let height = width / aspect;

  if (height < rawHeight) {
    height = rawHeight;
    width = height * aspect;
  }

  if (height < minSize.height) {
    height = minSize.height;
    width = height * aspect;
  }

  if (width < minSize.width) {
    width = minSize.width;
    height = width / aspect;
  }

  const scale = Math.min(1, maxWidth / width, maxHeight / height);

  return clampBoxToFrame(
    composeBoxFromFixedCorner(fixedCorner, handle, width * scale, height * scale),
  );
}

function handleCursor(handle: Handle) {
  return handle === "nw" || handle === "se" ? "nwse-resize" : "nesw-resize";
}

function formatLabel(format: FormatId, box: PlacementBox | null) {
  if (format === "vertical") {
    return "Mura vertical";
  }

  if (format === "horizontal") {
    return "Mura horizontal";
  }

  if (box && box.width > box.height) {
    return "Zone large";
  }

  return "Zone cible";
}

function silhouetteForFormat(format: FormatId, box: PlacementBox | null) {
  if (format === "horizontal") {
    return "/reference/mura-horizontal.svg";
  }

  if (format === "vertical") {
    return "/reference/mura-vertical.svg";
  }

  return box && box.width > box.height
    ? "/reference/mura-horizontal.svg"
    : "/reference/mura-vertical.svg";
}

export default function PlacementEditor({
  imageUrl,
  format,
  placementBox,
  onChange,
}: PlacementEditorProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lastFormatRef = useRef(format);
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [cursor, setCursor] = useState("crosshair");

  useEffect(() => {
    if (!placementBox) {
      lastFormatRef.current = format;
      return;
    }

    if (lastFormatRef.current === format) {
      return;
    }

    lastFormatRef.current = format;
    const adjustedBox = adaptBoxToFormat(placementBox, format);

    if (!boxesEqual(adjustedBox, placementBox)) {
      onChange(adjustedBox);
    }
  }, [format, onChange, placementBox]);

  function getLocalPoint(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();

    if (!rect) {
      return null;
    }

    return {
      x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
    };
  }

  function releasePointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const point = getLocalPoint(event);
    const frame = frameRef.current?.getBoundingClientRect();

    if (!point || !frame) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    if (placementBox) {
      const activeHandle = getHandleAtPoint(point, placementBox, frame);

      if (activeHandle) {
        setCursor(handleCursor(activeHandle));
        setInteraction({
          type: "resize",
          handle: activeHandle,
          fixedCorner: getOppositeCorner(placementBox, activeHandle),
        });
        return;
      }

      if (pointInBox(point, placementBox)) {
        setCursor("move");
        setInteraction({
          type: "move",
          startPoint: point,
          startBox: placementBox,
        });
        return;
      }
    }

    const newBox = placeBoxAtPoint(point, format);
    onChange(newBox);
    setCursor("move");
    setInteraction({
      type: "move",
      startPoint: point,
      startBox: newBox,
    });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const point = getLocalPoint(event);
    const frame = frameRef.current?.getBoundingClientRect();

    if (!point || !frame) {
      return;
    }

    if (!interaction) {
      if (!placementBox) {
        setCursor("crosshair");
        return;
      }

      const activeHandle = getHandleAtPoint(point, placementBox, frame);

      if (activeHandle) {
        setCursor(handleCursor(activeHandle));
        return;
      }

      setCursor(pointInBox(point, placementBox) ? "move" : "crosshair");
      return;
    }

    if (interaction.type === "move") {
      const nextBox = clampBoxToFrame({
        ...interaction.startBox,
        x: interaction.startBox.x + (point.x - interaction.startPoint.x),
        y: interaction.startBox.y + (point.y - interaction.startPoint.y),
      });

      setCursor("move");
      onChange(nextBox);
      return;
    }

    const nextBox = resizeBoxFromHandle(
      point,
      interaction.fixedCorner,
      interaction.handle,
      format,
    );

    setCursor(handleCursor(interaction.handle));
    onChange(nextBox);
  }

  function clearInteraction(event: ReactPointerEvent<HTMLDivElement>) {
    releasePointer(event);
    setInteraction(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            {placementBox
              ? "Glissez la pièce pour la déplacer. Tirez un coin pour ajuster l’échelle."
              : "Cliquez une fois dans la photo pour poser la pièce. Vous pourrez ensuite l’ajuster."}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]/80">
            Placement rapide, sans dessin libre
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
          onClick={() => onChange(null)}
        >
          Réinitialiser
        </button>
      </div>
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-[1.8rem] border border-black/8 bg-white/70 touch-none"
        onPointerCancel={clearInteraction}
        onPointerDown={handlePointerDown}
        onPointerLeave={() => {
          if (!interaction) {
            setCursor("crosshair");
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={clearInteraction}
        style={{ cursor }}
      >
        <img
          src={imageUrl}
          alt="Prévisualisation de l’espace à projeter"
          className="h-auto w-full select-none"
        />
        {placementBox ? (
          <div
            className="pointer-events-none absolute rounded-[1.6rem] border border-[rgba(47,36,31,0.72)] bg-[rgba(244,239,230,0.1)] shadow-[0_0_0_9999px_rgba(33,27,23,0.08)]"
            style={{
              left: `${placementBox.x * 100}%`,
              top: `${placementBox.y * 100}%`,
              width: `${placementBox.width * 100}%`,
              height: `${placementBox.height * 100}%`,
            }}
          >
            <img
              src={silhouetteForFormat(format, placementBox)}
              alt=""
              aria-hidden="true"
              className="absolute inset-[10%] h-[80%] w-[80%] object-contain opacity-35 mix-blend-multiply"
            />
            <span className="absolute left-3 top-3 rounded-full bg-[var(--color-chocolate)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white">
              {formatLabel(format, placementBox)}
            </span>
            {HANDLE_ORDER.map((handle) => {
              const corner = getCorner(placementBox, handle);

              return (
                <span
                  key={handle}
                  className="absolute h-4 w-4 rounded-full border border-[var(--color-chocolate)] bg-white shadow-[0_6px_16px_rgba(33,27,23,0.18)]"
                  style={{
                    left: `${((corner.x - placementBox.x) / placementBox.width) * 100}%`,
                    top: `${((corner.y - placementBox.y) / placementBox.height) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="rounded-full bg-[rgba(250,247,240,0.92)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] shadow-[0_18px_40px_rgba(33,27,23,0.08)]">
              1 clic pour poser la pièce
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
