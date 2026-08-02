import { createHmac, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { parsePassportSerial, type PublicPassport } from "@/lib/passports";

export const passportOwnerRelease = {
  enabled: false,
  status: "pending-H-008-H-016-H-018",
  requiredProofs: [
    "approved physical NFC association",
    "durable Supabase migration",
    "validated identity provider",
    "ownership recovery and transfer policy",
  ],
} as const;

export const passportOwnerActions = [
  "activation_requested",
  "activated",
  "recovery_requested",
  "transfer_requested",
  "transfer_accepted",
  "transfer_cancelled",
  "data_exported",
  "retired",
] as const;

export type PassportOwnerAction = (typeof passportOwnerActions)[number];

const serialSchema = z.string().transform((value, context) => {
  const parsed = parsePassportSerial(value);
  if (!parsed) {
    context.addIssue({ code: "custom", message: "Invalid passport serial." });
    return z.NEVER;
  }
  return parsed.serial;
});

export const passportActivationSchema = z.object({
  serial: serialSchema,
  activationSecret: z.string().min(24).max(256),
  orderReference: z.string().trim().min(6).max(120),
  identitySubject: z.string().trim().min(8).max(255),
  proofAccepted: z.literal(true),
});

export const passportTransferSchema = z.object({
  serial: serialSchema,
  fromIdentitySubject: z.string().trim().min(8).max(255),
  toEmail: z.string().trim().email().max(254),
  transferPolicyAccepted: z.literal(true),
});

export const passportRecoverySchema = z.object({
  serial: serialSchema,
  email: z.string().trim().email().max(254),
  orderReference: z.string().trim().min(6).max(120),
  evidenceNote: z.string().trim().min(20).max(1500),
});

export type PassportOwnerExport = {
  generatedAt: string;
  passport: PublicPassport;
  ownership: {
    activatedAt: string | null;
    currentOwnerSince: string | null;
  };
  transfers: Array<{
    requestedAt: string;
    completedAt: string | null;
    status: "requested" | "accepted" | "cancelled";
  }>;
  events: Array<{
    action: PassportOwnerAction;
    createdAt: string;
  }>;
};

export function isPassportOwnerServiceEnabled() {
  return passportOwnerRelease.enabled;
}

export function hashPassportActivationSecret(
  secret: string,
  serverPepper: string,
) {
  if (serverPepper.length < 32) {
    throw new Error("PASSPORT_ACTIVATION_PEPPER_TOO_SHORT");
  }
  return createHmac("sha256", serverPepper).update(secret).digest("hex");
}

export function verifyPassportActivationSecret(
  secret: string,
  expectedHash: string,
  serverPepper: string,
) {
  const received = Buffer.from(
    hashPassportActivationSecret(secret, serverPepper),
    "hex",
  );
  const expected = Buffer.from(expectedHash, "hex");
  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}

export function buildPassportOwnerExport(input: PassportOwnerExport) {
  return {
    schemaVersion: 1,
    generatedAt: input.generatedAt,
    passport: input.passport,
    ownership: input.ownership,
    transfers: input.transfers,
    events: input.events,
  };
}
