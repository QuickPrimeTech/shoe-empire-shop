// @/sections/checkout/checkout-form.tsx
"use client";
import { useState } from "react";
import { useCartUIStore } from "@/store/cart-ui";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Info,
  Lock,
  MapPin,
  Truck,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { checkoutSchema, CheckoutSchemaFormData } from "@/schemas/checkout";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

const deliveryZones = [
  {
    value: "nairobi-cbd",
    label: "Nairobi CBD & Westlands",
    fee: 250,
    time: "Same-day",
  },
  {
    value: "nairobi-suburbs",
    label: "Nairobi Suburbs",
    fee: 300,
    time: "Next-day",
  },
  {
    value: "mombasa",
    label: "Mombasa / Kisumu / Nakuru",
    fee: 400,
    time: "1–2 days",
  },
  { value: "other", label: "Other Counties", fee: 500, time: "2–3 days" },
] as const;

export default function CheckoutForm() {
  const setStep = useCartUIStore((state) => state.setStep);
  const [mpesaStep, setMpesaStep] = useState<
    "input" | "sending" | "waiting" | "success"
  >("input");
  const clearCart = useCartStore((state) => state.clearCart);
  const form = useForm<CheckoutSchemaFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      notes: "",
      mpesaPhone: "",
      deliveryZone: "nairobi-cbd",
      paymentMethod: "mpesa",
    },
  });

  const { deliveryZone, paymentMethod, mpesaPhone } = form.watch();
  const selectedZone = deliveryZones.find((z) => z.value === deliveryZone);

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    if (data.paymentMethod === "mpesa") {
      if (!data.mpesaPhone || data.mpesaPhone.length < 9) {
        form.setError("mpesaPhone", {
          message: "Valid M-Pesa number required",
        });
        return;
      }
      setMpesaStep("sending");
      setTimeout(() => {
        setMpesaStep("waiting");
        setTimeout(() => {
          setMpesaStep("success");
          setTimeout(() => setStep("confirmed"), 1500);
        }, 3000);
      }, 1000);
    } else {
      clearCart();
      setStep("confirmed");
    }
  };

  const renderInput = (
    name: keyof z.infer<typeof checkoutSchema>,
    label: string,
    placeholder: string,
    full = false,
    isTextArea = false,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={full ? "sm:col-span-2" : ""}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isTextArea ? (
              <Textarea
                placeholder={placeholder}
                className="w-full bg-input rounded-xl border-border resize-none"
                rows={2}
                {...field}
              />
            ) : (
              <Input
                placeholder={placeholder}
                className="w-full bg-input rounded-xl border-border"
                {...field}
              />
            )}
          </FormControl>
          <FormMessage className="text-[10px]" />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        {/* Contact Info */}
        <div className="p-5 md:p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-base font-800 text-foreground mb-5 flex items-center gap-2">
            <User size={18} className="text-primary" /> Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderInput("firstName", "First Name", "Kelvin")}
            {renderInput("lastName", "Last Name", "Mwangi")}
            {renderInput("phone", "Phone (M-Pesa)", "0712 345 678", true)}
            {renderInput("email", "Email (optional)", "kelvin@email.com", true)}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="p-5 md:p-6 rounded-2xl border border-border bg-card flex flex-col gap-4">
          <h2 className="text-base font-800 text-foreground flex items-center gap-2">
            <MapPin size={18} className="text-primary" /> Delivery Address
          </h2>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Delivery Zone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {deliveryZones.map((zone) => (
                <button
                  key={zone.value}
                  type="button"
                  onClick={() => form.setValue("deliveryZone", zone.value)}
                  className={`flex justify-between p-3 rounded-xl border text-left transition-all ${deliveryZone === zone.value ? "border-primary bg-primary/5 text-primary" : "border-border"}`}
                >
                  <div>
                    <p className="text-xs font-semibold">{zone.label}</p>
                    <p className="text-[10px] text-muted-foreground font-500">
                      {zone.time}
                    </p>
                  </div>
                  <span className="text-xs font-800 shrink-0 ml-2">
                    KES {zone.fee}
                  </span>
                </button>
              ))}
            </div>
            {selectedZone && (
              <div className="mt-3 flex items-center gap-2 text-xs font-600 text-primary">
                <Truck size={14} /> {selectedZone.time} delivery · KES{" "}
                {selectedZone.fee} fee
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {renderInput(
              "address",
              "Street Address",
              "e.g. Tom Mboya Street",
              false,
            )}
            {renderInput("city", "City / Town", "e.g. Nairobi", false)}
            {renderInput(
              "notes",
              "Delivery Notes (optional)",
              "Any special instructions...",
              false,
              true,
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-5 md:p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-base font-800 text-foreground mb-5 flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> Payment Method
          </h2>

          <div className="flex flex-col gap-3 mb-5">
            {[
              {
                id: "mpesa",
                title: "M-Pesa",
                desc: "STK Push to your phone.",
                icon: (
                  <div className="w-10 h-10 rounded-xl bg-[#00A651] flex items-center justify-center text-white font-900 text-[9px]">
                    M-PESA
                  </div>
                ),
              },
              {
                id: "card",
                title: "Credit / Debit Card",
                desc: "Visa, Mastercard accepted",
                icon: (
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                ),
              },
              {
                id: "cod",
                title: "Cash on Delivery",
                desc: "Pay when your order arrives",
                icon: (
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Banknote size={20} />
                  </div>
                ),
              },
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => form.setValue("paymentMethod", pm.id as any)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === pm.id ? (pm.id === "mpesa" ? "border-[#00A651] bg-[#00A651]/5" : "border-primary bg-primary/5") : "border-border"}`}
              >
                {pm.icon}
                <div className="flex-1">
                  <p className="text-sm font-800 text-foreground">{pm.title}</p>
                  <p className="text-xs text-muted-foreground font-500">
                    {pm.desc}
                  </p>
                </div>
                {pm.id === "mpesa" && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[10px] font-800 rounded border border-emerald-600/20 shrink-0">
                    Recommended
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Payment Details */}
          {paymentMethod === "mpesa" && (
            <div className="rounded-xl bg-[#00A651]/10 border border-[#00A651]/20 p-4">
              {mpesaStep === "input" && (
                <FormField
                  control={form.control}
                  name="mpesaPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-[#00A651] uppercase tracking-wider mb-2 block">
                        M-Pesa Phone Number
                      </FormLabel>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-input border rounded-xl text-sm font-semibold text-muted-foreground">
                          +254
                        </div>
                        <FormControl>
                          <Input
                            placeholder="712 345 678"
                            type="tel"
                            className="flex-1 bg-input rounded-xl border-border"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/\D/g, "").slice(0, 9),
                              )
                            }
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-[10px] text-red-500" />
                    </FormItem>
                  )}
                />
              )}
              {mpesaStep === "sending" && (
                <div className="flex items-center gap-3 py-2 text-[#00A651]">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />{" "}
                  Sending STK Push...
                </div>
              )}
              {mpesaStep === "waiting" && (
                <div className="text-center py-2 text-[#00A651]">
                  <span className="text-2xl mb-2 block">📱</span>
                  <p className="text-sm font-800">Check your phone!</p>
                </div>
              )}
              {mpesaStep === "success" && (
                <div className="flex items-center gap-3 py-2 text-[#00A651]">
                  <Check size={16} /> Payment Confirmed!
                </div>
              )}
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Card Number"
                maxLength={19}
                className="bg-input rounded-xl"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="MM / YY"
                  maxLength={7}
                  className="bg-input rounded-xl"
                />
                <Input
                  placeholder="CVV"
                  maxLength={4}
                  className="bg-input rounded-xl"
                />
              </div>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 text-muted-foreground text-xs font-500">
              <Info className="shrink-0 mt-0.5 size-4" /> Have exact cash ready.
              Extra KES 50 COD fee applies.
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant={"outline"}
            size={"xl"}
            className="cursor-pointer sm:flex-1"
            onClick={() => setStep("cart")}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            type="submit"
            className="gap-2 cursor-pointer sm:flex-3"
            size={"xl"}
            disabled={mpesaStep === "sending" || mpesaStep === "waiting"}
          >
            {paymentMethod === "mpesa" && mpesaStep === "input" && (
              <>
                <span className="text-primary-foreground">M-PESA</span> Pay Now
              </>
            )}
            {paymentMethod === "mpesa" &&
              (mpesaStep === "sending" || mpesaStep === "waiting") && (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />{" "}
                  Processing...
                </>
              )}
            {paymentMethod === "card" && (
              <>
                <Lock size={16} /> Pay Securely
              </>
            )}
            {paymentMethod === "cod" && (
              <>
                <Check size={16} /> Place Order (COD)
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
