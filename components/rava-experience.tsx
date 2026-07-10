/* eslint-disable @next/next/no-img-element */

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import PlacementEditor from "@/components/placement-editor";
import {
  ambianceOptions,
  type AmbianceId,
  finishAccents,
  footerLinks,
  formatOptions,
  type FormatId,
  getFinishAccent,
  getVariantByFormat,
  handFinishedImages,
  heroImage,
  lifestyleScenes,
  materialsImage,
  openBackImage,
  processSteps,
  productVariants,
  type ProjectionRequestPayload,
  siteMeta,
  type UsageId,
  usageHighlights,
  usageOptions,
  type PlacementBox,
} from "@/lib/rava-content";

type ProjectionApiResult = {
  projectionImage: string;
  promptDigest: string;
  requestId: string;
  warning?: string;
  resolvedFormat: Exclude<FormatId, "undecided">;
};

const projectionLoadingSteps = [
  {
    title: "Analyse de la photo",
    detail: "Nous lisons le sol, les lignes de fuite et la profondeur de la pièce.",
  },
  {
    title: "Calage du meuble",
    detail: "Le Cabinet Mura est posé à l’échelle dans la zone choisie, sans déformer sa silhouette.",
  },
  {
    title: "Lumière et matière",
    detail: "Les ombres, la lumière et la texture mate sont harmonisées avec votre intérieur.",
  },
] as const;

const galleryLayouts = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5 md:row-span-1",
  "md:col-span-5 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-6 md:row-span-1",
  "md:col-span-6 md:row-span-1",
];

function scrollToAnchor(anchorId: string) {
  document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatLabel(format: FormatId) {
  return formatOptions.find((option) => option.id === format)?.label ?? formatOptions[0].label;
}

function usageLabel(usage: UsageId) {
  return usageOptions.find((option) => option.id === usage)?.label ?? usageOptions[0].label;
}

function projectionErrorLabel(message?: string) {
  if (!message) {
    return "La projection n’a pas pu être préparée pour le moment.";
  }

  return message;
}

function estimateErrorLabel(message?: string) {
  if (!message) {
    return "L’envoi de la demande est indisponible pour le moment.";
  }

  return message;
}

function ProjectionEmptyState() {
  return (
    <div className="space-y-4">
      <div className="projection-stage-frame projection-stage-frame--empty projection-placeholder">
        <div className="relative z-10 mx-auto max-w-sm text-center">
          <p className="eyebrow">Aperçu</p>
          <h3 className="mt-4 font-[var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-[var(--color-ink)]">
            La simulation apparaîtra ici.
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Ajoutez une photo nette, puis posez la pièce d’un clic dans l’image.
          </p>
        </div>
      </div>
      <p className="text-sm leading-7 text-[var(--color-muted)]">
        Le cadre reste le même du placement jusqu’au résultat final, pour éviter les allers-retours
        dans la page.
      </p>
    </div>
  );
}

type ProjectionLoadingStageProps = {
  imageUrl: string;
  stepIndex: number;
};

function ProjectionLoadingStage({ imageUrl, stepIndex }: ProjectionLoadingStageProps) {
  const activeStep = projectionLoadingSteps[stepIndex] ?? projectionLoadingSteps[0];

  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <div className="projection-stage-frame">
        <img
          src={imageUrl}
          alt="Photo en cours d’analyse"
          className="projection-stage-image projection-stage-image--loading"
        />
        <div className="projection-loading-scrim" />
        <div className="projection-scanline" aria-hidden="true" />
        <div className="projection-stage-copy">
          <p className="eyebrow text-white/72">Simulation en cours</p>
          <h3 className="mt-3 text-3xl font-[var(--font-display)] leading-none tracking-[-0.04em] text-white">
            {activeStep.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/80">{activeStep.detail}</p>
          <div className="projection-loading-bar mt-5" aria-hidden="true" />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {projectionLoadingSteps.map((step, index) => (
          <div
            key={step.title}
            className="projection-loading-step"
            data-active={stepIndex === index}
          >
            <span className="projection-loading-step-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{step.title}</span>
          </div>
        ))}
      </div>
      <p className="text-sm leading-7 text-[var(--color-muted)]">
        Patientez pendant l’analyse. Inutile de recliquer : la simulation continue tant que cet
        état reste affiché.
      </p>
    </div>
  );
}

type ProjectionCompareStageProps = {
  beforeUrl: string;
  result: ProjectionApiResult;
  compareValue: number;
  onCompareChange: (value: number) => void;
  onAdjustPlacement: () => void;
  onRerun: () => void;
};

function ProjectionCompareStage({
  beforeUrl,
  result,
  compareValue,
  onCompareChange,
  onAdjustPlacement,
  onRerun,
}: ProjectionCompareStageProps) {
  return (
    <div className="space-y-4">
      <div className="projection-compare-shell">
        <div className="projection-stage-frame projection-compare-frame">
          <img src={beforeUrl} alt="Photo d’origine" className="projection-stage-image" />
          <div className="projection-compare-after" style={{ width: `${compareValue}%` }}>
            <img
              src={result.projectionImage}
              alt="Projection du Cabinet Mura dans votre intérieur"
              className="projection-stage-image h-full object-cover"
            />
          </div>
          <div className="projection-compare-divider" style={{ left: `${compareValue}%` }}>
            <span className="projection-compare-handle" aria-hidden="true">
              ↔
            </span>
          </div>
          <span className="projection-badge projection-badge--left">Avant</span>
          <span className="projection-badge projection-badge--right">Simulation</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
          <label
            htmlFor="projection-compare"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
          >
            Comparer
          </label>
          <input
            id="projection-compare"
            type="range"
            min="0"
            max="100"
            value={compareValue}
            className="projection-compare-range"
            onChange={(event) => onCompareChange(Number(event.target.value))}
          />
          <span className="text-sm text-[var(--color-muted)]">Glissez pour révéler</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="button-primary font-semibold" onClick={onRerun}>
          Refaire la simulation
        </button>
        <button type="button" className="button-secondary font-semibold" onClick={onAdjustPlacement}>
          Replacer la pièce
        </button>
        <a
          href={result.projectionImage}
          download={`projection-rava-${result.requestId}.webp`}
          className="button-secondary font-semibold"
        >
          Télécharger
        </a>
        <button
          type="button"
          className="button-secondary font-semibold"
          onClick={() => scrollToAnchor("estimation")}
        >
          Utiliser pour la demande
        </button>
      </div>
      <p className="text-sm leading-7 text-[var(--color-muted)]">
        {result.warning ??
          "La simulation reste indicative. Glissez le curseur pour comparer la photo d’origine et la proposition intégrée."}
      </p>
    </div>
  );
}

export default function RavaExperience() {
  const [selectedFormat, setSelectedFormat] = useState<FormatId>("vertical");
  const [selectedUsage, setSelectedUsage] = useState<UsageId>("against-wall");
  const [selectedAmbiance, setSelectedAmbiance] = useState<AmbianceId>("neutral");
  const [projectionMessage, setProjectionMessage] = useState("");
  const [projectionFile, setProjectionFile] = useState<File | null>(null);
  const [projectionPreviewUrl, setProjectionPreviewUrl] = useState("");
  const [placementBox, setPlacementBox] = useState<PlacementBox | null>(null);
  const [projectionCompareValue, setProjectionCompareValue] = useState(56);
  const [projectionLoadingStepIndex, setProjectionLoadingStepIndex] = useState(0);
  const [projectionState, setProjectionState] = useState<{
    loading: boolean;
    error: string | null;
    result: ProjectionApiResult | null;
  }>({
    loading: false,
    error: null,
    result: null,
  });
  const [estimatePhoto, setEstimatePhoto] = useState<File | null>(null);
  const [estimateState, setEstimateState] = useState<{
    loading: boolean;
    error: string | null;
    success: string | null;
  }>({
    loading: false,
    error: null,
    success: null,
  });

  const activeVariant = useMemo(
    () =>
      selectedFormat === "horizontal"
        ? getVariantByFormat("horizontal")
        : getVariantByFormat("vertical"),
    [selectedFormat],
  );
  const activeAccent = useMemo(() => getFinishAccent(selectedAmbiance), [selectedAmbiance]);

  useEffect(() => {
    return () => {
      if (projectionPreviewUrl) {
        URL.revokeObjectURL(projectionPreviewUrl);
      }
    };
  }, [projectionPreviewUrl]);

  useEffect(() => {
    if (!projectionState.loading) {
      setProjectionLoadingStepIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setProjectionLoadingStepIndex((current) => (current + 1) % projectionLoadingSteps.length);
    }, 1600);

    return () => window.clearInterval(intervalId);
  }, [projectionState.loading]);

  function chooseFormat(format: Exclude<FormatId, "undecided">) {
    setSelectedFormat(format);
    scrollToAnchor("projection");
  }

  function handleProjectionFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (projectionPreviewUrl) {
      URL.revokeObjectURL(projectionPreviewUrl);
    }

    setProjectionFile(file);
    setProjectionPreviewUrl(file ? URL.createObjectURL(file) : "");
    setPlacementBox(null);
    setProjectionCompareValue(56);
    setProjectionState({ loading: false, error: null, result: null });
  }

  function handleEstimatePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    setEstimatePhoto(event.target.files?.[0] ?? null);
  }

  async function requestProjection() {
    if (!projectionFile) {
      setProjectionState({
        loading: false,
        error: "Ajoutez une photo pour lancer la projection.",
        result: null,
      });
      return;
    }

    if (!placementBox) {
      setProjectionState({
        loading: false,
        error: "Placez la pièce sur la photo avant de lancer la projection.",
        result: null,
      });
      return;
    }

    scrollToAnchor("projection-stage");
    setProjectionState((current) => ({
      loading: true,
      error: null,
      result: current.result,
    }));

    const payload: ProjectionRequestPayload = {
      format: selectedFormat,
      usage: selectedUsage,
      ambiance: selectedAmbiance,
      message: projectionMessage,
      placementBox,
    };

    const formData = new FormData();
    formData.append("image", projectionFile);
    formData.append("format", payload.format);
    formData.append("usage", payload.usage);
    formData.append("ambiance", payload.ambiance);
    formData.append("message", payload.message);
    formData.append("placementBox", JSON.stringify(payload.placementBox));

    try {
      const response = await fetch("/api/projection", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as ProjectionApiResult & { error?: string };

      if (!response.ok) {
        throw new Error(projectionErrorLabel(data.error));
      }

      if (
        data.resolvedFormat &&
        data.resolvedFormat !== selectedFormat &&
        selectedFormat === "undecided"
      ) {
        setSelectedFormat(data.resolvedFormat);
      }

      setProjectionCompareValue(56);
      setProjectionState({ loading: false, error: null, result: data });
    } catch (error) {
      setProjectionState((current) => ({
        loading: false,
        error:
          error instanceof Error
            ? projectionErrorLabel(error.message)
            : "La projection n’a pas pu être préparée pour le moment.",
        result: current.result,
      }));
    }
  }

  function submitProjection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void requestProjection();
  }

  function reopenPlacementEditor() {
    setProjectionState({
      loading: false,
      error: null,
      result: null,
    });
    scrollToAnchor("projection-stage");
  }

  async function submitEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEstimateState({ loading: true, error: null, success: null });

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const sourceImage = estimatePhoto ?? projectionFile;

    if (!sourceImage) {
      setEstimateState({
        loading: false,
        error: "Ajoutez une photo de l’espace pour envoyer la demande.",
        success: null,
      });
      return;
    }

    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("location", location);
    body.append("format", selectedFormat);
    body.append("usage", selectedUsage);
    body.append("ambiance", selectedAmbiance);
    body.append("message", message);
    body.append("spacePhoto", sourceImage);

    if (projectionState.result) {
      body.append("projectionImage", projectionState.result.projectionImage);
      body.append("projectionPromptDigest", projectionState.result.promptDigest);
      body.append("projectionWarning", projectionState.result.warning ?? "");
    }

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(estimateErrorLabel(data.error));
      }

      setEstimateState({
        loading: false,
        error: null,
        success: data.message ?? "Votre demande est bien partie.",
      });
      event.currentTarget.reset();
      setEstimatePhoto(null);
    } catch (error) {
      setEstimateState({
        loading: false,
        error:
          error instanceof Error
            ? estimateErrorLabel(error.message)
            : "L’envoi de la demande est indisponible pour le moment.",
        success: null,
      });
    }
  }

  return (
    <main className="pb-16">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="section-shell">
          <div className="surface-panel mt-4 flex flex-wrap items-center justify-between gap-4 rounded-full px-5 py-3">
            <a
              href="#top"
              className="text-sm font-semibold tracking-[0.16em] text-[var(--color-ink)] uppercase"
            >
              RAVA Éditions
            </a>
            <nav className="hidden items-center gap-5 text-sm text-[var(--color-muted)] md:flex">
              <a href="#pieces">Pièces</a>
              <a href="#teintes">Teintes</a>
              <a href="#usages">Usages</a>
              <a href="#projection">Projection</a>
              <a href="#commander">Commander</a>
            </nav>
            <button
              type="button"
              className="button-primary text-sm font-semibold"
              onClick={() => scrollToAnchor("commander")}
            >
              Commander le vôtre
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="relative min-h-[92svh] overflow-hidden">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(33,27,23,0.76)_0%,rgba(33,27,23,0.28)_44%,rgba(33,27,23,0.08)_100%)]" />
        <div className="section-shell relative flex min-h-[92svh] items-end py-16">
          <div className="max-w-2xl space-y-6 pb-8 pt-32 text-white md:pb-14">
            <p className="eyebrow text-white/70">RAVA Éditions</p>
            <h1 className="font-[var(--font-display)] text-[clamp(3.8rem,8vw,7rem)] leading-[0.92] tracking-[-0.05em]">
              Cabinet Mura
            </h1>
            <p className="max-w-xl text-2xl leading-tight text-white md:text-[2.15rem]">
              Une niche libre. Une pièce qui pose le décor.
            </p>
            <p className="max-w-xl text-base leading-8 text-white/82 md:text-lg">
              Bibliothèque sculpturale ouverte, pensée pour exposer, séparer et faire respirer
              l’espace.
            </p>
            <p className="text-lg font-semibold tracking-[-0.02em] text-white/90">
              {siteMeta.priceFrom}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="button-primary font-semibold"
                onClick={() => scrollToAnchor("commander")}
              >
                Commander le vôtre
              </button>
              <button
                type="button"
                className="button-ghost font-semibold"
                onClick={() => scrollToAnchor("projection")}
              >
                Le voir chez moi
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-anchor bg-[var(--color-chalk)] py-24 md:py-32">
        <div className="section-shell">
          <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <div className="space-y-5">
              <p className="eyebrow">Manifeste</p>
              <h2 className="section-title max-w-3xl">
                Un meuble posé. Une présence d’architecture.
              </h2>
            </div>
            <div className="space-y-3 text-lg leading-8 text-[var(--color-muted)]">
              <p>Cabinet Mura reprend le langage des niches.</p>
              <p>Il n’est pas un mur.</p>
              <p>Il se pose, se déplace, et donne à la pièce une présence immédiate.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pieces" className="section-anchor py-24 md:py-32">
        <div className="section-shell grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src={productVariants[0].image.src}
              alt={productVariants[0].alt}
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="eyebrow">La pièce</p>
            <h2 className="section-title">
              {productVariants[0].piece} — {productVariants[0].title}
            </h2>
            <p className="metric-line">{productVariants[0].dimensions}</p>
            <p className="body-copy">
              Bibliothèque sculpturale autoportante. Une grande arche. Des niches ouvertes.
              Du vide pour laisser respirer la pièce.
            </p>
            <button
              type="button"
              className="button-primary font-semibold"
              onClick={() => scrollToAnchor("commander")}
            >
              Commander le vôtre
            </button>
          </div>
        </div>
      </section>

      <section className="section-anchor py-24 md:py-32">
        <div className="section-shell space-y-12">
          <div className="space-y-4">
            <p className="eyebrow">Formes</p>
            <h2 className="section-title">Deux formats. Une même présence.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {productVariants.map((variant) => {
              const isActive = selectedFormat === variant.id;

              return (
                <article
                  key={variant.id}
                  className={`surface-panel rounded-[2rem] p-4 md:p-5 ${isActive ? "ring-1 ring-[rgba(33,27,23,0.12)]" : ""}`}
                >
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem]">
                    <Image
                      src={variant.image.src}
                      alt={variant.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4 px-2 pb-2 pt-6">
                    <p className="eyebrow">{variant.piece}</p>
                    <h3 className="font-[var(--font-display)] text-4xl leading-none tracking-[-0.04em]">
                      {variant.id === "vertical" ? "Vertical" : "Horizontal"}
                    </h3>
                    <p className="metric-line">{variant.dimensions}</p>
                    <p className="body-copy max-w-none">{variant.intro}</p>
                    <p className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
                      {variant.priceFrom}
                    </p>
                    <button
                      type="button"
                      className="button-secondary font-semibold"
                      onClick={() => chooseFormat(variant.id)}
                    >
                      {variant.id === "vertical" ? "Choisir le vertical" : "Choisir l’horizontal"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-anchor py-24 md:py-32">
        <div className="section-shell grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem]">
            <Image
              src={openBackImage.src}
              alt={openBackImage.alt}
              fill
              sizes="(max-width: 900px) 100vw, 56vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="eyebrow">Sans fond</p>
            <h2 className="section-title">Ouvert. Traversant. Léger.</h2>
            <div className="space-y-3 text-lg leading-8 text-[var(--color-muted)]">
              <p>Les niches sont ouvertes à l’avant et à l’arrière.</p>
              <p>La lumière passe.</p>
              <p>Contre un mur, il devient point focal.</p>
              <p>Au centre d’une pièce, il dessine une séparation douce.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="teintes" className="section-anchor py-24 md:py-32">
        <div className="section-shell grid gap-12 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <div className="space-y-6">
            <p className="eyebrow">Teintes</p>
            <h2 className="section-title">Quatre teintes. Une surface mate.</h2>
            <p className="body-copy">
              L’ivoire chaud est la teinte fondatrice. Les autres nuances apportent une présence
              plus solaire, plus végétale ou plus douce.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {finishAccents.map((accent) => (
                <button
                  key={accent.id}
                  type="button"
                  className="surface-panel rounded-[1.5rem] px-4 py-4 text-left transition hover:-translate-y-0.5"
                  onClick={() => setSelectedAmbiance(accent.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="accent-dot" style={{ backgroundColor: accent.hex }} />
                      <span className="font-semibold text-[var(--color-ink)]">{accent.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-ink)]">
                      {accent.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="body-copy">{siteMeta.deliveryLine}</p>
            <button
              type="button"
              className="button-secondary font-semibold"
              onClick={() => scrollToAnchor("estimation")}
            >
              Recevoir les teintes
            </button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src={materialsImage.src}
              alt={materialsImage.alt}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="usages" className="section-anchor py-24 md:py-32">
        <div className="section-shell space-y-10">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div className="space-y-4">
              <p className="eyebrow">Usages</p>
              <h2 className="section-title">Il ne remplit pas l’espace. Il le dessine.</h2>
            </div>
            <p className="body-copy">
              Même silhouette. Autres positions. Même présence.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {usageHighlights.map((usage) => (
              <article key={usage.title} className="surface-panel rounded-[1.7rem] p-5">
                <p className="font-[var(--font-display)] text-3xl leading-none tracking-[-0.04em]">
                  {usage.title}
                </p>
                <p className="mt-4 text-[var(--color-muted)]">{usage.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-anchor py-24 md:py-32">
        <div className="section-shell space-y-10">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div className="space-y-4">
              <p className="eyebrow">Galerie</p>
              <h2 className="section-title">Des intérieurs possibles.</h2>
            </div>
            <p className="body-copy">
              Même silhouette. Autres lieux. Autres objets. Même présence.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-12 md:auto-rows-[13rem]">
            {lifestyleScenes.map((scene, index) => (
              <li
                key={scene.id}
                className={`relative min-h-80 overflow-hidden rounded-[1.8rem] ${galleryLayouts[index]}`}
              >
                <Image
                  src={scene.src}
                  alt={scene.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(33,27,23,0)_0%,rgba(33,27,23,0.72)_100%)] px-5 py-5 text-white">
                  <p className="eyebrow text-white/70">{scene.label}</p>
                  <p className="mt-2 font-[var(--font-display)] text-3xl leading-none tracking-[-0.04em]">
                    {scene.caption}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-anchor py-24 md:py-32">
        <div className="section-shell grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="space-y-6">
            <p className="eyebrow">Finalisation</p>
            <h2 className="section-title">Finalisé à la main.</h2>
            <p className="body-copy">
              Chaque surface garde une légère variation. C’est ce qui donne à chaque pièce sa
              présence propre.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {handFinishedImages.map((image) => (
              <div key={image.src} className="relative aspect-square overflow-hidden rounded-[1.7rem]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 24vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projection" className="section-anchor py-24 md:py-32">
        <div className="section-shell">
          <div className="grid gap-10 md:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-6">
              <p className="eyebrow">Projection</p>
              <h2 className="section-title">Le voir chez vous.</h2>
              <p className="body-copy">
                Envoyez une photo de l’endroit où vous l’imaginez. Nous préparons une projection
                pour vous aider à choisir le format, la position et la teinte.
              </p>
              <div className="surface-panel rounded-[2rem] p-6">
                <p className="eyebrow">Sélection</p>
                <div className="mt-4 space-y-3 text-[var(--color-muted)]">
                  <p>
                    <strong className="text-[var(--color-ink)]">Format</strong> —{" "}
                    {formatLabel(selectedFormat)}
                  </p>
                  <p>
                    <strong className="text-[var(--color-ink)]">Teinte</strong> —{" "}
                    {activeAccent.name}
                  </p>
                  <p>
                    <strong className="text-[var(--color-ink)]">Usage</strong> —{" "}
                    {usageLabel(selectedUsage)}
                  </p>
                </div>
              </div>
            </div>
            <form className="surface-panel rounded-[2rem] p-6 md:p-8" onSubmit={submitProjection}>
              <div className="grid gap-5">
                <div id="projection-stage">
                  {projectionPreviewUrl ? (
                    projectionState.loading ? (
                      <ProjectionLoadingStage
                        imageUrl={projectionPreviewUrl}
                        stepIndex={projectionLoadingStepIndex}
                      />
                    ) : projectionState.result ? (
                      <ProjectionCompareStage
                        beforeUrl={projectionPreviewUrl}
                        result={projectionState.result}
                        compareValue={projectionCompareValue}
                        onCompareChange={setProjectionCompareValue}
                        onAdjustPlacement={reopenPlacementEditor}
                        onRerun={() => {
                          void requestProjection();
                        }}
                      />
                    ) : (
                      <PlacementEditor
                        imageUrl={projectionPreviewUrl}
                        format={selectedFormat}
                        placementBox={placementBox}
                        onChange={setPlacementBox}
                      />
                    )
                  ) : (
                    <ProjectionEmptyState />
                  )}
                </div>
                <div>
                  <label className="field-label" htmlFor="projection-photo">
                    Upload photo
                  </label>
                  <input
                    id="projection-photo"
                    name="projection-photo"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    className="field-shell"
                    disabled={projectionState.loading}
                    onChange={handleProjectionFileChange}
                  />
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {projectionPreviewUrl
                      ? "Une fois la photo chargée, cliquez dans l’image pour poser le meuble, puis lancez la simulation."
                      : "Ajoutez une photo nette de l’espace. La projection se construira ici, sans ouvrir un second bloc plus bas."}
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="projection-format">
                      Format
                    </label>
                    <select
                      id="projection-format"
                      className="field-shell"
                      value={selectedFormat}
                      disabled={projectionState.loading}
                      onChange={(event) => setSelectedFormat(event.target.value as FormatId)}
                    >
                      {formatOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="projection-usage">
                      Usage
                    </label>
                    <select
                      id="projection-usage"
                      className="field-shell"
                      value={selectedUsage}
                      disabled={projectionState.loading}
                      onChange={(event) => setSelectedUsage(event.target.value as UsageId)}
                    >
                      {usageOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <span className="field-label">Teinte</span>
                  <div className="flex flex-wrap gap-3">
                    {ambianceOptions.map((option) => {
                      const accent = getFinishAccent(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          className="accent-chip"
                          data-active={selectedAmbiance === option.id}
                          disabled={projectionState.loading}
                          onClick={() => setSelectedAmbiance(option.id)}
                        >
                          <span className="accent-dot" style={{ backgroundColor: accent.hex }} />
                          <span className="font-semibold">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="projection-message">
                    Message
                  </label>
                  <textarea
                    id="projection-message"
                    className="field-shell min-h-32 resize-y"
                    placeholder="Une fenêtre, une hauteur, une contrainte, une envie."
                    value={projectionMessage}
                    disabled={projectionState.loading}
                    onChange={(event) => setProjectionMessage(event.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="button-primary font-semibold"
                  disabled={projectionState.loading}
                >
                  {projectionState.loading
                    ? "Simulation en cours..."
                    : projectionState.result
                      ? "Relancer avec ces réglages"
                      : "Lancer la simulation"}
                </button>
                <p className="text-sm leading-7 text-[var(--color-muted)]">
                  {projectionState.loading
                    ? "Le cadre ci-dessus reste actif pendant l’analyse. Ne fermez pas la page et ne relancez pas une seconde fois."
                    : "Simulation indicative. Dimensions et livraison validées avant commande."}
                </p>
                {projectionState.error ? (
                  <p className="rounded-[1.4rem] bg-[rgba(231,181,166,0.24)] px-4 py-3 text-sm text-[var(--color-ink)]">
                    {projectionState.error}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="commander" className="section-anchor py-24 md:py-32">
        <div className="section-shell grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="space-y-5">
            <p className="eyebrow">Commander</p>
            <h2 className="section-title">Commander le vôtre.</h2>
            <div className="space-y-3 text-lg leading-8 text-[var(--color-muted)]">
              <p>{activeVariant.piece} en cours de sélection.</p>
              <p>Chaque commande est confirmée avant fabrication.</p>
              <p>Prix produit fixe selon la teinte.</p>
              <p>{siteMeta.deliveryLine}</p>
              <p>{siteMeta.fabricationDelay}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step} className="surface-panel rounded-[1.7rem] p-5">
                <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-4 text-lg leading-7 text-[var(--color-ink)]">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-anchor py-24 md:py-32">
        <div className="section-shell space-y-8">
          <div className="space-y-4">
            <p className="eyebrow">Prix</p>
            <h2 className="section-title">Prix</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {finishAccents.map((accent) => (
              <button
                key={accent.id}
                type="button"
                className="surface-panel rounded-[1.8rem] px-5 py-5 text-left transition hover:-translate-y-0.5"
                onClick={() => setSelectedAmbiance(accent.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="accent-dot" style={{ backgroundColor: accent.hex }} />
                  <span className="font-semibold text-[var(--color-ink)]">{accent.name}</span>
                </div>
                <p className="mt-4 font-[var(--font-display)] text-4xl leading-none tracking-[-0.04em]">
                  {accent.price}
                </p>
                <p className="mt-3 text-sm text-[var(--color-muted)]">{accent.note}</p>
              </button>
            ))}
          </div>
          <div className="surface-panel flex flex-col gap-6 rounded-[2rem] px-6 py-7 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 text-[var(--color-muted)]">
              <p>
                <strong className="text-[var(--color-ink)]">Format</strong> —{" "}
                {formatLabel(selectedFormat)}
              </p>
              <p>
                <strong className="text-[var(--color-ink)]">Teinte</strong> —{" "}
                {activeAccent.name} — {activeAccent.price}
              </p>
              <p>{siteMeta.deliveryLine}</p>
              <p>{siteMeta.fabricationDelay}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="button-primary font-semibold"
                onClick={() => scrollToAnchor("estimation")}
              >
                Commander le vôtre
              </button>
              <button
                type="button"
                className="button-secondary font-semibold"
                onClick={() => scrollToAnchor("projection")}
              >
                Recevoir une projection
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="estimation" className="section-anchor py-24 md:py-32">
        <div className="section-shell grid gap-10 md:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <p className="eyebrow">Demande</p>
            <h2 className="section-title">Parlez-nous de votre espace.</h2>
            <p className="body-copy">
              Format, teinte, usage. Puis une photo. Nous revenons avec une estimation claire.
            </p>
            <div className="surface-panel rounded-[2rem] p-6">
              <p className="eyebrow">Résumé</p>
              <div className="mt-4 space-y-3 text-[var(--color-muted)]">
                <p>
                  <strong className="text-[var(--color-ink)]">Format</strong> —{" "}
                  {formatLabel(selectedFormat)}
                </p>
                <p>
                  <strong className="text-[var(--color-ink)]">Teinte</strong> —{" "}
                  {activeAccent.name}
                </p>
                <p>
                  <strong className="text-[var(--color-ink)]">Projection jointe</strong> —{" "}
                  {projectionState.result ? "Oui" : "Non"}
                </p>
              </div>
            </div>
          </div>
          <form className="surface-panel rounded-[2rem] p-6 md:p-8" onSubmit={submitEstimate}>
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="name">
                    Nom
                  </label>
                  <input id="name" name="name" className="field-shell" required />
                </div>
                <div>
                  <label className="field-label" htmlFor="email">
                    Email
                  </label>
                  <input id="email" name="email" type="email" className="field-shell" required />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="location">
                  Ville / pays
                </label>
                <input id="location" name="location" className="field-shell" required />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="field-label" htmlFor="estimate-format">
                    Format souhaité
                  </label>
                  <select
                    id="estimate-format"
                    className="field-shell"
                    value={selectedFormat}
                    onChange={(event) => setSelectedFormat(event.target.value as FormatId)}
                  >
                    {formatOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="estimate-tint">
                    Teinte souhaitée
                  </label>
                  <select
                    id="estimate-tint"
                    className="field-shell"
                    value={selectedAmbiance}
                    onChange={(event) => setSelectedAmbiance(event.target.value as AmbianceId)}
                  >
                    {ambianceOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="estimate-usage">
                    Usage prévu
                  </label>
                  <select
                    id="estimate-usage"
                    className="field-shell"
                    value={selectedUsage}
                    onChange={(event) => setSelectedUsage(event.target.value as UsageId)}
                  >
                    {usageOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="estimate-photo">
                  Photo de l’espace
                </label>
                <input
                  id="estimate-photo"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  className="field-shell"
                  onChange={handleEstimatePhotoChange}
                />
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {estimatePhoto
                    ? "La photo choisie sera jointe à la demande."
                    : projectionFile
                      ? "La photo de projection sera jointe automatiquement."
                      : "Ajoutez une photo pour cadrer l’estimation."}
                </p>
              </div>
              <div>
                <label className="field-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="field-shell min-h-36 resize-y"
                  placeholder="Une pièce, une adresse, une contrainte, un délai."
                />
              </div>
              <button
                type="submit"
                className="button-primary font-semibold"
                disabled={estimateState.loading}
              >
                {estimateState.loading ? "Envoi en cours..." : "Envoyer ma demande"}
              </button>
              {estimateState.error ? (
                <p className="rounded-[1.4rem] bg-[rgba(231,181,166,0.24)] px-4 py-3 text-sm text-[var(--color-ink)]">
                  {estimateState.error}
                </p>
              ) : null}
              {estimateState.success ? (
                <p className="rounded-[1.4rem] bg-[rgba(95,116,106,0.14)] px-4 py-3 text-sm text-[var(--color-ink)]">
                  {estimateState.success}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-black/8 py-12">
        <div className="section-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="font-[var(--font-display)] text-4xl leading-none tracking-[-0.04em]">
              {siteMeta.name}
            </p>
            <p className="text-[var(--color-muted)]">{siteMeta.baseline}</p>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm text-[var(--color-muted)]">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
