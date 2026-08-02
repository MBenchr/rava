"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { getContent } from "@/content";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  finishes,
  getProductCopy,
  productList,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/isandre/catalog";
import type { ServiceRequestKind } from "@/lib/service-requests/types";

type ServiceRequestFormProps = {
  locale: Locale;
  initialKind: ServiceRequestKind;
  initialProductId?: ProductId;
  initialFinishId?: FinishId;
};

export default function ServiceRequestForm({
  locale,
  initialKind,
  initialProductId,
  initialFinishId,
}: ServiceRequestFormProps) {
  const content = getContent(locale);
  const copy = content.serviceRequests;
  const requestId = useRef(crypto.randomUUID());
  const [kind, setKind] = useState(initialKind);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [reference, setReference] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setReference(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      clientRequestId: requestId.current,
      kind,
      source: kind === "press" ? "press-kit" : kind === "trade" ? "trade-pack" : "contact",
      locale,
      name: form.get("name"),
      email: form.get("email"),
      organization: form.get("organization"),
      phone: form.get("phone"),
      location: form.get("location"),
      productId: form.get("productId"),
      finishId: form.get("finishId"),
      quantity: form.get("quantity"),
      message: form.get("message"),
      privacyAccepted: form.get("privacyAccepted") === "on",
      marketingConsent: form.get("marketingConsent") === "on",
      website: form.get("website"),
    };

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        reference?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error ?? "REQUEST_FAILED");
      const requestEvent = {
        project: "project_request",
        trade: "trade_request",
        press: "press_request",
      } as const;
      trackCommerceEvent(requestEvent[kind], {
        stage: "submitted",
        product_id: form.get("productId") || undefined,
        finish_id: form.get("finishId") || undefined,
        locale,
      });
      setReference(result.reference ?? null);
      setStatus("success");
      event.currentTarget.reset();
      requestId.current = crypto.randomUUID();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="service-request-form" onSubmit={submit}>
      <div className="service-request-kinds" role="group" aria-label={copy.eyebrow}>
        {(["project", "trade", "press"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={kind === item}
            onClick={() => setKind(item)}
          >
            <strong>{copy.kinds[item].label}</strong>
            <span>{copy.kinds[item].description}</span>
          </button>
        ))}
      </div>

      <div className="service-request-grid">
        <label>
          <span>{copy.fields.name}</span>
          <input name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </label>
        <label>
          <span>{copy.fields.email}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" />
        </label>
        <label>
          <span>{copy.fields.organization}</span>
          <input name="organization" maxLength={160} autoComplete="organization" />
        </label>
        <label>
          <span>{copy.fields.phone}</span>
          <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
        </label>
        <label>
          <span>{copy.fields.location}</span>
          <input name="location" maxLength={160} autoComplete="address-level2" />
        </label>
        <label>
          <span>{copy.fields.product}</span>
          <select name="productId" defaultValue={initialProductId ?? ""}>
            <option value="">—</option>
            {productList.map((product) => (
              <option key={product.id} value={product.id}>
                {getProductCopy(product.id, locale).name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.fields.finish}</span>
          <select name="finishId" defaultValue={initialFinishId ?? ""}>
            <option value="">—</option>
            {finishes.map((finish) => (
              <option key={finish.id} value={finish.id}>
                {finish.labels[locale]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.fields.quantity}</span>
          <input name="quantity" type="number" min={1} max={500} inputMode="numeric" />
        </label>
      </div>

      <label className="service-request-message">
        <span>{copy.fields.message}</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          placeholder={copy.fields.messagePlaceholder}
        />
      </label>

      <input
        className="service-request-honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <label className="service-request-check">
        <input name="privacyAccepted" type="checkbox" required />
        <span>{copy.fields.privacy}</span>
      </label>
      <label className="service-request-check">
        <input name="marketingConsent" type="checkbox" />
        <span>{copy.fields.marketing}</span>
      </label>

      <div className="service-request-submit">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? copy.submitting : copy.submit}
        </Button>
        <p aria-live="polite">
          {status === "success"
            ? `${copy.success}${reference ? ` · ${reference}` : ""}`
            : status === "error"
              ? copy.error
              : ""}
        </p>
      </div>
    </form>
  );
}
