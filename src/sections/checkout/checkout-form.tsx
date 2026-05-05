// @/sections/checkout/checkout-form.tsx

"use client";
import React, { useState } from "react";
import { useCartUIStore } from "@/store/cart-ui";
import {
  Banknote,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Truck,
  User,
} from "lucide-react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

type PaymentMethod = "mpesa" | "card" | "cod";
type DeliveryZone = "nairobi-cbd" | "nairobi-suburbs" | "mombasa" | "other";

const deliveryZones: {
  value: DeliveryZone;
  label: string;
  fee: number;
  time: string;
}[] = [
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
];

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const setStep = useCartUIStore((state) => state.setStep);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("nairobi-cbd");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaStep, setMpesaStep] = useState<
    "input" | "sending" | "waiting" | "success"
  >("input");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMpesaPay = () => {
    if (!mpesaPhone || mpesaPhone.length < 9) return;
    setMpesaStep("sending");
    setTimeout(() => {
      setMpesaStep("waiting");
      setTimeout(() => {
        setMpesaStep("success");
        setTimeout(() => setStep("confirmed"), 1500);
      }, 3000);
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "mpesa") {
      handleMpesaPay();
    } else {
      setStep("confirmed");
    }
  };

  const selectedZone = deliveryZones.find((z) => z.value === deliveryZone);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* Contact Info */}
      <div className="p-5 md:p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-base font-800 text-foreground mb-5 flex items-center gap-2">
          <User size={18} className="text-primary" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              field: "firstName",
              label: "First Name",
              type: "text",
              placeholder: "Kelvin",
            },
            {
              field: "lastName",
              label: "Last Name",
              type: "text",
              placeholder: "Mwangi",
            },
            {
              field: "phone",
              label: "Phone (M-Pesa)",
              type: "tel",
              placeholder: "0712 345 678",
              full: true,
            },
            {
              field: "email",
              label: "Email (optional)",
              type: "email",
              placeholder: "kelvin@email.com",
              full: true,
            },
          ].map(({ field, label, type, placeholder, full }) => (
            <div key={field} className={full ? "sm:col-span-2" : ""}>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-500 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                required={field !== "email"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="p-5 md:p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-base font-800 text-foreground mb-5 flex items-center gap-2">
          <MapPin size={18} className="text-primary" />
          Delivery Address
        </h2>

        {/* Zone selector */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Delivery Zone
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {deliveryZones.map((zone) => (
              <button
                key={zone.value}
                type="button"
                onClick={() => setDeliveryZone(zone.value)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
                  deliveryZone === zone.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
                aria-pressed={deliveryZone === zone.value}
              >
                <div>
                  <p
                    className={`text-xs font-semibold ${deliveryZone === zone.value ? "text-primary" : "text-foreground"}`}
                  >
                    {zone.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-500">
                    {zone.time}
                  </p>
                </div>
                <span
                  className={`text-xs font-800 shrink-0 ml-2 ${deliveryZone === zone.value ? "text-primary" : "text-foreground"}`}
                >
                  KES {zone.fee}
                </span>
              </button>
            ))}
          </div>
          {selectedZone && (
            <div className="mt-3 flex items-center gap-2 text-xs font-600 text-primary">
              <Truck size={14} />
              {selectedZone.time} delivery · KES {selectedZone.fee} fee
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Street Address
            </label>
            <input
              type="text"
              placeholder="e.g. Tom Mboya Street, Apartment 4B"
              value={formData.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-500 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              City / Town
            </label>
            <input
              type="text"
              placeholder="e.g. Nairobi"
              value={formData.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-500 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Delivery Notes (optional)
            </label>
            <textarea
              placeholder="Any special instructions for delivery..."
              value={formData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              rows={2}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-500 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-5 md:p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-base font-800 text-foreground mb-5 flex items-center gap-2">
          <CreditCard size={18} className="text-primary" />
          Payment Method
        </h2>

        <div className="flex flex-col gap-3 mb-5">
          {/* M-Pesa */}
          <button
            type="button"
            onClick={() => setPaymentMethod("mpesa")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              paymentMethod === "mpesa"
                ? "border-[#00A651] bg-[#00A651]/5"
                : "border-border hover:border-muted-foreground"
            }`}
            aria-pressed={paymentMethod === "mpesa"}
          >
            <div className="w-10 h-10 rounded-xl bg-[#00A651] flex items-center justify-center shrink-0">
              <span className="text-white font-900 text-[9px] tracking-tight">
                M-PESA
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-800 text-foreground">M-Pesa</p>
              <p className="text-xs text-muted-foreground font-500">
                STK Push to your phone. Instant confirmation.
              </p>
            </div>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-800 rounded border border-primary/20 shrink-0">
              Recommended
            </span>
          </button>

          {/* Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              paymentMethod === "card"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
            aria-pressed={paymentMethod === "card"}
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <CreditCard size={20} className="text-foreground" />
            </div>
            <div>
              <p className="text-sm font-800 text-foreground">
                Credit / Debit Card
              </p>
              <p className="text-xs text-muted-foreground font-500">
                Visa, Mastercard accepted
              </p>
            </div>
          </button>

          {/* Cash on Delivery */}
          <button
            type="button"
            onClick={() => setPaymentMethod("cod")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              paymentMethod === "cod"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
            aria-pressed={paymentMethod === "cod"}
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Banknote size={20} className="text-foreground" />
            </div>
            <div>
              <p className="text-sm font-800 text-foreground">
                Cash on Delivery
              </p>
              <p className="text-xs text-muted-foreground font-500">
                Pay when your order arrives
              </p>
            </div>
          </button>
        </div>

        {/* M-Pesa Phone Input */}
        {paymentMethod === "mpesa" && (
          <div className="rounded-xl bg-[#00A651]/10 border border-[#00A651]/20 p-4">
            {mpesaStep === "input" && (
              <div>
                <label className="text-xs font-semibold text-[#00A651] uppercase tracking-wider mb-2 block">
                  M-Pesa Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-input border border-border rounded-xl text-sm font-semibold text-muted-foreground shrink-0">
                    +254
                  </div>
                  <input
                    type="tel"
                    placeholder="712 345 678"
                    value={mpesaPhone}
                    onChange={(e) =>
                      setMpesaPhone(
                        e.target.value.replace(/\D/g, "").slice(0, 9),
                      )
                    }
                    className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-[#00A651] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#00A651]/80 font-500 mt-2">
                  An STK push notification will be sent to this number
                </p>
              </div>
            )}

            {mpesaStep === "sending" && (
              <div className="flex items-center gap-3 py-2">
                <div className="w-5 h-5 border-2 border-[#00A651] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-[#00A651]">
                  Sending STK Push to +254{mpesaPhone}...
                </p>
              </div>
            )}

            {mpesaStep === "waiting" && (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#00A651]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="text-sm font-800 text-[#00A651] mb-1">
                  Check your phone!
                </p>
                <p className="text-xs text-muted-foreground font-500">
                  Enter your M-Pesa PIN to confirm payment
                </p>
                <div className="flex justify-center gap-1 mt-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#00A651] animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {mpesaStep === "success" && (
              <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#00A651] flex items-center justify-center shrink-0">
                  <Check size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-800 text-[#00A651]">
                    Payment Confirmed!
                  </p>
                  <p className="text-xs text-muted-foreground font-500">
                    Processing your order...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card fields */}
        {paymentMethod === "card" && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-500 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM / YY"
                  maxLength={7}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-500 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-500 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "cod" && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
            <InformationCircleIcon className="text-muted-foreground shrink-0 mt-0.5 size-16" />
            <p className="text-xs text-muted-foreground font-500">
              Have exact cash ready. Our rider will confirm your order before
              delivery. Extra KES 50 COD fee applies.
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary flex items-center justify-center gap-2 py-4 rounded-xl text-base font-800"
        disabled={mpesaStep === "sending" || mpesaStep === "waiting"}
      >
        {paymentMethod === "mpesa" && mpesaStep === "input" && (
          <>
            <span className="text-[#00A651] font-900 text-sm">M-PESA</span>
            Pay Now
          </>
        )}
        {paymentMethod === "mpesa" &&
          (mpesaStep === "sending" || mpesaStep === "waiting") && (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          )}
        {paymentMethod === "card" && (
          <>
            <Lock size={16} />
            Pay Securely
          </>
        )}
        {paymentMethod === "cod" && (
          <>
            <Check size={16} />
            Place Order (COD)
          </>
        )}
      </button>
    </form>
  );
}
