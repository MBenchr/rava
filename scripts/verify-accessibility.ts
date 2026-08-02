import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

type Rgb = { red: number; green: number; blue: number };

const css = readFileSync("app/globals.css", "utf8");
const skipLinkCss = readFileSync("components/skip-link.module.css", "utf8");

function token(name: string) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "iu"));
  assert.ok(match, `Missing hex token --${name}`);
  return match[1];
}

function rgb(hex: string): Rgb {
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function luminance(hex: string) {
  const values = Object.values(rgb(hex)).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrast(foreground: string, background: string) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  ["foreground", "background", 7],
  ["muted-foreground", "background", 4.5],
  ["card-foreground", "card", 7],
  ["primary-foreground", "primary", 7],
  ["secondary-foreground", "secondary", 7],
  ["accent-foreground", "accent", 4.5],
  ["destructive", "background", 4.5],
] as const;

for (const [foreground, background, minimum] of pairs) {
  const ratio = contrast(token(foreground), token(background));
  assert.ok(
    ratio >= minimum,
    `${foreground}/${background} contrast ${ratio.toFixed(2)} is below ${minimum}`,
  );
}

assert.match(css, /:focus-visible\s*\{/u);
assert.match(skipLinkCss, /\.skipLink:focus-visible\s*\{/u);
assert.match(css, /prefers-reduced-motion:\s*reduce/u);

console.log(`Verified ${pairs.length} contrast pairs, focus visibility and reduced motion.`);
