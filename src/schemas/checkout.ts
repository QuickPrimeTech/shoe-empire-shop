import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  phone: z.string().min(9, "Required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  deliveryZone: z.enum(["nairobi-cbd", "nairobi-suburbs", "mombasa", "other"]),
  address: z.string().min(3, "Required"),
  city: z.string().min(2, "Required"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["mpesa", "card", "cod"]),
  mpesaPhone: z.string().optional(),
});

export type CheckoutSchemaFormData = z.infer<typeof checkoutSchema>;
