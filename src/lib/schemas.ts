import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  fulfillment: z
    .array(
      z.object({
        code: z.enum(["pickup", "delivery"]),
        label: z.string().min(1),
        priceCents: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  extras: z.array(
    z.object({
      code: z.enum(["assembly", "hardware"]),
      label: z.string().min(1),
      priceCents: z.number().int().nonnegative(),
      requires: z.enum(["pickup", "delivery"]).nullable(),
    }),
  ),
});

export const orderSchema = z
  .object({
    fulfillment: z.enum(["pickup", "delivery", ""]),
    assembly: z.boolean(),
    hardware: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment !== "pickup" && data.fulfillment !== "delivery") {
      ctx.addIssue({
        code: "custom",
        path: ["fulfillment"],
        message: "Choose pickup or delivery",
      });
    }

    if (data.fulfillment === "pickup" && data.assembly) {
      ctx.addIssue({
        code: "custom",
        path: ["assembly"],
        message: "Assembly requires delivery",
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderSchema>;
