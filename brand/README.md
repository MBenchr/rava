# ISANDRE / ṬĀQA - Brand source

This directory is the canonical source for the A4 identity system.

The versioned A4 identity manual lives in
`guidelines/isandre-brand-guidelines-a4-1.pdf`. Generated working copies remain
under `output/pdf/`.

## Truth hierarchy

1. `docs/research/plan-maitre-final-isandre-taqa.md`
2. `lib/isandre/brand.ts`
3. `scripts/generate-brand-assets.mjs`
4. generated files in `brand/`
5. verified public copies in `public/brand/`

Never edit a generated SVG directly. Change the generator, run:

```bash
npm run brand:assets
npm run brand:verify
```

## Status

- Wordmark: digital master, pending legal clearance of `ISANDRE`.
- L'ENTAILLE: geometric master.
- ṬĀQA lockup: editorial master, pending legal and linguistic clearance.
- Origin plate: prototype only. It is not production-approved until the 1:1
  print, bronze engraving, fixation, abrasion, legibility and NFC gates pass.
- `FRANCE` is intentionally absent from the plate until origin is legally
  proven.

## Production rule

The wordmark and L'ENTAILLE are vector paths. Supporting microtype in the plate
and template prototypes remains live text so the engraver and printer can tune
legibility. It must be outlined by the selected supplier after the physical
type-size test and before production release.
