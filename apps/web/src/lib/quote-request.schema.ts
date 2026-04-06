import { z } from "zod";

export const productTypeSchema = z.enum([
  "MOTOR",
  "LIFE",
  "MEDICAL",
  "POLICY_FOLLOW_UP",
  "OTHER"
]);

const optionalTrimmedString = (max: number) =>
  z.union([z.string().trim().max(max), z.literal("")]).optional();

export const quoteRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z
    .union([z.string().trim().email("Enter a valid email address."), z.literal("")])
    .optional(),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter your phone number.")
    .max(32)
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters."),
  productType: productTypeSchema,
  message: optionalTrimmedString(2000),
  sourcePage: z.string().trim().url(),
  utmSource: optionalTrimmedString(120),
  utmMedium: optionalTrimmedString(120),
  utmCampaign: optionalTrimmedString(120),
  website: z.union([z.string().max(0), z.literal("")]).optional(),
  formStartedAt: z.number().int().positive()
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export function toLeadApiPayload(input: QuoteRequestInput) {
  return {
    fullName: input.fullName,
    email: input.email || undefined,
    phone: input.phone,
    productType: input.productType,
    message: input.message || undefined,
    sourcePage: input.sourcePage,
    utmSource: input.utmSource || undefined,
    utmMedium: input.utmMedium || undefined,
    utmCampaign: input.utmCampaign || undefined,
    metadata: {
      formType: "quote_request"
    }
  };
}