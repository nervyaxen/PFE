import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";

const Pricing = () => {
  const { t } = useTranslation();
  const [yearly, setYearly] = useState(false);

  const plans = [
    { key: "free", featured: false },
    { key: "pro", featured: true },
    { key: "enterprise", featured: false },
  ] as const;

  return (
    <section className="min-h-screen pt-28 pb-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
            {t("pricing.title")}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">{t("pricing.subtitle")}</p>

          <div className="inline-flex items-center gap-3 glass-panel rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !yearly ? "bg-neon text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                yearly ? "bg-neon text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              {t("pricing.yearly")}
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const data = t(`pricing.${plan.key}`, { returnObjects: true }) as {
              name: string;
              price: string;
              desc: string;
              features: string[];
              cta: string;
              badge?: string;
            };
            const price = yearly
              ? Math.round(Number(data.price) * 10)
              : Number(data.price);

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative glass-panel rounded-2xl p-8 flex flex-col ${
                  plan.featured
                    ? "border-neon/40 glow-neon scale-[1.03]"
                    : ""
                }`}
              >
                {data.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon text-accent-foreground text-xs font-bold rounded-full flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    {data.badge}
                  </div>
                )}

                <h3 className="font-heading text-xl font-bold mb-1">{data.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{data.desc}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gradient-gold">
                    ${price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {price > 0 ? (yearly ? "/yr" : t("pricing.per")) : ""}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {data.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-neon mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.featured
                      ? "bg-neon text-accent-foreground glow-neon hover:opacity-90"
                      : "glass-panel text-foreground hover:border-neon/40"
                  }`}
                >
                  {data.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
