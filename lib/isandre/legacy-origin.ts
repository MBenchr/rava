const LEGACY_ORIGINS = new Map([
  ["rava.mohyi.com", "https://taqa.isandre.com"],
]);

export function canonicalOriginForLegacyHost(host: string | null) {
  if (!host) return null;
  return LEGACY_ORIGINS.get(host.split(",")[0].trim().split(":")[0].toLowerCase()) ?? null;
}
