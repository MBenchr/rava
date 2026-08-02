import { z } from "zod";

const dimensionSchema = z.number().int().positive().max(3_000);
const openingSchema = z
  .object({
    id: z.enum(["upper", "lower"]),
    kind: z.enum(["rounded-rect", "arch"]),
    x: dimensionSchema,
    y: dimensionSchema,
    width: dimensionSchema,
    height: dimensionSchema,
    radius: z.number().int().nonnegative().max(500),
    shoulderY: z.number().int().positive().max(3_000).optional(),
  })
  .strict();

const shared = {
  schemaVersion: z.literal(1),
  productId: z.literal("veille-03"),
  supplier: z.string().trim().min(2),
  drawingReference: z.string().trim().min(2),
  drawingDate: z.string().date(),
  notes: z.string().trim().max(2_000).default(""),
};

export const pendingVeilleGeometrySubmissionSchema = z
  .object({
    ...shared,
    status: z.literal("pending-manufacturer-approval"),
    dimensionsMm: z.null(),
    outerRadiusMm: z.null(),
    wallThicknessMm: z.null(),
    plinth: z.null(),
    openings: z.tuple([]),
    approval: z.null(),
  })
  .strict();

export const approvedVeilleGeometrySubmissionSchema = z
  .object({
    ...shared,
    status: z.literal("approved-manufacturer-drawing"),
    dimensionsMm: z
      .object({
        width: dimensionSchema,
        height: dimensionSchema,
        depth: dimensionSchema,
      })
      .strict(),
    outerRadiusMm: dimensionSchema,
    wallThicknessMm: dimensionSchema,
    plinth: z
      .object({
        heightMm: dimensionSchema,
        recessMm: z.number().int().nonnegative().max(500),
      })
      .strict(),
    openings: z.tuple([openingSchema, openingSchema]),
    approval: z
      .object({
        approvedBy: z.string().trim().min(2),
        approvedAt: z.string().datetime({ offset: true }),
        drawingSha256: z.string().regex(/^[a-f0-9]{64}$/u),
      })
      .strict(),
  })
  .strict()
  .superRefine((submission, context) => {
    const ids = new Set(submission.openings.map((opening) => opening.id));
    if (ids.size !== 2) {
      context.addIssue({
        code: "custom",
        message: "VEILLE must contain one upper and one lower opening.",
        path: ["openings"],
      });
    }

    for (const [index, opening] of submission.openings.entries()) {
      if (
        opening.x + opening.width > submission.dimensionsMm.width ||
        opening.y + opening.height > submission.dimensionsMm.height
      ) {
        context.addIssue({
          code: "custom",
          message: "Opening exceeds the approved external dimensions.",
          path: ["openings", index],
        });
      }
    }
  });

export const veilleGeometrySubmissionSchema = z.union([
  pendingVeilleGeometrySubmissionSchema,
  approvedVeilleGeometrySubmissionSchema,
]);

export type VeilleGeometrySubmission = z.infer<
  typeof veilleGeometrySubmissionSchema
>;

export function parseVeilleGeometrySubmission(input: unknown) {
  return veilleGeometrySubmissionSchema.parse(input);
}

export function requireApprovedVeilleGeometry(input: unknown) {
  const submission = parseVeilleGeometrySubmission(input);

  if (submission.status !== "approved-manufacturer-drawing") {
    throw new Error("VEILLE_GEOMETRY_NOT_APPROVED");
  }

  return submission;
}
