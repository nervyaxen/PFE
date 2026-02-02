import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import CursorNarrator from "@/components/machrou3i/CursorNarrator";
import { CreditCard, Lock, Check, Sparkles, Shield, ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

export default function Payment() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<string>("professional");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "bank">("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const plans = [
    { id: "starter", nameKey: "premium.tierStarter", price: "$29", periodKey: "premium.periodMonth", featureKeys: ["premium.featureBasicPm", "premium.featureTeamAnalytics", "premium.featureStandardReports", "premium.featureEmailSupport", "premium.featureUpTo5Projects"] },
    { id: "professional", nameKey: "premium.tierProfessional", price: "$79", periodKey: "premium.periodMonth", popular: true, featureKeys: ["premium.featureEverythingStarter", "premium.featureAIInsights", "premium.featureAdvancedAnalytics", "premium.featurePrioritySupport", "premium.featureUnlimitedProjects", "premium.featureCustomWorkflows", "premium.featureTeamCollaboration"] },
    { id: "enterprise", nameKey: "premium.tierEnterprise", price: "Custom", periodKey: "", featureKeys: ["premium.featureEverythingProfessional", "premium.featureDedicatedAI", "premium.featureFullAutomation", "premium.feature24_7Support", "premium.featureCustomIntegrations", "premium.featureAdvancedSecurity", "premium.featureOnPremise", "premium.featureAccountManager"] },
  ];

  return (
    <div className="relative min-h-screen bg-hero">
      <Helmet>
        <title>Payment – Machrou3i</title>
        <meta name="description" content="Secure payment for Machrou3i premium plans" />
      </Helmet>

      <CursorNarrator />

      <main className="relative min-h-screen px-6 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={reduceMotion ? false : { opacity: 0, y: -20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="glass glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium mb-6"
              data-narrate="Back to Home|Return to the main page"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("buttons.backToHome")}
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2 mb-4" data-narrate="Secure Payment|Your payment is protected with industry-standard encryption.">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                <Lock className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">{t("payment.securePayment")}</p>
            </div>

            <h1 className="text-3xl font-semibold leading-tight md:text-4xl" data-narrate="Complete Your Purchase|Choose your plan and securely complete payment.">
              {t("payment.completePurchase")}
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              {t("payment.completePurchaseDesc")}
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Plan Selection */}
            <div className="lg:col-span-1">
              <div className="glass rounded-[2rem] p-6 sticky top-6" data-narrate="Select Plan|Choose the plan that fits your needs.">
                <h2 className="text-lg font-semibold mb-4">{t("labels.selectPlan")}</h2>
                <div className="space-y-3">
                  {plans.map((plan, idx) => (
                    <motion.button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full glass glass-hover rounded-xl p-4 text-left transition-all ${
                        selectedPlan === plan.id ? "neon-outline" : ""
                      } ${plan.popular ? "border-2 border-gold/30" : ""}`}
                      initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                      animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                      data-narrate={`${t(plan.nameKey)} ${t("payment.planLabel")}|${plan.price}${plan.periodKey ? t(plan.periodKey) : ""} • ${plan.featureKeys.length} ${t("labels.featuresIncluded")}`}
                    >
                      {plan.popular && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold mb-2">
                          <Sparkles className="h-3 w-3" />
                          {t("labels.popular")}
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{t(plan.nameKey)}</span>
                        <div className="text-right">
                          <span className="text-lg font-bold">{plan.price}</span>
                          {plan.periodKey && <span className="text-sm text-muted-foreground">{t(plan.periodKey)}</span>}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{plan.featureKeys.length} {t("labels.featuresIncluded")}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <div className="glass rounded-[2rem] p-6" data-narrate="Payment Method|Choose your preferred payment method.">
                <h2 className="text-lg font-semibold mb-4">{t("labels.paymentMethod")}</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "card", labelKey: "labels.creditCard", icon: <CreditCard className="h-5 w-5" /> },
                    { id: "paypal", labelKey: "labels.creditCard", icon: <Shield className="h-5 w-5" /> },
                    { id: "bank", labelKey: "labels.bankTransfer", icon: <Lock className="h-5 w-5" /> },
                  ].map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as "card" | "paypal" | "bank")}
                      className={`glass glass-hover rounded-xl p-4 text-center transition-all ${
                        paymentMethod === method.id ? "neon-outline" : ""
                      }`}
                      whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
                      data-narrate={`${t(method.labelKey)}|Pay securely with ${t(method.labelKey)}`}
                    >
                      <div className="mb-2 flex justify-center">{method.icon}</div>
                      <span className="text-sm font-medium">{method.id === "paypal" ? "PayPal" : t(method.labelKey)}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <motion.div
                  className="glass rounded-[2rem] p-6"
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  data-narrate="Card Details|Enter your card information securely."
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-neon" />
                    <h2 className="text-lg font-semibold">{t("labels.cardDetails")}</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Card Number|Enter your 16-digit card number">
                        {t("labels.cardNumber")}
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                          placeholder={t("placeholders.cardNumber")}
                          maxLength={19}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Expiry Date|MM/YY format">
                          {t("labels.expiryDate")}
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                            placeholder={t("placeholders.expiryDate")}
                            maxLength={5}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="CVV|3-digit security code">
                          {t("labels.cvv")}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                            className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                            placeholder={t("placeholders.cvv")}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Cardholder Name|Name as it appears on card">
                        {t("labels.cardholderName")}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.cardholderName}
                          onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                          className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                          placeholder={t("placeholders.name")}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Billing Information */}
              <motion.div
                className="glass rounded-[2rem] p-6"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                data-narrate="Billing Information|Enter your billing address details."
              >
                <h2 className="text-lg font-semibold mb-4">{t("labels.billingInfo")}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Email|Receipt will be sent to this email">
                      {t("labels.email")}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                      placeholder={t("placeholders.email")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Billing Address|Street address">
                      {t("labels.billingAddress")}
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                      placeholder={t("placeholders.billingAddress")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="City|City name">
                        {t("labels.city")}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                        placeholder={t("placeholders.city")}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="ZIP Code|Postal code">
                        {t("labels.zipCode")}
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                        placeholder={t("placeholders.zipCode")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Country|Select your country">
                      {t("labels.country")}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                      placeholder={t("placeholders.country")}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Security Features */}
              <div className="glass rounded-[2rem] p-6" data-narrate="Security Guarantee|Your payment is protected with industry-standard encryption.">
                <div className="mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-neon" />
                  <h3 className="text-lg font-semibold">{t("payment.securityGuarantee")}</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {[
                    { featureKey: "payment.sslEncrypted", descKey: "payment.sslEncryptedDesc" },
                    { featureKey: "payment.pciCompliant", descKey: "payment.pciCompliantDesc" },
                    { featureKey: "payment.noStorage", descKey: "payment.noStorageDesc" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-2 rounded-xl bg-surface/40 p-3"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      data-narrate={`${t(item.featureKey)}|${t(item.descKey)}`}
                    >
                      <Check className="h-4 w-4 mt-0.5 text-neon flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{t(item.featureKey)}</p>
                        <p className="text-xs text-muted-foreground">{t(item.descKey)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="glass rounded-[2rem] p-6" data-narrate="Order Summary|Review your order before completing payment.">
                <h2 className="text-lg font-semibold mb-4">{t("labels.orderSummary")}</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t(plans.find((p) => p.id === selectedPlan)?.nameKey ?? "premium.tierStarter")} {t("payment.planLabel")}
                    </span>
                    <span className="font-semibold">
                      {plans.find((p) => p.id === selectedPlan)?.price}
                      {plans.find((p) => p.id === selectedPlan)?.periodKey ? t(plans.find((p) => p.id === selectedPlan)!.periodKey) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-base font-semibold">{t("labels.total")}</span>
                    <span className="text-xl font-bold text-neon">
                      {plans.find((p) => p.id === selectedPlan)?.price}
                      {plans.find((p) => p.id === selectedPlan)?.periodKey ? t(plans.find((p) => p.id === selectedPlan)!.periodKey) : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                className="w-full glass rounded-xl bg-neon px-6 py-4 text-base font-semibold text-neon-foreground transition-all hover:bg-neon/90"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                data-narrate="Complete Payment|Securely complete your purchase"
              >
                {t("buttons.completePayment")}
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
