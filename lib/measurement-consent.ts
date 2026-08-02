export const MEASUREMENT_CONSENT_VERSION = "2026-07-29";
export const MEASUREMENT_STORAGE_KEY = "isandre-measurement-consent-v1";

export type MeasurementConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: typeof MEASUREMENT_CONSENT_VERSION;
  updatedAt: string;
};

export const measurementRelease: {
  cmpValidated: boolean;
  analyticsDestinationsEnabled: boolean;
  marketingDestinationsEnabled: boolean;
} = {
  cmpValidated: false,
  analyticsDestinationsEnabled: false,
  marketingDestinationsEnabled: false,
};

export function createMeasurementConsent(
  analytics: boolean,
  marketing = false,
): MeasurementConsent {
  return {
    necessary: true,
    analytics,
    marketing,
    version: MEASUREMENT_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

export function parseMeasurementConsent(value: string | null): MeasurementConsent | null {
  if (!value) return null;

  try {
    const candidate = JSON.parse(value) as Partial<MeasurementConsent>;

    if (
      candidate.necessary !== true ||
      typeof candidate.analytics !== "boolean" ||
      typeof candidate.marketing !== "boolean" ||
      candidate.version !== MEASUREMENT_CONSENT_VERSION ||
      typeof candidate.updatedAt !== "string"
    ) {
      return null;
    }

    return candidate as MeasurementConsent;
  } catch {
    return null;
  }
}

export function getMeasurementConsent(): MeasurementConsent | null {
  if (typeof window === "undefined") return null;

  return parseMeasurementConsent(
    window.localStorage.getItem(MEASUREMENT_STORAGE_KEY),
  );
}

export function saveMeasurementConsent(consent: MeasurementConsent) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(MEASUREMENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent("isandre:consent-change", { detail: consent }),
  );
}

export function canDispatchAnalytics(consent: MeasurementConsent | null) {
  return Boolean(
    consent?.analytics &&
      measurementRelease.cmpValidated &&
      measurementRelease.analyticsDestinationsEnabled,
  );
}

export function canDispatchMarketing(consent: MeasurementConsent | null) {
  return Boolean(
    consent?.marketing &&
      measurementRelease.cmpValidated &&
      measurementRelease.marketingDestinationsEnabled,
  );
}
