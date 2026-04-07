"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
// Use TWO sets of dots, not three
import { quoteRequestSchema, type QuoteRequestInput } from "../../lib/quote-request.schema";

type ProductType = QuoteRequestInput["productType"];

type QuoteRequestFormProps = {
  productType: ProductType;
  title?: string;
  description?: string;
  submitLabel?: string;
};

type FormErrors = Partial<Record<keyof QuoteRequestInput, string[]>>;

export function QuoteRequestForm({
  productType,
  title = "Request a quote",
  description = "Tell us a few details and a Palatial advisor will contact you.",
  submitLabel = "Request Quote"
}: QuoteRequestFormProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [formStartedAt] = useState<number>(Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const sourcePage = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL(pathname || "/", window.location.origin).toString();
  }, [pathname]);

  const utmSource = searchParams.get("utm_source") ?? "";
  const utmMedium = searchParams.get("utm_medium") ?? "";
  const utmCampaign = searchParams.get("utm_campaign") ?? "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setServerMessage("");
    setErrors({});

    const formData = new FormData(event.currentTarget);

    const payload: QuoteRequestInput = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
      formStartedAt,
      sourcePage,
      utmSource,
      utmMedium,
      utmCampaign,
      productType
    };

    const parsed = quoteRequestSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as FormErrors);
      setStatus("error");
      setServerMessage("Please correct the highlighted fields.");
      return;
    }

    try {
  try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const result = await response.json();

      // Fix: Check for 200 or 201 specifically for success
      if (response.status === 200 || response.status === 201) {
        event.currentTarget.reset();
        setStatus("success");
        setServerMessage(result.message || "Thank you! Your request has been submitted.");
        setErrors({});
      } else {
        // Handle server-side validation or logic errors
        setErrors(result.errors ?? {});
        setStatus("error");
        setServerMessage(result.message || "We could not submit your request.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setServerMessage("We could not submit your request right now. Please try again.");
    }
  function getFieldError(name: keyof QuoteRequestInput): string | undefined {
    return errors[name]?.[0];
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
<input 
  type="text" 
  name="website" 
  style={{ display: 'none' }} 
  tabIndex={-1} 
  autoComplete="off" 
/>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              placeholder="Your full name"
              aria-invalid={Boolean(getFieldError("fullName"))}
              aria-describedby={getFieldError("fullName") ? "fullName-error" : undefined}
            />
            {getFieldError("fullName") && (
              <p id="fullName-error" className="mt-1 text-sm text-red-600">
                {getFieldError("fullName")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              placeholder="0712 345 678"
              aria-invalid={Boolean(getFieldError("phone"))}
              aria-describedby={getFieldError("phone") ? "phone-error" : undefined}
            />
            {getFieldError("phone") && (
              <p id="phone-error" className="mt-1 text-sm text-red-600">
                {getFieldError("phone")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email address <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              placeholder="you@example.com"
              aria-invalid={Boolean(getFieldError("email"))}
              aria-describedby={getFieldError("email") ? "email-error" : undefined}
            />
            {getFieldError("email") && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {getFieldError("email")}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
              What cover do you need? <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              placeholder="Example: Comprehensive cover for a Toyota Axio, 2018 model."
              aria-invalid={Boolean(getFieldError("message"))}
              aria-describedby={getFieldError("message") ? "message-error" : undefined}
            />
            {getFieldError("message") && (
              <p id="message-error" className="mt-1 text-sm text-red-600">
                {getFieldError("message")}
              </p>
            )}
          </div>
        </div>

        {serverMessage && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              status === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {serverMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "submitting" ? "Submitting..." : submitLabel}
        </button>
      </form>
    </section>
  );
}